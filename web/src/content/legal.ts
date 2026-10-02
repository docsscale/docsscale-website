// Privacy Policy and Terms of Service for docsscale.com (final, September 2026).
// Each section is a heading plus paragraphs; `id` makes a section linkable
// (the footer links to #patient-data). Paragraphs may contain links written as
// [text](url): an https:// URL opens the external page, #id jumps to a section. Keep the Privacy Policy in step with
// reality: update it whenever a service provider, form field or analytics
// setting changes, and change `updated`.

export type LegalDoc = {
  title: string;
  updated: string;
  sections: { id?: string; heading: string; paragraphs: string[] }[];
};

export const PRIVACY: LegalDoc = {
  title: 'Privacy Policy',
  updated: 'October 2, 2026',
  sections: [
    {
      heading: 'What this policy covers',
      paragraphs: [
        'This Privacy Policy explains how DocsScale ("DocsScale", "we", "us"), a marketing agency based in Houston, Texas, collects, uses, shares and protects information through docsscale.com, including the pages at docsscale.com/free-system/ (together, the "site").',
        'It applies to visitors of the site and to clinic owners and staff who contact us or book a call. Information we handle for clinic clients while delivering our services is governed by our written agreement with each clinic (see Patient data below).',
      ],
    },
    {
      heading: 'Information we collect',
      paragraphs: [
        'Information you give us. The strategy call forms ask for your name, clinic name, work email and specialty, and optionally your mobile number, number of locations and a short message. The free-system form asks for your name and work email, and optionally your mobile number, clinic name and clinic type. If you email us, we receive what you send.',
        'Information collected automatically. When you submit a form, our server records a one-way hashed (scrambled) value derived from your IP address, used only to detect spam and repeated automated submissions. We do not store your IP address itself with your submission. Our hosting provider also keeps standard server logs, such as IP address, browser type, the pages requested and the time of the request, to operate and secure the site.',
        'Booking calendar. If you book a call through the calendar on our booking page, the details you enter are collected by our scheduling provider, GoHighLevel, on our behalf.',
        'We do not ask for, and ask you not to submit, any patient health information through the site.',
      ],
    },
    {
      heading: 'How we use information',
      paragraphs: [
        'We use the information described above to: respond to your inquiry; schedule, prepare for and hold your strategy call; send you the free system if you request it; follow up with you about DocsScale’s services; keep the site secure and prevent spam and abuse; and comply with legal obligations.',
        'We contact people by email. We do not currently send text messages. If you give us a phone number, we may use it only to reach you about the call you requested.',
        'Every marketing email we send includes an unsubscribe link, and we honour unsubscribe requests promptly, within 10 business days. You can also unsubscribe at any time by emailing info@docsscale.com. Replies to your own inquiry and messages about a call you booked are not marketing emails and are not affected.',
        'We do not sell your personal information, and we do not share it with other companies for their own marketing.',
      ],
    },
    {
      id: 'service-providers',
      heading: 'Service providers we share information with',
      paragraphs: [
        'GoHighLevel (LeadConnector). Every form submission is sent to our customer relationship management (CRM) system, operated by GoHighLevel, where we manage replies, follow-up and bookings. Calls booked through our calendar at booking.docsscale.com are handled by the same system.',
        'Hostinger. Our website and its server are hosted by Hostinger. So that no inquiry is lost if the CRM is unavailable, a backup copy of each form submission is kept in a private, access-restricted folder on that server. It is never publicly accessible.',
        'Google. We use, or may use, Google Analytics 4 as described under Cookies and analytics.',
        'Microsoft. With your consent, we use Microsoft Clarity as described under Cookies and analytics.',
        'These providers process information on our behalf to provide their services to us. We may also disclose information if required by law, to protect our rights or the safety of others, or as part of a merger, acquisition or sale of our business, in which case this policy continues to apply to the information transferred.',
      ],
    },
    {
      id: 'google-ads-api',
      heading: 'Google Ads API access',
      paragraphs: [
        "Where DocsScale manages advertising on a clinic's behalf, we connect to that clinic's own Google Ads account using the Google Ads API, authorized through Google's sign-in (OAuth). This access lets us view and manage campaigns, ad groups, keywords, and performance data within the clinic's Google Ads account, on their instruction.",
        'Any data we obtain through this access is used only to provide our advertising management services to that clinic, is stored and protected under the same security practices described in this policy, and is never sold, used for advertising to third parties, or shared beyond what is necessary to deliver our services (see [Service providers we share information with](#service-providers)). We retain this access only for as long as we manage the account, and a clinic can revoke it at any time through their own Google Account permissions (myaccount.google.com/permissions).',
        'Our use and transfer of information received from Google APIs adheres to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.',
      ],
    },
    {
      heading: 'How long we keep information',
      paragraphs: [
        'The backup copy of each form submission on our server is deleted after 12 months. Information in our CRM is kept for as long as we have an active or potential business relationship with you, and for up to 3 years after our last contact, unless you ask us to delete it sooner or the law requires us to keep it longer. Server logs are kept by our hosting provider according to its own retention schedule.',
      ],
    },
    {
      id: 'patient-data',
      heading: 'Patient data',
      paragraphs: [
        'DocsScale is a marketing agency, not a healthcare provider, and does not store clinical records. We do not collect diagnoses, treatment history or other clinical information through this site.',
        'Where a client relationship involves protected health information (PHI), DocsScale signs a Business Associate Agreement (BAA) with the clinic before handling any PHI, and limits its handling to the minimum necessary to run the agreed marketing and follow-up. That agreement, not this policy, governs how PHI is handled.',
      ],
    },
    {
      id: 'cookies',
      heading: 'Cookies and analytics',
      paragraphs: [
        'This site does not use advertising cookies. The booking calendar on our booking page is provided by GoHighLevel and may set its own cookies when you use it, as described in GoHighLevel’s privacy policy.',
        'We use, or may use, Google Analytics 4 to understand how visitors use the site, such as which pages are viewed and how visitors arrive. Google Analytics uses cookies and collects information such as device, browser, approximate location and pages visited; we do not use it to identify you personally. Where the law requires your consent for analytics cookies, we will ask for it before they are set. You can opt out of Google Analytics with Google’s browser add-on (tools.google.com/dlpage/gaoptout) or by blocking cookies in your browser.',
        'With your consent, we also use Microsoft Clarity to see how visitors use our pages, for example where they click and how far they scroll, through heatmaps and recordings of visits. Clarity uses cookies and collects information such as device, browser, approximate location, pages visited and how you interact with them. Everything typed into our forms is masked before it leaves your browser, so Clarity never records what you enter. Clarity is provided by Microsoft; see the [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement). You can withdraw your consent at any time with "Cookie settings" at the bottom of every page.',
        'Some browsers send a "Do Not Track" signal. Because there is no common standard for it, the site does not respond to it; the choices above remain available to you.',
      ],
    },
    {
      heading: 'Your choices and rights',
      paragraphs: [
        'You can ask us to tell you what personal information we hold about you, to correct it, to delete it, or to stop contacting you. Depending on where you live, you may have additional rights under state privacy laws, such as the right to obtain a copy of your information.',
        'To make a request, email info@docsscale.com from the email address you gave us, or tell us how we can confirm your identity. We will respond within 45 days, and we will not treat you differently for exercising your rights. If we decline a request, we will explain why, and you may reply to that email to appeal.',
      ],
    },
    {
      heading: 'Security',
      paragraphs: [
        'The site is served over an encrypted (HTTPS) connection. Form data is sent to our CRM over encrypted connections, and access to the CRM and to the private backup on our server is limited to authorized DocsScale personnel. No method of transmission or storage is completely secure, but we take reasonable measures to protect the information we hold.',
      ],
    },
    {
      heading: 'Children',
      paragraphs: [
        'The site is intended for businesses and is not directed to children under 13. We do not knowingly collect personal information from children.',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'We may update this policy, for example when we add or change a service provider. The date at the top shows when it was last updated. If a change materially affects how we use information we already hold, we will tell you before it applies.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        'DocsScale, Houston, Texas, United States. Questions about this policy or your information: info@docsscale.com.',
      ],
    },
  ],
};

