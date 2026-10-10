// schema.org structured data per page. The Organization block repeats on every
// page; it is defined once and the Service blocks point to it by @id.
import { SERVICE_STAGES, SITE } from './site';
import { SERVED_SPECIALTIES, sentenceCase, specialtyList } from './served-specialties';

export const ORGANIZATION = {
  '@context': 'https://schema.org',
  // Organization, not LocalBusiness: DocsScale has no public street address.
  '@type': 'Organization',
  '@id': 'https://docsscale.com/#organization',
  name: 'DocsScale',
  url: 'https://docsscale.com/',
  // Square icon, 512 px: Google wants a logo of at least 112×112.
  logo: 'https://docsscale.com/android-chrome-512x512.png',
  email: 'info@docsscale.com',
  foundingDate: SITE.founded,
  description:
    'Marketing agency for healthcare clinics. More patients on autopilot, from the first click to the booked appointment: ads, SEO, websites, funnels, follow-up and recall.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Houston',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  areaServed: { '@type': 'Country', name: 'United States' },
  knowsAbout: [
    'Healthcare marketing',
    'Patient acquisition',
    ...SERVED_SPECIALTIES.map((name) => `${name} marketing`),
    'Local SEO',
    'Paid advertising',
    'Funnel design',
    'Website design',
    'Patient follow-up',
    'Reactivation',
  ],
};

