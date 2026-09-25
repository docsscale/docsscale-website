import { GAPS } from '@/content/home';
import { STAGE_COLORS, T } from '@/styles/tokens';

export function Gaps() {
  const divider = `1px solid ${T.hairlineHover}`;
  return (
    <div data-screen-label="Gaps" style={{ background: T.band, padding: 'clamp(64px,8vw,112px) 0' }}>
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,400px),1fr))',
          gap: '40px 64px',
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.08em',
              color: T.caption,
            }}
          >
            {GAPS.eyebrow}
          </span>
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(36px,4.6vw,66px)',
              lineHeight: 0.98,
              letterSpacing: '-.045em',
              textWrap: 'balance',
            }}
          >
            {GAPS.headline}
            <em className="serif-accent" style={{ color: T.peachFg }}>
              {GAPS.headlineAccent}
            </em>
          </h2>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: T.body, maxWidth: 480 }}>
            {GAPS.intro}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: divider }}>
          {GAPS.items.map((item, i) => {
            const color = STAGE_COLORS[item.stage];
            return (
              <div
                key={item.title}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '52px minmax(0,1fr)',
                  gap: 20,
                  padding: '24px 0',
                  borderBottom: i < GAPS.items.length - 1 ? divider : undefined,
                  alignItems: 'start',
                }}
              >
                <span
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: color.bg,
                    color: color.fg,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-.02em' }}>{item.title}</div>
                  <p style={{ margin: '6px 0 0', color: T.body, lineHeight: 1.55 }}>{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
