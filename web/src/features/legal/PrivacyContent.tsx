import { T } from '@/styles/tokens';

export function PrivacyContent() {
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
            What this covers
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            This policy explains what information DocsScale collects through this website and through the
            marketing services we run on behalf of clinic clients, and how that information is used.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            It applies to visitors of docsscale.com and to the patients and prospective patients reached
            through campaigns DocsScale manages for its clinic clients.
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
            Information we collect
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            When you fill out a form on this site, such as the strategy call request, we collect what you
            submit: name, clinic name, email, phone number, specialty, and anything you write in an optional
            message field.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            Like most websites, we may also collect basic technical information automatically, such as browser
            type, pages visited, and how you arrived at the site.
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
            How we use it
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            Information submitted through this site is used to respond to your inquiry, schedule a strategy
            call, and follow up about DocsScale&apos;s services. We do not sell this information.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            For campaigns DocsScale runs on behalf of a clinic client, contact information collected through
            that clinic&apos;s ads, forms, or funnels is used to help the clinic follow up with and book the
            patient, and stays associated with that clinic&apos;s own accounts.
          </p>
        </div>
        <div
          id="patient-data"
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
            Patient data
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            DocsScale is a marketing agency, not a covered entity or a repository for clinical records. We do
            not store diagnoses, treatment history, or other clinical information.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            Where a client relationship involves protected health information, DocsScale signs a Business
            Associate Agreement (BAA) with the clinic and limits data handling to the minimum needed to run
            marketing and follow-up, consistent with that agreement.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            Specific data-handling commitments are set out in each clinic&apos;s service agreement and BAA,
            which take precedence over this general page.
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
            Cookies and analytics
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.65,
              color: T.body,
            }}
          >
            This site may use standard analytics and advertising cookies to understand traffic and measure ad
            performance. You can control cookies through your browser settings.
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
            Questions about this policy can be sent to hello@docsscale.com.
          </p>
        </div>
      </div>
    </div>
  );
}
