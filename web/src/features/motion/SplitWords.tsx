// Server-rendered version of SiteMotion's word split: each word sits in a
// clipping span and rises in with a CSS animation (styles/motion.css), so the
// headline animates from first paint instead of after the JavaScript loads.
// `start` continues the stagger across several calls within one heading.
import type { CSSProperties } from 'react';

const clip: CSSProperties = {
  display: 'inline-block',
  overflow: 'hidden',
  verticalAlign: 'bottom',
  paddingBottom: '.08em',
  marginBottom: '-.08em',
};

export function SplitWords({ text, start = 0 }: { text: string; start?: number }) {
  let index = start;
  return (
    <>
      {text.split(/(\s+)/).map((part, i) => {
        if (!part) return null;
        if (/^\s+$/.test(part)) return ' ';
        const delay = 0.1 + 0.05 * index++;
        return (
          <span key={i} style={clip}>
            <span
              className="word-rise"
              style={{ display: 'inline-block', animationDelay: `${delay.toFixed(2)}s` }}
            >
              {part}
            </span>
          </span>
        );
      })}
    </>
  );
}

/** Number of words in `text`, to continue the stagger in the next call. */
export const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;
