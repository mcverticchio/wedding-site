'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import type { Guest } from '../../app/rsvp/types';

interface GuestSearchProps {
  onGuestSelect: (guest: Guest) => void;
  hasEnv: boolean;
}

export function GuestSearch({ onGuestSelect, hasEnv }: GuestSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    if (!searchTerm.trim() || !hasEnv) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(false);
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm.trim());
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, hasEnv]);

  const performSearch = async (term: string) => {
    if (!term || term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setSearchError('Search is not available. Please contact the site administrator.');
        setIsSearching(false);
        return;
      }

      // Search guests table directly (case-insensitive partial match)
      // Search both full_name and guest_plus_one fields
      const searchPattern = `%${term}%`;
      const { data, error } = await supabase
        .from('guests')
        .select('id, full_name, email, guest_plus_one, invited_to_friday, invited_to_saturday')
        .or(`full_name.ilike.${searchPattern},guest_plus_one.ilike.${searchPattern}`)
        .order('full_name', { ascending: true })
        .limit(20);

      if (error) {
        console.error('Search error:', error);
        setSearchError('Unable to search. Please try again.');
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('An error occurred while searching. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

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
          placeholder="Type your name to search..."
          className={`px-4 py-3 mt-1 w-full rounded-lg border shadow-sm focus:outline-none transition-all duration-200 touch-manipulation min-h-[48px] text-base ${
            searchError
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-warmSand focus:border-autumnGreen focus:ring-2 focus:ring-autumnGreen/20'
          }`}
          disabled={!hasEnv}
          aria-describedby={searchError ? 'search-error' : undefined}
        />
        {searchError && (
          <p id="search-error" className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
            {searchError}
          </p>
        )}
        {!hasEnv && (
          <p className="mt-1 text-sm text-slate" role="alert">
            Supabase not configured; search is disabled.
          </p>
        )}
      </div>

      {/* Search Results */}
      {searchTerm.trim().length >= 2 && (
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
                  <li key={guest.id}>
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
          ) : hasSearched && !isSearching && searchResults.length === 0 && searchTerm.trim().length >= 2 ? (
            <div className="py-8 text-center text-slate">
              <p>No guests found matching &ldquo;{searchTerm}&rdquo;</p>
              <p className="mt-2 text-sm">Please check your spelling or contact us if you can&apos;t find your name.</p>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}

