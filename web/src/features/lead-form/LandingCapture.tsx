'use client';

// Records the landing page and UTM tags once per page load (see attribution.ts).
import { useEffect } from 'react';
import { rememberLanding } from './attribution';

export function LandingCapture() {
  useEffect(() => {
    rememberLanding();
  }, []);
  return null;
}
