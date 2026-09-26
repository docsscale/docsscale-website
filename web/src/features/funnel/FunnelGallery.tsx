'use client';

// Grid of funnel thumbnails; clicking one opens it full-screen (click anywhere
// to close). Everything around it is server-rendered by FunnelInside.
import { useState } from 'react';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { FUNNELS } from '@/content/funnel';
import { Reveal } from './Reveal';

export function FunnelGallery() {
  const [open, setOpen] = useState<{ src: string; alt: string } | null>(null);
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,310px),1fr))',
          gap: 14,
        }}
      >
        {FUNNELS.map((funnel) => (
          <Reveal key={funnel.title}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E6E3DC',
                borderRadius: 18,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <div
                className="funnel-thumb"
                style={{
                  height: 190,
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  borderBottom: '1px solid #E6E3DC',
                  cursor: 'pointer',
                }}
                onClick={() => setOpen({ src: funnel.img, alt: funnel.title })}
              >
                <ResponsiveImage
                  src={funnel.img}
                  sizes="(max-width: 720px) calc(100vw - 32px), 360px"
                  alt={funnel.title}
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                  }}
                />
                <div
                  className="lbox-hover-static"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(15,95,99,.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity .22s',
                  }}
                >
                  <span
                    style={{
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: 13,
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M1 1h5M1 1v5M15 1h-5M15 1v5M1 15h5M1 15v-5M15 15h-5M15 15v-5"
                        stroke="#fff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                    Click to enlarge
                  </span>
                </div>
              </div>
              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>{funnel.title}</span>
                <span style={{ fontSize: 14, color: '#5C5A55', lineHeight: 1.5 }}>{funnel.desc}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      {open && (
        <div
          onClick={() => setOpen(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,.88)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            cursor: 'zoom-out',
          }}
        >
          <ResponsiveImage
            src={open.src}
            sizes="min(900px, 95vw)"
            alt={open.alt}
            style={{
              maxWidth: 'min(900px,95vw)',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 12,
              boxShadow: '0 32px 80px rgba(0,0,0,.6)',
            }}
          />
          <div
            onClick={() => setOpen(null)}
            style={{
              position: 'absolute',
              top: 20,
              right: 24,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}
