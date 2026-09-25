// "Here is exactly what you are getting": heading + the funnel gallery.
import { FunnelGallery } from './FunnelGallery';
import { Reveal } from './Reveal';

export function FunnelInside() {
  return (
    <div id="inside" style={{ background: '#F3F1EC', padding: 'clamp(56px,7vw,96px) 0' }}>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 48,
        }}
      >
        <Reveal
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: '#8F8C85',
            }}
          >
            Here is exactly what you are getting
          </span>
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(30px,4.4vw,58px)',
              lineHeight: 1,
              letterSpacing: '-.04em',
              textWrap: 'balance',
              maxWidth: 780,
            }}
          >
            The same system we install
            <br />
            {'in '}
            <em className="serif-em" style={{ color: '#0F5F63' }}>
              paying clinics.
            </em>
            {' Every piece of it.'}
          </h2>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: '#5C5A55', maxWidth: 580 }}>
            Packaged in GoHighLevel, pre-built for healthcare, ready to go live in your clinic.
          </p>
        </Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Reveal style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: '#FBE7D6',
                color: '#8A4B1E',
                fontWeight: 800,
                fontSize: 22,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              6
            </span>
            <span style={{ fontWeight: 800, fontSize: 'clamp(18px,2vw,24px)', letterSpacing: '-.025em' }}>
              THE FUNNELS
            </span>
            <span className="chip" style={{ background: '#FBE7D6', color: '#8A4B1E' }}>
              All pre-built
            </span>
          </Reveal>
          <FunnelGallery />
        </div>
      </div>
    </div>
  );
}
