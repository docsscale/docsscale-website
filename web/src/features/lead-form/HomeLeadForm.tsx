'use client';

// Lead form in the homepage's final "Start here" section.
import { LEAD_FORM_MESSAGES, LOCATION_OPTIONS, SPECIALTY_OPTIONS } from '@/content/lead-form';
import { T } from '@/styles/tokens';
import { StatusAnnouncer, useFocusOnMount } from './a11y';
import { errorStyle, fieldStyle as field, textareaStyle } from './fieldStyles';
import { Honeypot } from './Honeypot';
import { useLeadSubmit } from './useLeadSubmit';

const row = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,140px),1fr))',
  gap: 10,
} as const;

export function HomeLeadForm() {
  const { status, error, onSubmit } = useLeadSubmit('home');
  const submitting = status === 'submitting';

  if (status === 'sent') return <HomeLeadSuccess />;

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Honeypot />
      <div style={row}>
        <input required name="name" placeholder="Your name" aria-label="Your name" style={field} />
        <input required name="clinicName" placeholder="Clinic name" aria-label="Clinic name" style={field} />
      </div>
      <div style={row}>
        <input
          required
          type="email"
          name="email"
          placeholder="Work email"
          aria-label="Work email"
          style={field}
        />
        <input type="tel" name="phone" placeholder="Mobile" aria-label="Mobile" style={field} />
      </div>
      <div style={row}>
        <select required name="specialty" aria-label="Specialty" style={field} defaultValue="">
          <option value="" disabled>
            Specialty
          </option>
          {SPECIALTY_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select name="locations" aria-label="Number of locations" style={field} defaultValue="">
          <option value="" disabled>
            Locations
          </option>
          {LOCATION_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <textarea
        rows={3}
        name="message"
        placeholder="What's the biggest gap right now? (optional)"
        aria-label="What's the biggest gap right now? (optional)"
        style={textareaStyle}
      />
      <button
        type="submit"
        disabled={submitting}
        className="btn-teal"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 54,
          border: 0,
          background: T.teal,
          color: '#FFFFFF',
          fontWeight: 700,
          fontSize: 16,
          borderRadius: 999,
          cursor: submitting ? 'default' : 'pointer',
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? LEAD_FORM_MESSAGES.sending : 'Book a strategy call'}
      </button>
      {status === 'error' && (
        <div role="alert" style={errorStyle}>
          {error}
        </div>
      )}
      <StatusAnnouncer message={submitting ? LEAD_FORM_MESSAGES.sending : ''} />
      <div style={{ fontSize: 13, color: T.teal, textAlign: 'center', fontWeight: 600 }}>
        {LEAD_FORM_MESSAGES.fallbackContact}
      </div>
    </form>
  );
}

/** Shown in place of the form after a successful send; focus moves to its message. */
function HomeLeadSuccess() {
  const headingRef = useFocusOnMount<HTMLDivElement>();
  return (
    <div
      style={{
        background: T.surface,
        borderRadius: 20,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        textAlign: 'center',
      }}
    >
      <span
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: T.sageBg,
          color: T.sageFg,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 19,
          margin: '0 auto',
        }}
      >
        ✓
      </span>
      <div
        ref={headingRef}
        tabIndex={-1}
        style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-.02em', outline: 'none' }}
      >
        Got it, we&apos;ll be in touch.
      </div>
      <p style={{ margin: 0, fontSize: 14, color: T.body, lineHeight: 1.5 }}>
        Replies within one business day.
      </p>
    </div>
  );
}
