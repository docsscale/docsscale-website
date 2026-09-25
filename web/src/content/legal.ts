// Privacy Policy and Terms of Service text. Rewritten September 2026 to describe
// DocsScale's actual data practices; pending legal review (the draft banner on
// both pages stays until the review is done). Each section is a heading plus
// paragraphs; `id` makes a section linkable (the footer links to #patient-data).

export type LegalDoc = {
  title: string;
  updated: string;
  sections: { id?: string; heading: string; paragraphs: string[] }[];
};

export const PRIVACY: LegalDoc = {
  title: 'Privacy Policy',
  updated: 'September 2026',
  sections: [
    {
      heading: 'What this covers',
      paragraphs: [
        'This policy explains what information DocsScale collects through docsscale.com, how we use it, and which service providers help us handle it.',
        'It applies to visitors of docsscale.com, including the free-system pages at docsscale.com/free-system/, and to anyone who contacts us or books a call through the site. Information we handle for clinic clients under a service agreement is covered by that agreement (see Patient data below).',
      ],
    },
    {
      heading: 'Information we collect',
      paragraphs: [
        'When you submit a form on this site, we collect what you enter. The strategy call forms ask for your name, clinic name, email, specialty, and optionally your phone number, number of locations and a message. The free-system form asks for your name and email, and optionally your phone number, clinic name and clinic type.',
        'When a form is submitted, our server also records a scrambled (hashed) form of your IP address, used only to block spam and repeated automated submissions. We do not store your IP address itself with your submission.',
        'If you book a call through the calendar on our booking page, the details you enter there are collected by our booking provider, GoHighLevel.',
        'Our hosting provider keeps standard server logs, such as IP address, browser type and pages requested, to run and secure the website.',
      ],
    },
    {
      heading: 'How we use it',
      paragraphs: [
        'We use what you submit to reply to you, schedule and prepare for your strategy call, send you the free system if you requested it, and follow up about DocsScale’s services. We do not sell your information or share it with other companies for their own marketing.',
        'You can ask us to stop following up at any time by emailing info@docsscale.com.',
      ],
    },
    {
      heading: 'Where your information goes',
      paragraphs: [
        'GoHighLevel (LeadConnector): every form submission is sent to our customer relationship management (CRM) system, operated by GoHighLevel, where we manage replies and follow-up. Calls booked through our calendar at booking.docsscale.com are handled by the same system.',
        'Our website server: so that no inquiry is lost if the CRM is unavailable, a backup copy of each form submission is kept in a private, access-restricted folder on our hosting server. It is never publicly accessible and is kept for up to 12 months, then deleted.',
        'Hostinger hosts this website and that server. These providers process information only to provide their services to us.',
      ],
    },
    {
      id: 'patient-data',
      heading: 'Patient data',
      paragraphs: [
        'DocsScale is a marketing agency, not a covered entity or a repository for clinical records. We do not store diagnoses, treatment history, or other clinical information. The forms on this site do not ask for health information; please do not include any in the message field.',
        'Where a client relationship involves protected health information, DocsScale signs a Business Associate Agreement (BAA) with the clinic and limits data handling to the minimum needed to run marketing and follow-up, consistent with that agreement.',
        'Specific data-handling commitments are set out in each clinic’s service agreement and BAA, which take precedence over this general page.',
      ],
    },
    {
      heading: 'Cookies and analytics',
      paragraphs: [
        'This website does not currently use analytics or advertising cookies. The booking calendar on our booking page is provided by GoHighLevel and may set its own cookies when you use it.',
        'Coming soon: we plan to add Google Analytics 4 to understand how visitors use the site, for example which pages are viewed and how people arrive. Google Analytics uses cookies. Before we turn it on, we will update this policy and, where the law requires it, ask for your consent.',
        'You can block or delete cookies at any time in your browser settings.',
      ],
    },
    {
      heading: 'Your choices',
      paragraphs: [
        'You can ask us what information we hold about you, ask us to correct or delete it, or ask us to stop contacting you, by emailing info@docsscale.com. We will respond within 30 days.',
      ],
    },
    {
      heading: 'Security',
      paragraphs: [
        'This site is served over an encrypted (HTTPS) connection. Access to our CRM and to the private backup on our server is limited to the DocsScale team.',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'We will update this page when our practices change, for example when analytics is added. The date at the top shows when it was last updated.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: ['Questions about this policy or your information can be sent to info@docsscale.com.'],
    },
  ],
};

export const TERMS: LegalDoc = {
  title: 'Terms of Service',
  updated: 'September 2026',
  sections: [
    {
      heading: 'Using this website',
      paragraphs: [
        'This website is provided to give clinics information about DocsScale’s services and a way to request a strategy call. Results shown on this site describe what specific clinics achieved at specific times; they are not a promise of the same outcome for your clinic.',
      ],
    },
    {
      heading: 'Engaging DocsScale',
      paragraphs: [
        'Any actual marketing services, pricing, deliverables, and commitments are set out in a separate signed agreement between DocsScale and the clinic, not on this website. That agreement governs if anything here conflicts with it.',
        'Engagements are month to month with 30 days’ written notice to end, as described in that agreement.',
      ],
    },
    {
      heading: 'Ad accounts and ownership',
      paragraphs: [
        'Clinics pay advertising platforms directly from their own ad accounts. DocsScale manages campaigns within those accounts but does not take ownership of a clinic’s ad accounts, website, or data.',
      ],
    },
    {
      heading: 'The free system',
      paragraphs: [
        'The GoHighLevel system offered at docsscale.com/free-system/ is free of charge and is provided as is, for use in your own clinic’s GoHighLevel account. You need your own GoHighLevel account to use it. We may update the system or stop offering it at any time.',
      ],
    },
    {
      heading: 'No guarantee of results',
      paragraphs: [
        'Marketing outcomes depend on many factors outside DocsScale’s control, including the clinic’s market, pricing, staffing, and how quickly inquiries are followed up. Past results shown on this site belong to specific clinics at a specific time and don’t guarantee similar results for any other clinic.',
      ],
    },
    {
      heading: 'Your information',
      paragraphs: [
        'How we collect and use information submitted through this site is described in our Privacy Policy at docsscale.com/privacy/.',
      ],
    },
    {
      heading: 'Changes to these terms',
      paragraphs: ['We may update this page from time to time. The version posted here is the current one.'],
    },
    {
      heading: 'Contact',
      paragraphs: ['Questions about these terms can be sent to info@docsscale.com.'],
    },
  ],
};