export const STRUCTURED_DATA = {
  home: [
    ORGANIZATION,
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Healthcare clinic marketing',
      provider: { '@id': 'https://docsscale.com/#organization' },
      areaServed: 'US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Healthcare clinics',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services',
        // The seven confirmed services (content/site.ts), same names as the nav and footer.
        itemListElement: SERVICE_STAGES.flatMap(({ services }) =>
          services.map(({ name }) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
        ),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Do you only work with one kind of clinic?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `No. ${sentenceCase(specialtyList())}. The system is the same; offers, timing, and compliance rules change by specialty.`,
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
    },
  ],
  services: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Services',
          item: 'https://docsscale.com/services',
        },
      ],
    },
    ORGANIZATION,
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Healthcare clinic marketing',
      provider: { '@id': 'https://docsscale.com/#organization' },
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
    },
  ],
  servicePaidAds: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Services',
          item: 'https://docsscale.com/services/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Paid ads (Meta & Google)',
          item: 'https://docsscale.com/services/paid-ads/',
        },
      ],
    },
    ORGANIZATION,
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Paid ads (Meta & Google)',
      url: 'https://docsscale.com/services/paid-ads/',
      serviceType: 'Pay-per-click advertising for healthcare clinics',
      provider: { '@id': 'https://docsscale.com/#organization' },
      areaServed: 'US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Healthcare clinics',
      },
    },
  ],
  serviceReactivation: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Services',
          item: 'https://docsscale.com/services/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Reactivation & recall',
          item: 'https://docsscale.com/services/patient-reactivation/',
        },
      ],
    },
    ORGANIZATION,
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Reactivation & recall',
      url: 'https://docsscale.com/services/patient-reactivation/',
      serviceType: 'Patient reactivation and recall for healthcare clinics',
      provider: { '@id': 'https://docsscale.com/#organization' },
      areaServed: 'US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Healthcare clinics',
      },
    },
  ],
  industries: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Industries',
          item: 'https://docsscale.com/industries/',
        },
      ],
    },
    ORGANIZATION,
  ],
  industryDental: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Industries',
          item: 'https://docsscale.com/industries/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Dental Marketing',
          item: 'https://docsscale.com/industries/dental/',
        },
      ],
    },
    ORGANIZATION,
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Dental marketing',
      url: 'https://docsscale.com/industries/dental/',
      serviceType: 'Dental clinic marketing',
      provider: { '@id': 'https://docsscale.com/#organization' },
      areaServed: 'US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Dental clinics',
      },
    },
  ],
  industryChiropractic: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Industries',
          item: 'https://docsscale.com/industries/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Chiropractic Marketing',
          item: 'https://docsscale.com/industries/chiropractic/',
        },
      ],
    },
    ORGANIZATION,
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Chiropractic marketing',
      url: 'https://docsscale.com/industries/chiropractic/',
      serviceType: 'Chiropractic clinic marketing',
      provider: { '@id': 'https://docsscale.com/#organization' },
      areaServed: 'US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Chiropractic clinics',
      },
    },
  ],
  industryPhysicalTherapy: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Industries',
          item: 'https://docsscale.com/industries/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Physical Therapy Marketing',
          item: 'https://docsscale.com/industries/physical-therapy/',
        },
      ],
    },
    ORGANIZATION,
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Physical therapy marketing',
      url: 'https://docsscale.com/industries/physical-therapy/',
      serviceType: 'Physical Therapy clinic marketing',
      provider: { '@id': 'https://docsscale.com/#organization' },
      areaServed: 'US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Physical Therapy clinics',
      },
    },
  ],
  industryMedSpa: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Industries',
          item: 'https://docsscale.com/industries/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Med Spa Marketing',
          item: 'https://docsscale.com/industries/med-spa/',
        },
      ],
    },
    ORGANIZATION,
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Med spa marketing',
      url: 'https://docsscale.com/industries/med-spa/',
      serviceType: 'Med Spa clinic marketing',
      provider: { '@id': 'https://docsscale.com/#organization' },
      areaServed: 'US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Med Spa clinics',
      },
    },
  ],
  howItWorks: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'How it works',
          item: 'https://docsscale.com/how-it-works',
        },
      ],
    },
    ORGANIZATION,
  ],
  results: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Results',
          item: 'https://docsscale.com/results',
        },
      ],
    },
    ORGANIZATION,
  ],
  blog: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://docsscale.com/blog/',
        },
      ],
    },
    ORGANIZATION,
  ],
  about: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About',
          item: 'https://docsscale.com/about',
        },
      ],
    },
    ORGANIZATION,
  ],
  bookACall: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Book a call',
          item: 'https://docsscale.com/book-a-call',
        },
      ],
    },
    ORGANIZATION,
  ],
  privacy: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Privacy Policy',
          item: 'https://docsscale.com/privacy',
        },
      ],
    },
    ORGANIZATION,
  ],
  terms: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://docsscale.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Terms of Service',
          item: 'https://docsscale.com/terms',
        },
      ],
    },
    ORGANIZATION,
  ],
  freeSystem: [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://docsscale.com/#organization',
          name: 'DocsScale',
          url: 'https://docsscale.com',
          description:
            'Healthcare marketing agency that builds patient acquisition systems for clinics. Specialises in GoHighLevel automation, conversion funnels, and patient retention workflows.',
        },
        {
          '@type': 'WebPage',
          '@id': 'https://docsscale.com/free-system/#webpage',
          url: 'https://docsscale.com/free-system/',
          name: 'Free Click-to-Chair System for Healthcare Clinics',
          description: `Get the complete Click-to-Chair System at no cost, built in GoHighLevel. 6 pre-built conversion funnels, 17 done-for-you automations, and a full patient CRM for ${specialtyList()} clinics.`,
          publisher: {
            '@id': 'https://docsscale.com/#organization',
          },
        },
        {
          '@type': 'Service',
          name: 'Click-to-Chair System',
          description:
            'The Click-to-Chair System: a complete patient acquisition system built inside GoHighLevel, provided free to healthcare clinic owners. Includes 6 pre-built sales funnels covering new patient lead generation, service promotions, booking, applications, patient reactivation, and review collection. Also includes 17 automated workflows and a complete patient CRM.',
          provider: {
            '@id': 'https://docsscale.com/#organization',
          },
          serviceType: 'Healthcare Marketing Automation',
          areaServed: 'United States',
          audience: {
            '@type': 'Audience',
            audienceType: `Healthcare clinic owners — ${specialtyList()}`,
          },
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            description:
              'The complete Click-to-Chair System, free to download and keep. No trial, no credit card, no obligation.',
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Is the Click-to-Chair System actually free?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Yes. The complete system — 6 conversion funnels, 17 automations, and a full patient CRM — is free to download and keep. No trial period, no credit card, no obligation to use DocsScale's paid services.",
              },
            },
            {
              '@type': 'Question',
              name: 'What healthcare specialties does this patient system work for?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: `The system works for any patient-based healthcare clinic: ${specialtyList()} practices.`,
              },
            },
            {
              '@type': 'Question',
              name: 'Do I need a GoHighLevel account to use this?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. The system is built inside GoHighLevel. If you do not have an account, DocsScale can help you set one up and install the system on a free 30-minute strategy call.',
              },
            },
            {
              '@type': 'Question',
              name: 'What is included in the free Click-to-Chair System?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The system includes 6 pre-built sales funnels (new patient lead, service promotion, booking and appointment, application, reactivation, and review and reputation), 17 automations covering the full patient journey from first inquiry to long-term retention, and a complete patient CRM built in GoHighLevel.',
              },
            },
            {
              '@type': 'Question',
              name: 'How does the missed-call automation work?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'When a patient calls your clinic and nobody answers, the system automatically sends a text message within seconds — day or night. This stops patients from calling a competitor and keeps every inquiry captured for your team to follow up.',
              },
            },
          ],
        },
        {
          '@type': 'HowTo',
          name: 'How to claim the free Click-to-Chair System',
          description: 'Three steps to receive the free Click-to-Chair System from DocsScale.',
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: '0',
          },
          totalTime: 'PT1M',
          step: [
            {
              '@type': 'HowToStep',
              position: '1',
              name: 'Fill in the short form',
              text: 'Enter your name, work email, mobile number, clinic name, and specialty. Takes about 30 seconds.',
            },
            {
              '@type': 'HowToStep',
              position: '2',
              name: 'Check your inbox',
              text: 'The full Click-to-Chair System — 6 funnels, 17 automations, and the complete patient CRM — is delivered directly to your email.',
            },
            {
              '@type': 'HowToStep',
              position: '3',
              name: 'Install it in GoHighLevel',
              text: 'Import the system into your GoHighLevel account. If you want it installed and running with ads behind it, book a free 30-minute strategy call with the DocsScale team.',
            },
          ],
        },
      ],
    },
  ],
  freeSystemBookACall: [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://docsscale.com/#organization',
          name: 'DocsScale',
          url: 'https://docsscale.com',
          description:
            'Healthcare marketing agency that builds patient acquisition systems for clinics using GoHighLevel.',
        },
        {
          '@type': 'WebPage',
          '@id': 'https://docsscale.com/free-system/book-a-call/#webpage',
          url: 'https://docsscale.com/free-system/book-a-call/',
          name: 'Book a Free 30-Minute Strategy Call — DocsScale',
          description:
            'Schedule a free 30-minute strategy call with DocsScale. Clinic owners get an honest review of their patient pipeline and a clear recommendation — no pitch.',
          publisher: {
            '@id': 'https://docsscale.com/#organization',
          },
        },
        {
          '@type': 'Service',
          name: 'Free Healthcare Marketing Strategy Call',
          description:
            'A free 30-minute strategy call for healthcare clinic owners. DocsScale reviews your current patient numbers, identifies your top growth opportunity, and gives an honest recommendation on whether we are the right fit.',
          provider: {
            '@id': 'https://docsscale.com/#organization',
          },
          serviceType: 'Marketing Consultation',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: 'Free 30-minute strategy call — no obligation, no pitch',
          },
        },
      ],
    },
  ],
};
