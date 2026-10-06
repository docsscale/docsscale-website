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

const HIDDEN_LABELS = ['New branch…', 'New branch...', 'Create pull request', 'View pull request', 'Delete branch'];

/** Editors never choose a branch or open a pull request, so those controls are
 *  taken off the screen. Keystatic has no setting for this; the screen is
 *  re-checked whenever it changes. The guard above still applies if a control
 *  is ever missed. */
function useHideBranchControls() {
  useEffect(() => {
    if (config.storage.kind === 'local') return;
    const hide = (el: Element | null) => el instanceof HTMLElement && el.style.setProperty('display', 'none', 'important');
    const sweep = () => {
      document.querySelectorAll('[aria-label="Current branch"]').forEach((el) => {
        // climb to the outermost wrapper that holds nothing but the branch menu
        let node: Element = el;
        while (node.parentElement && node.parentElement.children.length === 1) node = node.parentElement;
        hide(node);
      });
      document.querySelectorAll('button, a, [role="menuitem"], [role="option"]').forEach((el) => {
        const text = (el.textContent ?? '').trim();
        if (HIDDEN_LABELS.includes(text) || HIDDEN_LABELS.includes(el.getAttribute('aria-label') ?? '')) hide(el);
      });
    };
    sweep();
    const observer = new MutationObserver(sweep);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
}

export default function KeystaticApp() {
  useStayOnWorkingBranch();
  useHideBranchControls();
  return <KeystaticPage />;
}
