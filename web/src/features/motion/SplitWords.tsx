// Server-rendered version of SiteMotion's headline split: every word sits in a
// clipping span and rises in with a CSS animation (styles/motion.css), so a
// page's H1 animates from first paint instead of after the JavaScript loads.
// Same structure and timing as the GSAP version: 0.1s delay + 0.05s per word.
import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';

const clip: CSSProperties = {
  display: 'inline-block',
  overflow: 'hidden',
  verticalAlign: 'bottom',
  paddingBottom: '.08em',
  marginBottom: '-.08em',
};

function splitText(text: string, counter: { i: number }, keyPrefix: string): ReactNode[] {
  return text.split(/(\s+)/).map((part, n) => {
    if (!part) return null;
    if (/^\s+$/.test(part)) return ' ';
    const delay = 0.1 + 0.05 * counter.i++;
    return (
      <span key={`${keyPrefix}-${n}`} className="word-clip" style={clip}>
        <span
          className="word-rise"
          style={{ display: 'inline-block', animationDelay: `${delay.toFixed(2)}s` }}
        >
          {part}
        </span>
      </span>
    );
  });
}

function splitNode(node: ReactNode, counter: { i: number }, key: string): ReactNode {
  if (typeof node === 'string') return splitText(node, counter, key);
  // Like the GSAP version, words inside <em> are split too; other elements (<br/>) stay as they are.
  if (isValidElement(node) && node.type === 'em') {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(
      el,
      {},
      Children.toArray(el.props.children).map((child, n) => splitNode(child, counter, `${key}-${n}`)),
    );
  }
  return node;
}

/** Wrap an H1's content: <h1 …><SplitWords>Headline <em>accent</em></SplitWords></h1> */
export function SplitWords({ children }: { children: ReactNode }) {
  const counter = { i: 0 };
  return <>{Children.toArray(children).map((child, n) => splitNode(child, counter, `w${n}`))}</>;
}
