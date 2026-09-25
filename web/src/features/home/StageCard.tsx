import { T } from '@/styles/tokens';

type Props = {
  id: string;
  bg: string;
  fg: string;
  badge: string;
  n: number;
  title: string;
  body: string;
  tags: readonly string[];
};

/** A coloured "stage" card in the System section (Attract, Capture, Convert, Retain). */
export function StageCard({ id: t, bg: i, fg: a, badge: l, n: s, title: r, body: o, tags: d }: Props) {
  return (
    <div
      id={t}
      style={{
        background: i,
        color: a,
        borderRadius: 28,
        padding: 'clamp(26px,3vw,40px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 24,
        minHeight: 360,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '.08em',
          }}
        >
          {l}
        </span>
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: a,
            color: i,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
          }}
        >
          {s}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 'clamp(26px,2.8vw,38px)',
            lineHeight: 1.02,
            letterSpacing: '-.035em',
          }}
        >
          {r}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.55,
          }}
        >
          {o}
        </p>
      </div>
      <TagRow tags={d} />
    </div>
  );
}

function TagRow({ tags: t }: { tags: readonly string[] }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      {t.map((e) => (
        <span
          style={{
            padding: '7px 12px',
            borderRadius: 999,
            background: T.surface,
            fontSize: 13,
            fontWeight: 700,
          }}
          key={e}
        >
          {e}
        </span>
      ))}
    </div>
  );
}