export const TERMS: LegalDoc = {
  title: 'Terms of Service',
  updated: 'September 2026',
  sections: [
    {
      heading: 'About these terms',
      paragraphs: [
        'These Terms of Service govern your use of docsscale.com, including the pages at docsscale.com/free-system/ (together, the "site"), operated by DocsScale, a marketing agency based in Houston, Texas. By using the site, you agree to these terms. If you do not agree, please do not use the site.',
      ],
    },
    {
      heading: 'Using this website',
      paragraphs: [
        'The site gives clinics information about DocsScale’s services and a way to request a strategy call or download our free system. You agree not to misuse the site, including by submitting false or automated form entries, attempting to access areas that are not public, or interfering with its operation.',
        'Results and case studies on the site describe what specific clinics achieved at specific times. They are not a promise that your clinic will achieve the same results.',
      ],
    },
    {
      heading: 'Engaging DocsScale',
      paragraphs: [
        'Our marketing services, pricing, deliverables and commitments are set out in a separate written agreement between DocsScale and each clinic, not on this site. If anything on the site conflicts with that agreement, the agreement governs.',
        'Engagements are month to month with 30 days’ written notice to end, as described in that agreement.',
      ],
    },
    {
      heading: 'Ad accounts and ownership',
      paragraphs: [
        'Clinics pay advertising platforms directly from their own ad accounts. DocsScale manages campaigns within those accounts but does not take ownership of a clinic’s ad accounts, website or data.',
      ],
    },
    {
      heading: 'The free system',
      paragraphs: [
        'The GoHighLevel system offered at docsscale.com/free-system/ (funnels, automations and CRM setup) is free of charge. It is licensed to you for use in your own clinic’s GoHighLevel account; you may adapt it for your clinic, but you may not resell or redistribute it. You need your own GoHighLevel account, which is subject to GoHighLevel’s own terms and pricing. You are responsible for how you configure and use the system, including making sure your messages, forms and automations comply with the laws and platform rules that apply to your clinic.',
        'The free system is provided as is. We may update it or stop offering it at any time.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'The site and its content, including text, graphics, logos and design, belong to DocsScale or its licensors. You may view and share pages from the site for your own information, but you may not copy, modify or reuse its content for commercial purposes without our written permission, except as allowed above for the free system.',
      ],
    },
    {
      heading: 'Third-party services',
      paragraphs: [
        'The site uses third-party services, including GoHighLevel for our forms’ follow-up and our booking calendar. Your use of those services may be subject to their own terms and privacy policies. We are not responsible for third-party websites or services.',
      ],
    },
    {
      heading: 'No guarantee of results',
      paragraphs: [
        'Marketing outcomes depend on many factors outside DocsScale’s control, including the clinic’s market, pricing, staffing and how quickly inquiries are followed up. Past results shown on the site belong to specific clinics at a specific time and do not guarantee similar results for any other clinic.',
      ],
    },
    {
      heading: 'Disclaimers and limitation of liability',
      paragraphs: [
        'The site and the free system are provided "as is" and "as available", without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose and non-infringement, to the fullest extent permitted by law.',
        'To the fullest extent permitted by law, DocsScale will not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of profits, revenue or data, arising from your use of the site or the free system. Our total liability for any claim relating to the site or the free system will not exceed one hundred US dollars (US$100). These limits do not apply to services provided under a signed client agreement, which has its own terms.',
      ],
    },
    {
      heading: 'Your information',
      paragraphs: [
        'How we collect and use information submitted through the site is described in our Privacy Policy at docsscale.com/privacy/.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [
        'These terms are governed by the laws of the State of Texas and applicable US federal law, without regard to conflict-of-law rules. Any dispute relating to the site will be brought in the state or federal courts located in Harris County, Texas, and you agree to the jurisdiction of those courts.',
      ],
    },
    {
      heading: 'Changes to these terms',
      paragraphs: [
        'We may update these terms from time to time. The date at the top shows when they were last updated, and the version posted here is the current one. Continuing to use the site after an update means you accept the updated terms.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        'DocsScale, Houston, Texas, United States. Questions about these terms: info@docsscale.com.',
      ],
    },
  ],
};
