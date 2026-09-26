'use client';

// Page entrance and scroll animations (GSAP), identical to the live site:
//  - the H1 and every H2 rise in word by word
//  - the hero's first block children fade up
//  - every [data-screen-label] section (except Nav, Hero, Footer and `skip`)
//    fades up as it scrolls into view; grids animate their cards one by one
//  - [data-lift] cards float up 5px on hover
// Nothing runs when the visitor prefers reduced motion, so the static markup is
// always the final, fully visible state.
// GSAP is loaded only after the page has hydrated: the above-the-fold hero is
// animated by CSS (motion.css), so GSAP only drives content further down and
// needn't compete with the first paint for bandwidth.
import { useEffect } from 'react';

const EASE = 'power3.out';

/** Wraps each word of a heading in a clipping span so it can slide up into view. */
function splitWords(heading: Element): HTMLElement[] {
  const words: HTMLElement[] = [];
  const wrap = (text: string, parent: Node, before: Node) => {
    text.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        parent.insertBefore(document.createTextNode(' '), before);
        return;
      }
      const clip = document.createElement('span');
      clip.style.cssText =
        'display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.08em;margin-bottom:-.08em';
      const word = document.createElement('span');
      word.style.cssText = 'display:inline-block;will-change:transform';
      word.textContent = part;
      clip.appendChild(word);
      parent.insertBefore(clip, before);
      words.push(word);
    });
  };
  Array.from(heading.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      wrap(node.textContent || '', heading, node);
      heading.removeChild(node);
    } else if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'EM') {
      Array.from(node.childNodes).forEach((inner) => {
        if (inner.nodeType === Node.TEXT_NODE) {
          wrap(inner.textContent || '', node, inner);
          node.removeChild(inner);
        }
      });
    }
  });
  return words;
}

export function SiteMotion({ skip = [] }: { skip?: string[] }) {
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    let revert = () => {};

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const h1 = document.querySelector('h1');
        // Headings already split on the server animate with CSS (motion.css).
        if (h1 && !h1.querySelector('.word-rise')) {
          gsap.from(splitWords(h1), {
            yPercent: 110,
            opacity: 0,
            duration: 0.9,
            ease: EASE,
            stagger: 0.05,
            delay: 0.1,
          });
        }
        document.querySelectorAll('h2').forEach((h2) =>
          gsap.from(splitWords(h2), {
            yPercent: 110,
            opacity: 0,
            duration: 0.8,
            ease: EASE,
            stagger: 0.035,
            scrollTrigger: { trigger: h2, start: 'top 88%', once: true },
          }),
        );

        const hero = document.querySelector('[data-screen-label="Hero"]');
        if (hero?.firstElementChild && !hero.firstElementChild.hasAttribute('data-hero-rise')) {
          gsap.from(hero.firstElementChild.children, {
            y: 30,
            opacity: 0,
            duration: 0.9,
            ease: EASE,
            stagger: 0.07,
            clearProps: 'opacity',
          });
        }

        const skipped = new Set(['Nav', 'Hero', 'Footer', ...skip]);
        document.querySelectorAll('[data-screen-label]').forEach((section) => {
          if (skipped.has(section.getAttribute('data-screen-label') || '')) return;
          const inner = section.firstElementChild;
          if (!inner) return;
          Array.from(inner.children).forEach((block) => {
            // Small grids animate card by card; everything else as one block.
            const targets =
              getComputedStyle(block).display === 'grid' &&
              block.children.length > 1 &&
              block.children.length <= 12
                ? Array.from(block.children)
                : [block];
            gsap.from(targets, {
              y: 36,
              opacity: 0,
              scale: 0.985,
              duration: 0.9,
              ease: EASE,
              stagger: 0.09,
              scrollTrigger: { trigger: block, start: 'top 86%', once: true },
            });
          });
        });

        document.querySelectorAll<HTMLElement>('[data-lift]').forEach((card) => {
          card.addEventListener('pointerenter', () =>
            gsap.to(card, { y: -5, duration: 0.3, ease: 'power2.out', overwrite: 'auto' }),
          );
          card.addEventListener('pointerleave', () =>
            gsap.to(card, { y: 0, duration: 0.45, ease: EASE, overwrite: 'auto' }),
          );
        });

        // Layout can shift after fonts and images load; re-measure trigger points.
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener('load', refresh);
        const timer = setTimeout(refresh, 1200);
        return () => {
          window.removeEventListener('load', refresh);
          clearTimeout(timer);
        };
      });
      revert = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      revert();
    };
    // `skip` is a static per-page list; re-running on identity change would replay animations.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
