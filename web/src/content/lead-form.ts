// Copy and options shared by the main-site lead forms (homepage and /book-a-call/).
// The field names (name, clinicName, email …) are what server/…/forms.php expects;
// rename them in both places or not at all.

export const SPECIALTY_OPTIONS = [
  'Dental',
  'Chiropractic',
  'Physical therapy',
  'Med spa',
  'Dermatology',
  'Primary care',
  'Optometry',
  'Mental health',
  'Other',
] as const;

export const LOCATION_OPTIONS = ['1', '2', '3–5', '6+'] as const;

export const LEAD_FORM_MESSAGES = {
  sending: 'Sending…',
  genericError: 'Something went wrong. Please call us instead.',
  badResponse: 'Unexpected response from server.',
  networkError: "Couldn't reach the server. Please call us instead.",
  fallbackContact: 'Or call (512) 555-0148 · replies within one business day',
} as const;
