'use client';

import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Guest } from '../../app/rsvp/types';

interface GuestSearchProps {
  onGuestSelect: (guest: Guest) => void;
}

/**
 * Normalizes a search term by removing titles and common words
 * Example: "Dr. and Mrs. Paul Verticchio" -> "Paul Verticchio"
 */
function normalizeSearchTerm(term: string): string {
  return term
    // Remove common titles (with optional periods)
    .replace(/\b(Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Miss\.?|Rev\.?|Commander\.?|Messrs\.?)\s+/gi, '')
    // Remove "and" and "&"
    .replace(/\b(and|&)\s+/gi, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export function GuestSearch({ onGuestSelect }: GuestSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedTerm = useDebouncedValue(searchTerm, 300);

  // Determine if the debounced term meets the 2-word privacy threshold
  const normalized = normalizeSearchTerm(debouncedTerm.trim());
  const qualifiedWords = normalized.split(/\s+/).filter((w) => w.length >= 2);
  const meetsThreshold = qualifiedWords.length >= 2;

  // Only query Convex when the threshold is met; pass "skip" to disable the query
  const results = useQuery(
    api.guests.search,
    meetsThreshold ? { searchTerm: normalized } : 'skip',
  );

  // Convex search is OR-based, so filter client-side to ensure every
  // query word matches at least one word in the guest's names (prefix match)
  const filtered = (results ?? []).filter((guest) => {
    const nameWords = `${guest.full_name} ${guest.guest_plus_one ?? ''}`
      .toLowerCase()
      .split(/\s+/);
    return qualifiedWords.every((qw) => {
      const q = qw.toLowerCase();
      return nameWords.some((nw) => nw.startsWith(q));
    });
  });

  // Limit to top 3 results to avoid exposing the guest list
  const searchResults = filtered.slice(0, 3) as Guest[];
  const isSearching = meetsThreshold && results === undefined;

  return (
    <>
      <div>
        <label htmlFor="name_search" className="block text-sm font-medium text-ink">
          Search for your name *
        </label>
        <input
          id="name_search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type your first and last name..."
          className={`px-4 py-3 mt-1 w-full rounded-lg border shadow-sm focus:outline-none transition-all duration-200 touch-manipulation min-h-[48px] text-base border-warmSand focus:border-autumnGreen focus:ring-2 focus:ring-autumnGreen/20`}
        />
      </div>

      {/* Search hint when typing but not yet enough to search */}
      {(() => {
        const trimmed = searchTerm.trim();
        if (!trimmed) return null;
        const words = normalizeSearchTerm(trimmed).split(/\s+/).filter((w) => w.length > 0);
        const qualified = words.filter((w) => w.length >= 2);
        if (qualified.length >= 2) return null; // Threshold met, results section handles it
        return (
          <p className="mt-2 text-sm text-slate">
            {words.length < 2
              ? 'Enter your first and last name to search.'
              : 'Keep typing your last name\u2026'}
          </p>
        );
      })()}

      {/* Search Results */}
      {meetsThreshold && (
        <div className="mt-4">
          {isSearching ? (
            <div className="flex justify-center items-center py-8 text-slate">
              <svg
                className="mr-2 w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-ink">Select your name:</p>
              <ul className="space-y-2" role="listbox">
                {searchResults.map((guest) => (
                  <li key={guest._id}>
                    <button
                      type="button"
                      onClick={() => onGuestSelect(guest)}
                      className="w-full px-4 py-3 text-left rounded-lg border border-warmSand bg-white hover:bg-warmSand/20 hover:border-autumnGreen focus:outline-none focus:ring-2 focus:ring-autumnGreen focus:ring-offset-2 transition-all duration-200 touch-manipulation min-h-[48px]"
                      role="option"
                      aria-selected={false}
                    >
                      <div className="font-medium text-ink">{guest.full_name}</div>
                      {guest.guest_plus_one && (
                        <div className="mt-1 text-sm text-slate">+ {guest.guest_plus_one}</div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="py-8 text-center text-slate">
              <p>No guests found matching &ldquo;{searchTerm}&rdquo;</p>
              <p className="mt-2 text-sm">Please check your spelling or contact us if you can&apos;t find your name.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
