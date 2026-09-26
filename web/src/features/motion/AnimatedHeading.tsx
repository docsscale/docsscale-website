// Page H1 with the word-by-word entrance, done without shipping any JavaScript
// bundle for it:
//  - the server renders the heading as plain text, exactly like the original
//    site, so visitors who prefer reduced motion see an untouched headline;
//  - a tiny inline script right after it splits the words before the first
//    paint (only when motion is allowed); styles/motion.css animates them.
// React is told the heading's inner HTML is static (dangerouslySetInnerHTML),
// so hydration never re-renders or "fixes" the split words.
// Supported content: text and <em> (with className/style), like the headlines.
import { Children, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from 'react';

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const cssValue = (key: string, value: string | number) =>
  `${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${typeof value === 'number' && value !== 0 ? `${value}px` : value}`;

function toHtml(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return escape(String(node));
  // Adjacent text pieces become separate text nodes in React's HTML, marked with
  // <!-- -->; reproduce that, because text-node boundaries affect glyph shaping.
  if (Array.isArray(node))
    return node
      .map((child, i) => {
        const isText = (n: unknown) => typeof n === 'string' || typeof n === 'number';
        return (i > 0 && isText(child) && isText(node[i - 1]) ? '<!-- -->' : '') + toHtml(child);
      })
      .join('');
  if (isValidElement(node) && node.type === 'em') {
    const { className, style, children } = (
      node as ReactElement<{ className?: string; style?: CSSProperties; children?: ReactNode }>
    ).props;
    const css = style
      ? Object.entries(style)
          .map(([k, v]) => cssValue(k, v as string | number))
          .join(';')
      : '';
    return `<em${className ? ` class="${className}"` : ''}${css ? ` style="${escape(css)}"` : ''}>${toHtml(Children.toArray(children))}</em>`;
  }
  if (isValidElement(node) && node.type === 'br') return '<br/>';
  throw new Error('AnimatedHeading supports text, <em> and <br/> only');
}

// Same structure and timing as the original GSAP split: a clipping span per word,
// 0.1s initial delay, 0.05s stagger. Runs synchronously during HTML parsing.
const SPLIT_SCRIPT = `(function(){var h=document.currentScript&&document.currentScript.previousElementSibling;if(!h||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;var i=0;function wrap(t,p,b){t.split(/(\\s+)/).forEach(function(w){if(!w)return;if(/^\\s+$/.test(w)){p.insertBefore(document.createTextNode(" "),b);return}var c=document.createElement("span");c.className="word-clip";c.style.cssText="display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.08em;margin-bottom:-.08em";var s=document.createElement("span");s.className="word-rise";s.style.cssText="display:inline-block;animation-delay:"+(0.1+0.05*i++).toFixed(2)+"s";s.textContent=w;c.appendChild(s);p.insertBefore(c,b)})}Array.prototype.slice.call(h.childNodes).forEach(function(n){if(n.nodeType===3){wrap(n.textContent||"",h,n);h.removeChild(n)}else if(n.nodeType===1&&n.tagName==="EM"){Array.prototype.slice.call(n.childNodes).forEach(function(m){if(m.nodeType===3){wrap(m.textContent||"",n,m);n.removeChild(m)}})}})})();`;

export function AnimatedHeading({ style, children }: { style: CSSProperties; children: ReactNode }) {
  return (
    <>
      <h1 style={style} dangerouslySetInnerHTML={{ __html: toHtml(Children.toArray(children)) }} />
      <script dangerouslySetInnerHTML={{ __html: SPLIT_SCRIPT }} />
    </>
  );
}
