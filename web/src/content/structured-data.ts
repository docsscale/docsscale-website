// Structured data (schema.org) for the homepage, unchanged from the live site.
// Organization details will move to one shared builder with the contact update.

export const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': ['MarketingAgency', 'LocalBusiness'],
  name: 'DocsScale',
  url: 'https://docsscale.com',
  email: 'hello@docsscale.com',
  telephone: '+1-512-555-0148',
  description:
    'Marketing agency for healthcare clinics. More patients on autopilot, from the first click to the booked appointment: ads, SEO, websites, funnels, follow-up and recall.',
  areaServed: 'US',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2100 S Lamar Blvd, Suite 210',
    addressLocality: 'Austin',
    addressRegion: 'TX',
    postalCode: '78704',
    addressCountry: 'US',
  },
  sameAs: ['https://docsscale.com', 'https://doctorsscalepartners.com'],
  knowsAbout: [
    'Healthcare marketing',
    'Patient acquisition',
    'Dental marketing',
    'Chiropractic marketing',
    'Physical therapy marketing',
    'Med spa marketing',
    'Local SEO',
    'Paid advertising',
    'Funnel design',
    'Website design',
    'Patient follow-up',
    'Reactivation',
  ],
};

export const SERVICE_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Healthcare clinic marketing',
  provider: {
    '@type': 'Organization',
    name: 'DocsScale',
  },
  areaServed: 'US',
  audience: {
    '@type': 'Audience',
    audienceType: 'Healthcare clinics',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Paid advertising',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'SEO',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Social media management',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Website design',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Funnel design',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Follow-up & booking',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Reputation & reviews',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Reactivation & recall',
        },
      },
    ],
  },
};

export const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you only work with one kind of clinic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Dental, chiropractic, physical therapy, med spa, dermatology, primary care, optometry, and mental health. The system is the same; offers, timing, and compliance rules change by specialty.',
      },
    },
    {
      '@type': 'Question',
      name: 'We already have a website. Do we have to rebuild it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Only if it can't book. If it can, we build funnels around it. If it can't, we fix that first, because ads pointed at a site that doesn't convert waste your money.",
      },
    },
    {
      '@type': 'Question',
      name: 'Who pays for and owns the ad spend?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You pay the platform directly from your own ad account. We manage it, you own it, and the account, pages, and numbers stay yours if we ever part ways.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly will we see new patients?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most clinics see their first booked patients from ads within 2 to 3 weeks of launch and a full pipeline by month three.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are we locked into a contract?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Month to month, 30 days' notice. Clinics stay because the schedule fills, not because a contract says so.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do you handle patient information?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We sign a BAA with every clinic and never store clinical records; contact details live in your own accounts. The minimum data needed, never sold or shared.',
      },
    },
  ],
};
