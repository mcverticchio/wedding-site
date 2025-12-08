'use client';

import { useState, useMemo } from 'react';
import { PageHeading } from '../../components';
import { GuestSearch } from '../../components/data/GuestSearch';
import { RsvpForm } from '../../components/data/RsvpForm';
import type { Guest } from './types';

export default function RsvpPage() {
  const hasEnv = useMemo(() => {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const handleGuestSelect = (guest: Guest) => {
    setSelectedGuest(guest);
  };

  const handleBackToSearch = () => {
    setSelectedGuest(null);
  };

  return (
    <main id="main-content" className="container py-10">
      <PageHeading title="RSVP" subtitle="Please RSVP by June 1, 2026." />

      <div className="flex flex-col gap-8 items-start lg:flex-row">
        <div className="flex-1 p-6 space-y-5 max-w-lg rounded-lg border shadow-sm border-warmSand bg-cream">
          {!selectedGuest ? (
            <GuestSearch onGuestSelect={handleGuestSelect} hasEnv={hasEnv} />
          ) : (
            <RsvpForm guest={selectedGuest} onBackToSearch={handleBackToSearch} hasEnv={hasEnv} />
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
