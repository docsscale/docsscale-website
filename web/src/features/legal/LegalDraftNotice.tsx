import { T } from '@/styles/tokens';

// Banner at the top of /privacy/ and /terms/ on the live site. Placeholder
// content: scheduled for removal (see docs/CONTENT-CHANGES.md).
export function LegalDraftNotice() {
  return (
    <div style={{ padding: 'clamp(28px,4vw,56px) 0 clamp(24px,3vw,32px)' }}>
      <div className="container">
        <div
          style={{
            background: T.peachBg,
            color: T.peachFg,
            borderRadius: 20,
            padding: '16px 22px',
            fontSize: 14,
            lineHeight: 1.5,
            fontWeight: 600,
          }}
        >
          Draft placeholder text, not legal advice. This page needs review by a lawyer familiar with
          healthcare marketing and your specific data practices before the site goes live.
        </div>
      </div>
    </div>
  );
}
