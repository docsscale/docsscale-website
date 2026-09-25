import { T } from '@/styles/tokens';

export function TermsContent() {
  return (
    <div
      data-screen-label="Content"
      style={{
        background: T.band,
        padding: 'clamp(48px,6vw,80px) 0 clamp(64px,8vw,96px)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          maxWidth: 760,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            scrollMarginTop: 96,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: '-.02em',
            }}
          >
            Using this website
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            This website is provided to give clinics information about DocsScale&apos;s services and a way to
            request a strategy call. Content on this site, including results and figures, is illustrative
            unless stated otherwise, and shouldn&apos;t be relied on as a guarantee of specific outcomes for
            your clinic.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            scrollMarginTop: 96,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: '-.02em',
            }}
          >
            Engaging DocsScale
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            Any actual marketing services, pricing, deliverables, and commitments are set out in a separate
            signed agreement between DocsScale and the clinic, not on this website. That agreement governs if
            anything here conflicts with it.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            Engagements are month to month with 30 days&apos; written notice to end, as described in that
            agreement.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            scrollMarginTop: 96,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: '-.02em',
            }}
          >
            Ad accounts and ownership
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            Clinics pay advertising platforms directly from their own ad accounts. DocsScale manages campaigns
            within those accounts but does not take ownership of a clinic&apos;s ad accounts, website, or
            data.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            scrollMarginTop: 96,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: '-.02em',
            }}
          >
            No guarantee of results
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            Marketing outcomes depend on many factors outside DocsScale&apos;s control, including the
            clinic&apos;s market, pricing, staffing, and how quickly inquiries are followed up. Past results
            shown on this site belong to specific clinics at a specific time and don&apos;t guarantee similar
            results for any other clinic.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            scrollMarginTop: 96,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: '-.02em',
            }}
          >
            Changes to these terms
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            We may update this page from time to time. The version posted here is the current one.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            scrollMarginTop: 96,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: '-.02em',
            }}
          >
            Contact
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            Questions about these terms can be sent to hello@docsscale.com.
          </p>
        </div>
      </div>
    </div>
  );
}
