// Copy and options shared by the main-site lead forms (homepage and /book-a-call/).
// The field names (name, clinicName, email …) are what server/…/forms.php expects;
// rename them in both places or not at all.
import { SERVED_SPECIALTIES } from './served-specialties';

export const SPECIALTY_OPTIONS = [...SERVED_SPECIALTIES, 'Other'] as const;

// Must match the GHL "Locations" field's options exactly (plain hyphen in 3-5).
export const LOCATION_OPTIONS = ['1', '2', '3-5', '6+'] as const;

export const PHONE_MESSAGES = {
  required: 'Please enter your phone number.',
  invalid: (country: string) => `Please enter a valid phone number for ${country}, or pick another country.`,
} as const;

export const LEAD_FORM_MESSAGES = {
  sending: 'Sending…',
  genericError: 'Something went wrong. Please email info@docsscale.com instead.',
  badResponse: 'Unexpected response from server.',
  networkError: "Couldn't reach the server. Please email info@docsscale.com instead.",
  /** Who the confirmation email comes from (book-a-call success message). */
  replyFrom: 'Abdul',
  fallbackContact: 'Or email info@docsscale.com · replies within one business day',
} as const;
