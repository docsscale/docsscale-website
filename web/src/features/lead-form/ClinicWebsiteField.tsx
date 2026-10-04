import type { CSSProperties } from 'react';

// Optional clinic website (homepage and Book a Call forms). Sent as
// "clinicWebsite" ("website" is the spam trap's name, see Honeypot.tsx) and saved
// to GoHighLevel's standard Website field. Plain text, not type="url", so
// "brightdental.com" is accepted; the server adds https://.
export function ClinicWebsiteField({ style }: { style: CSSProperties }) {
  return (
    <input
      type="text"
      name="clinicWebsite"
      inputMode="url"
      autoComplete="url"
      maxLength={200}
      placeholder="Clinic website (optional)"
      aria-label="Clinic website (optional)"
      style={style}
    />
  );
}
