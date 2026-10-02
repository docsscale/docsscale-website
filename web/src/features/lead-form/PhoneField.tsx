'use client';

// Phone number with a country picker (default United States, never guessed from
// the visitor's IP). On submit the number is checked for the chosen country and
// sent as E.164 (+17135550100), so GoHighLevel never
// has to guess the country (it used to prefix +1 to numbers typed without one).
// Validation uses libphonenumber-js, loaded only once the field is used.
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { DEFAULT_PHONE_COUNTRY, PHONE_COUNTRIES } from '@/content/phone-countries';
import { PHONE_MESSAGES } from '@/content/lead-form';
import { formForPath, trackFormError } from '@/features/analytics/track';
import { T } from '@/styles/tokens';

/** Returns the fields to send (e.g. { phone: '+1…' }), or null when invalid. */
export type Validator = () => Promise<Record<string, string> | null>;
type Variant = { input: CSSProperties; className?: string; height: number; radius: number };

const loadLib = () => import('libphonenumber-js/min');
const ERROR = '#B4432F';
const byCode = new Map(PHONE_COUNTRIES.map((c) => [c[0], c]));
const ordered = [
  byCode.get(DEFAULT_PHONE_COUNTRY)!,
  ...PHONE_COUNTRIES.filter((c) => c[0] !== DEFAULT_PHONE_COUNTRY),
];

export function PhoneField({
  register,
  variant,
  placeholder,
}: {
  register: (validator: Validator) => () => void;
  variant: Variant;
  placeholder: string;
}) {
  const id = useId();
  const [country, setCountry] = useState(DEFAULT_PHONE_COUNTRY);
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const state = useRef({ country, raw });
  useEffect(() => {
    state.current = { country, raw };
  }, [country, raw]);

  useEffect(() => {
    const fail = (message: string) => {
      trackFormError(formForPath(window.location.pathname), 'phone');
      setError(message);
      inputRef.current?.focus();
      return null;
    };
    return register(async () => {
      const { country: c, raw: r } = state.current;
      const name = byCode.get(c)?.[1] ?? c;
      if (!r.trim()) return fail(PHONE_MESSAGES.required);
      const { parsePhoneNumberFromString } = await loadLib();
      const parsed = parsePhoneNumberFromString(r, c as never);
      if (!parsed?.isValid()) return fail(PHONE_MESSAGES.invalid(name));
      setError('');
      return { phone: parsed.number };
    });
  }, [register]);

  const dial = byCode.get(country)?.[2] ?? '1';
  const border = error ? ERROR : focused ? T.teal : undefined;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {/* Compact "US +1" box; the transparent native select on top keeps the
            full country list, keyboard use and screen-reader support. */}
        <div
          className={variant.className}
          style={{
            ...variant.input,
            position: 'relative',
            width: 96,
            flex: '0 0 96px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
            padding: '0 12px',
            ...(border ? { borderColor: border } : {}),
          }}
        >
          <span aria-hidden="true" style={{ whiteSpace: 'nowrap' }}>
            {country} +{dial}
          </span>
          <svg aria-hidden="true" width="10" height="6" viewBox="0 0 10 6" style={{ flexShrink: 0 }}>
            <path
              d="M1 1l4 4 4-4"
              fill="none"
              stroke={T.caption}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <select
            aria-label="Phone country code"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setError('');
            }}
            onFocus={() => {
              setFocused(true);
              void loadLib();
            }}
            onBlur={() => setFocused(false)}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
              width: '100%',
              height: '100%',
            }}
          >
            {ordered.map(([code, name, d]) => (
              <option key={code} value={code}>
                {name} +{d}
              </option>
            ))}
          </select>
        </div>
        <input
          ref={inputRef}
          type="tel"
          autoComplete="tel-national"
          data-field="phone"
          inputMode="tel"
          required
          placeholder={placeholder}
          aria-label={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            if (error) setError('');
          }}
          onFocus={() => void loadLib()}
          className={variant.className}
          style={{ ...variant.input, flex: 1, minWidth: 0, ...(error ? { borderColor: ERROR } : {}) }}
        />
      </div>
      {error && (
        <span id={`${id}-error`} role="alert" style={{ fontSize: 13, color: ERROR, fontWeight: 600 }}>
          {error}
        </span>
      )}
    </div>
  );
}

/** Field validators for a form: PhoneField registers here; run them before sending. */
export function useValidators() {
  const validators = useRef(new Set<Validator>());
  const register = useCallback((v: Validator) => {
    validators.current.add(v);
    return () => {
      validators.current.delete(v);
    };
  }, []);
  /** Runs every validator; the merged fields to send, or null if any is invalid. */
  const validate = useCallback(async (): Promise<Record<string, string> | null> => {
    const results = await Promise.all([...validators.current].map((v) => v()));
    return results.some((r) => r === null) ? null : Object.assign({}, ...results);
  }, []);
  return { register, validate };
}
