'use client';

// The form on /book-a-call/. Same fields and endpoint as the homepage form,
// different layout and wording.
import { LEAD_FORM_MESSAGES, LOCATION_OPTIONS, SPECIALTY_OPTIONS } from '@/content/lead-form';
import { T } from '@/styles/tokens';
import { StatusAnnouncer, useFocusOnMount } from './a11y';
import { errorStyle, fieldStyle, textareaStyle } from './fieldStyles';
import { Honeypot } from './Honeypot';
import { useLeadSubmit } from './useLeadSubmit';

const row = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,180px),1fr))',
  gap: 10,
} as const;

export function BookCallForm() {
  const { status, error, onSubmit } = useLeadSubmit('book-a-call');
  const submitting = status === 'submitting';

  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: T.tealTintBg,
        borderRadius: 28,
        padding: 'clamp(24px,3vw,36px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <Honeypot />
      {status === 'sent' ? (
        <BookCallSuccess />
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '.08em',
                color: T.teal,
              }}
            >
              Tell us about your clinic
            </span>
            <span style={{ fontSize: 12, color: T.teal, fontWeight: 600 }}>2 minutes</span>
          </div>
          <div style={row}>
            <input required name="name" placeholder="Your name" aria-label="Your name" style={fieldStyle} />
            <input
              required
              name="clinicName"
              placeholder="Clinic name"
              aria-label="Clinic name"
              style={fieldStyle}
            />
          </div>
          <div style={row}>
            <input
              required
              type="email"
              name="email"
              placeholder="Work email"
              aria-label="Work email"
              style={fieldStyle}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone (optional)"
              aria-label="Phone (optional)"
              style={fieldStyle}
            />
          </div>
          <div style={row}>
            <select required name="specialty" aria-label="Specialty" style={fieldStyle} defaultValue="">
              <option value="" disabled>
                Specialty
              </option>
              {SPECIALTY_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <select name="locations" aria-label="Number of locations" style={fieldStyle} defaultValue="">
              <option value="" disabled>
                Locations
              </option>
              {LOCATION_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <textarea
            rows={4}
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
            {submitting ? LEAD_FORM_MESSAGES.sending : 'Request my strategy call'}
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
          <div style={{ fontSize: 12, color: T.body, textAlign: 'center', lineHeight: 1.5 }}>
            We never share your details. No patient information is needed for this call.
          </div>
        </>
      )}
    </form>
  );
}

/** Shown in place of the form after a successful send; focus moves to its message. */
function BookCallSuccess() {
  const headingRef = useFocusOnMount<HTMLDivElement>();
  return (
    <div
      style={{
        background: T.surface,
        borderRadius: 20,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        textAlign: 'center',
      }}
    >
      <span
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: T.sageBg,
          color: T.sageFg,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 22,
          margin: '0 auto',
        }}
      >
        ✓
      </span>
      <div
        ref={headingRef}
        tabIndex={-1}
        style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-.03em', outline: 'none' }}
      >
        Got it. We&apos;ll reply within one business day.
      </div>
      <p style={{ margin: 0, fontSize: 15, color: T.body, lineHeight: 1.5 }}>
        Check your inbox for a note from {LEAD_FORM_MESSAGES.replyFrom} with two or three time options.
      </p>
    </div>
  );
}
