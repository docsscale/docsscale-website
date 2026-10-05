'use client';

// Homepage hero graphic: example patients moving through the system, one after
// another (content/hero-journey.ts). Built from the design tokens; no images.
//
// - First paint is the complete first example. That is also the whole graphic
//   for visitors who prefer reduced motion: the loop never starts for them.
// - The loop starts only after the page has loaded, and pauses while the tile
//   is off-screen or the tab is hidden, so it costs nothing during load.
// - Every row has a fixed height and single-line text (styles/hero-journey.css),
//   so switching patients can't move anything on the page.
// - Screen readers get one fixed description; the moving part is aria-hidden.
import { useEffect, useRef, useState } from 'react';
import { HERO_JOURNEY, STAGE_LABELS, type JourneyStep } from '@/content/hero-journey';
import { STAGE_COLORS, T } from '@/styles/tokens';

const { patients } = HERO_JOURNEY;
const STEPS = 4;
// Milliseconds. One patient takes about 7 s, the five about 36 s.
const TIMING = { start: 2200, arrive: 550, sending: 850, active: 600, settle: 400, hold: 1500 };

type Frame = { patient: number; step: number; sending: boolean };
const COMPLETE: Frame = { patient: 0, step: STEPS, sending: false };

export function HeroJourney() {
  const [frame, setFrame] = useState<Frame>(COMPLETE);
  const [live, setLive] = useState(false); // switches the CSS animations on
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => (visible = !!entry?.isIntersecting), {
      threshold: 0.25,
    });
    if (tileRef.current) observer.observe(tileRef.current);

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    // Waits while the graphic can't be seen, so nothing runs in the background.
    const whileHidden = async () => {
      while (!cancelled && (!visible || document.visibilityState !== 'visible')) await sleep(300);
    };
    const show = (next: Frame) => !cancelled && setFrame(next);

    async function loop() {
      await sleep(TIMING.start);
      for (let patient = 1; !cancelled; patient = (patient + 1) % patients.length) {
        await whileHidden();
        if (!cancelled) setLive(true); // together with the first change, so nothing replays
        show({ patient, step: -1, sending: false });
        await sleep(TIMING.arrive);
        for (let step = 0; step < STEPS && !cancelled; step++) {
          await whileHidden();
          const current: JourneyStep = patients[patient]!.steps[step]!;
          const sent = current.sent === true;
          show({ patient, step, sending: sent });
          if (sent) {
            await sleep(TIMING.sending);
            show({ patient, step, sending: false });
          }
          await sleep(TIMING.active);
          show({ patient, step: step + 1, sending: false });
          await sleep(TIMING.settle);
        }
        await sleep(TIMING.hold);
      }
    }
    const start = () => void loop();
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('load', start);
    };
  }, []);

  const patient = patients[frame.patient]!;
  return (
    <div
      ref={tileRef}
      className="hj"
      role="img"
      aria-label={HERO_JOURNEY.description}
      data-live={live ? '' : undefined}
    >
      <div aria-hidden="true" className="hj-inner">
        <div className="hj-top">
          <span className="hj-eyebrow">{HERO_JOURNEY.eyebrow}</span>
          <span className="hj-pill">{HERO_JOURNEY.example}</span>
        </div>

        <div key={frame.patient} className="hj-lead">
          <span className="hj-avatar">{patient.name[0]}</span>
          <span className="hj-lead-text">
            <span className="hj-name">{patient.name}</span>
            <span className="hj-line">{patient.situation}</span>
          </span>
        </div>

        <div className="hj-steps">
          {patient.steps.map((step, i) => {
            const state = i < frame.step ? 'done' : i === frame.step ? 'on' : 'next';
            const colors = STAGE_COLORS[step.stage];
            const sending = state === 'on' && frame.sending;
            return (
              <div
                key={`${frame.patient}-${i}`}
                className="hj-step"
                data-state={state}
                style={{ background: colors.bg, color: colors.fg }}
              >
                <span className="hj-num" style={{ background: colors.fg, color: colors.bg }}>
                  {state === 'done' ? (
                    <svg width="14" height="14" viewBox="0 0 14 14">
                      <path
                        d="M2.5 7.5l3 3 6-6.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="hj-text">
                  <span className="hj-row">
                    <span className="hj-stage">{STAGE_LABELS[step.stage]}</span>
                    <span className="hj-time">{state === 'next' ? HERO_JOURNEY.waiting : step.time}</span>
                  </span>
                  <span className="hj-title" style={{ color: T.ink }}>
                    {step.title}
                  </span>
                  <span className="hj-line">
                    {sending ? (
                      <>
                        {HERO_JOURNEY.sending}
                        <span className="hj-dots">
                          <i />
                          <i />
                          <i />
                        </span>
                      </>
                    ) : state === 'next' ? (
                      ' '
                    ) : (
                      step.detail
                    )}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="hj-progress">
          {patients.map((p, i) => (
            <i key={p.name} data-on={i === frame.patient} />
          ))}
        </div>
        <div className="hj-caption">{HERO_JOURNEY.caption}</div>
      </div>
    </div>
  );
}
