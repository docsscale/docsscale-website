'use client';

import { useEffect } from 'react';
import { trackLeadMagnetView } from './track';

/** Sends view_lead_magnet once when a lead-magnet landing page opens. */
export function TrackLeadMagnetView({ leadMagnet }: { leadMagnet: string }) {
  useEffect(() => trackLeadMagnetView(leadMagnet), [leadMagnet]);
  return null;
}
