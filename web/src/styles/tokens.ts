// Design tokens used by inline styles. The same values exist as CSS variables in
// globals.css (--bg, --teal …) for stylesheet rules and hover states.
export const T = {
  bg: '#FAF9F6',
  band: '#F3F1EC',
  surface: '#FFFFFF',
  ink: '#1A1A1A',
  body: '#5C5A55',
  caption: '#6C6962', // was #8F8C85; darkened to pass WCAG AA (4.5:1) on every background it's used on
  hairline: '#E6E3DC',
  hairlineHover: '#D3CFC6',
  teal: '#0F5F63',
  tealHover: '#0B4C4F',
  peachBg: '#FBE7D6',
  peachFg: '#8A4B1E',
  tealTintBg: '#DDEEEE',
  tealTintFg: '#0F5F63',
  lavenderBg: '#E5DFF5',
  lavenderFg: '#4A3D75',
  sageBg: '#DAEDE2',
  sageFg: '#1F5A40',
} as const;

/** Colour pair for each stage of the Attract → Capture → Convert → Retain system. */
export const STAGE_COLORS = {
  attract: { bg: T.peachBg, fg: T.peachFg },
  capture: { bg: T.tealTintBg, fg: T.tealTintFg },
  convert: { bg: T.lavenderBg, fg: T.lavenderFg },
  retain: { bg: T.sageBg, fg: T.sageFg },
} as const;

export type Stage = keyof typeof STAGE_COLORS;
