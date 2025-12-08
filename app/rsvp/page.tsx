'use client';

import { useState, useMemo, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import { PageHeading } from '../../components';

type Guest = {
  id: string;
  full_name: string;
  email: string | null;
  guest_plus_one: string | null;
  invited_to_friday: boolean;
  invited_to_saturday: boolean;
};

export default function RsvpPage() {
  const hasEnv = useMemo(() => {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

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

  const handleGuestSelect = (guest: Guest) => {
    setSelectedGuest(guest);
    setSearchTerm(guest.full_name);
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleBackToSearch = () => {
    setSelectedGuest(null);
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <main id="main-content" className="container py-10">
      <PageHeading title="RSVP" subtitle="Please RSVP by June 1, 2026." />

      <div className="flex flex-col gap-8 items-start lg:flex-row">
        <div className="flex-1 p-6 space-y-5 max-w-lg rounded-lg border shadow-sm border-warmSand bg-cream">
          {!selectedGuest ? (
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
                              onClick={() => handleGuestSelect(guest)}
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
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate">Selected guest:</p>
                  <p className="text-lg font-medium text-ink">{selectedGuest.full_name}</p>
                  {selectedGuest.guest_plus_one && (
                    <p className="text-sm text-slate">+ {selectedGuest.guest_plus_one}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleBackToSearch}
                  className="text-sm underline rounded text-autumnGreen hover:text-autumnGreen/80 focus:outline-none focus:ring-2 focus:ring-autumnGreen focus:ring-offset-2"
                >
                  Change
                </button>
              </div>
              <div className="pt-4 border-t border-warmSand">
                <p className="text-slate">RSVP form will appear here...</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 lg:max-w-sm">
          <img
            src="/images/dachshund.png"
            alt="Adorable dachshund"
            className="w-full h-auto rounded-lg shadow-sm"
          />
        </div>
      </div>
    </main>
  );
}

