'use client';

// Shows the booking view, or the confirmation when GoHighLevel sends the
// visitor back with ?booked=1. The booking view is in the static HTML (the live
// page rendered nothing until JavaScript ran); the check runs after load.
import { useEffect, useState, type ReactNode } from 'react';

export function BookingSwitch({ booking, confirmation }: { booking: ReactNode; confirmation: ReactNode }) {
  const [booked, setBooked] = useState(false);
  useEffect(() => {
    // Reading location in an effect keeps the server HTML and first render identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of an external value (the URL)
    setBooked(new URLSearchParams(window.location.search).get('booked') === '1');
  }, []);
  return <>{booked ? confirmation : booking}</>;
}
