'use client';

// "Built for your kind of clinic": the visitor picks a specialty in the hero and
// a few demo values across the homepage (inquiry text, ad headline, counter)
// change to match. The sections themselves are Server Components; only these
// small leaves are client code, sharing the choice through context.
import { createContext, useContext, useState, type ReactNode } from 'react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { HOME_SPECIALTIES, type HomeSpecialty } from '@/content/home';
import { T } from '@/styles/tokens';

type Ctx = { specialty: HomeSpecialty; select: (key: string) => void };
const SpecialtyContext = createContext<Ctx | null>(null);

export function SpecialtyProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState('all');
  const specialty = HOME_SPECIALTIES.find((s) => s.key === key) ?? HOME_SPECIALTIES[0]!;
  return (
    <SpecialtyContext.Provider value={{ specialty, select: setKey }}>{children}</SpecialtyContext.Provider>
  );
}

function useSpecialty(): Ctx {
  const ctx = useContext(SpecialtyContext);
  if (!ctx) throw new Error('Specialty components must be inside <SpecialtyProvider>');
  return ctx;
}

type TextField = 'service' | 'adHeadline' | 'inquiry' | 'source' | 'recall';

/** Prints one text field of the selected specialty. */
export function SpecialtyText({ field }: { field: TextField }) {
  return <>{useSpecialty().specialty[field]}</>;
}

/** The "new patient inquiries" counter; counts to the new value on change. */
export function SpecialtyInquiries() {
  return <AnimatedNumber value={useSpecialty().specialty.n1} />;
}

/** The row of specialty chips in the hero. */
export function SpecialtyPicker() {
  const { specialty, select } = useSpecialty();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {HOME_SPECIALTIES.map((option) => {
        const selected = option.key === specialty.key;
        return (
          <button
            key={option.key}
            onClick={() => select(option.key)}
            className="chip-btn"
            style={{
              height: 38,
              padding: '0 16px',
              borderRadius: 999,
              border: `1px solid ${selected ? T.teal : 'rgba(15,95,99,.3)'}`,
              background: selected ? T.teal : 'rgba(255,255,255,.55)',
              color: selected ? '#FFFFFF' : T.tealTintFg,
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
