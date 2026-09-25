// schema.org structured data per page. The Organization block repeats on every
// page; it is defined once and the Service blocks point to it by @id.

export const ORGANIZATION = {
  '@context': 'https://schema.org',
  // Organization, not LocalBusiness: DocsScale has no public street address.
  '@type': 'Organization',
  '@id': 'https://docsscale.com/#organization',
  name: 'DocsScale',
  url: 'https://docsscale.com/',
  logo: 'https://docsscale.com/favicon.png',
  email: 'info@docsscale.com',
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
    {
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
  servicesDental: [
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
          name: 'Dental Marketing',
          item: 'https://docsscale.com/services/dental',
        },
      ],
    },
    ORGANIZATION,
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Dental clinic marketing',
      provider: { '@id': 'https://docsscale.com/#organization' },
      areaServed: 'US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Dental clinics',
      },
    },
  ],
  servicesChiropractic: [
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
          name: 'Chiropractic Marketing',
          item: 'https://docsscale.com/services/chiropractic',
        },
      ],
    },
    ORGANIZATION,
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Chiropractic clinic marketing',
      provider: { '@id': 'https://docsscale.com/#organization' },
      areaServed: 'US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Chiropractic clinics',
      },
    },
  ],
  servicesPhysicalTherapy: [
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
          name: 'Physical Therapy Marketing',
          item: 'https://docsscale.com/services/physical-therapy',
        },
      ],
    },
    ORGANIZATION,
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Physical Therapy clinic marketing',
      provider: { '@id': 'https://docsscale.com/#organization' },
      areaServed: 'US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Physical Therapy clinics',
      },
    },
  ],
  servicesMedSpa: [
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
          name: 'Med Spa Marketing',
          item: 'https://docsscale.com/services/med-spa',
        },
      ],
    },
    ORGANIZATION,
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
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
          name: 'Free GoHighLevel Patient-Getting System for Healthcare Clinics',
          description:
            'Download a complete GoHighLevel patient acquisition system at no cost. 6 pre-built conversion funnels, 17 done-for-you automations, and a full patient CRM for chiropractic, dental, med spa, and physical therapy clinics.',
          publisher: {
            '@id': 'https://docsscale.com/#organization',
          },
        },
        {
          '@type': 'Service',
          name: 'Free GoHighLevel Patient-Getting System',
          description:
            'A complete patient acquisition system built inside GoHighLevel, provided free to healthcare clinic owners. Includes 6 pre-built sales funnels covering new patient lead generation, service promotions, booking, applications, patient reactivation, and review collection. Also includes 17 automated workflows and a complete patient CRM.',
          provider: {
            '@id': 'https://docsscale.com/#organization',
          },
          serviceType: 'Healthcare Marketing Automation',
          areaServed: 'United States',
          audience: {
            '@type': 'Audience',
            audienceType:
              'Healthcare clinic owners — chiropractic, dental, med spa, physical therapy, dermatology, optometry',
          },
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            description:
              'Complete GoHighLevel patient-getting system, free to download and keep. No trial, no credit card, no obligation.',
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Is the GoHighLevel patient-getting system actually free?',
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
                text: 'The system works for any patient-based healthcare clinic: chiropractic, dental, med spa, physical therapy, dermatology, optometry, primary care, and mental health practices.',
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
              name: 'What is included in the free patient-getting system?',
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
          name: 'How to claim the free GoHighLevel patient-getting system',
          description: 'Three steps to receive the complete free patient acquisition system from DocsScale.',
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
              text: 'The full GoHighLevel system — 6 funnels, 17 automations, and the complete patient CRM — is delivered directly to your email.',
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
