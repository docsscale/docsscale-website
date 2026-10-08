import fs from 'node:fs';
import path from 'node:path';
import type { ReactNode } from 'react';
import { preload } from 'react-dom';
import { PreviewStatus } from '@/features/preview/PreviewStatus';
import { Footer } from '@/features/site-chrome/Footer';
import '@/styles/fonts.css';
import '@/styles/globals.css';

// The blog's shell: the same header and footer as the main site, but lighter,
// because a post's first screen is text. Only the text font is fetched early
// (the italic one loads when a quote needs it), the homepage's own stylesheets
// are left out, and the blog's few layout rules travel inside the page instead
// of as one more file to wait for. This is what keeps posts inside the
// performance target (docs/COMPLETION-PLAN.md, section 5, item 11).
const blogCss = fs.readFileSync(path.join(process.cwd(), 'src/styles/blog.css'), 'utf8');

export default function BlogLayout({ children }: { children: ReactNode }) {
  preload('/fonts/plus-jakarta-sans-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: blogCss }} />
      {children}
      <Footer />
      <PreviewStatus />
    </>
  );
}
