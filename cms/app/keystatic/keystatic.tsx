'use client';

import { useEffect } from 'react';
import { makePage } from '@keystatic/next/ui/app';
import config, { WORKING_BRANCH } from '../../keystatic.config';

const KeystaticPage = makePage(config);
const HOME = `/keystatic/branch/${encodeURIComponent(WORKING_BRANCH)}`;

/** Keystatic always offers the repository's default branch in its branch menu.
 *  Editors must only ever save to the working copy, so any other branch in the
 *  address is sent back to it. (Local mode has no branches; nothing to guard.) */
function useStayOnWorkingBranch() {
  useEffect(() => {
    if (config.storage.kind === 'local') return;
    const check = () => {
      const path = window.location.pathname;
      if (path === '/keystatic' || path === '/keystatic/') return window.location.replace(HOME);
      const match = path.match(/^\/keystatic\/branch\/([^/]+)/);
      if (match && decodeURIComponent(match[1]) !== WORKING_BRANCH) window.location.replace(HOME);
    };
    check();
    const timer = window.setInterval(check, 300);
    return () => window.clearInterval(timer);
  }, []);
}

export default function KeystaticApp() {
  useStayOnWorkingBranch();
  return <KeystaticPage />;
}
