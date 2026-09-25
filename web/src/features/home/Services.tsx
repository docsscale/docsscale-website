import { SERVICES_SECTION } from '@/content/home';
import { T } from '@/styles/tokens';
import { ServicesFilter } from './ServicesFilter';

export function Services() {
  return (
    <div
      id="services"
      data-screen-label="Services"
      style={{ background: T.band, padding: 'clamp(64px,8vw,112px) 0' }}
    >
      <div
        className="container"
        style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px,3.5vw,40px)' }}
      >
        <ServicesFilter
          heading={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  color: T.caption,
                }}
              >
                {SERVICES_SECTION.eyebrow}
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
                {SERVICES_SECTION.headline}
                <em className="serif-accent" style={{ color: T.lavenderFg }}>
                  {SERVICES_SECTION.headlineAccent}
                </em>
              </h2>
            </div>
          }
        />
      </div>
    </div>
  );
}
