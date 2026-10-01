import { T } from '@/styles/tokens';

// Input/select style shared by the main-site lead forms.
export const fieldStyle = {
  height: 50,
  border: `1px solid ${T.hairline}`,
  borderRadius: 14,
  background: T.surface,
  padding: '0 14px',
  fontSize: 15,
  color: T.ink,
  width: '100%',
  boxSizing: 'border-box',
} as const;

export const textareaStyle = {
  border: `1px solid ${T.hairline}`,
  borderRadius: 14,
  background: T.surface,
  padding: 14,
  fontSize: 15,
  color: T.ink,
  resize: 'vertical',
  width: '100%',
  boxSizing: 'border-box',
} as const;

export const errorStyle = {
  fontSize: 13,
  color: T.peachFg,
  textAlign: 'center',
  fontWeight: 600,
  background: T.peachBg,
  borderRadius: 12,
  padding: '10px 14px',
} as const;

/** PhoneField look on the main-site forms. */
export const phoneVariant = { input: fieldStyle, height: 50, radius: 14 };
