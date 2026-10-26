export const SITE_URL = 'https://budget-manager.devminds.net';
export const SITE_NAME = 'DevMinds Budget App';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const OG_IMAGE_ALT = 'DevMinds Budget App — the free budget planner and budget manager';
export const DEFAULT_TITLE = 'DevMinds Budget App — Free Budget Planner & Budget Manager';
export const DEFAULT_DESCRIPTION =
  'DevMinds Budget App is a free budget planner and budget manager. Set a budget, allocate it across categories, log expenses and see utilization in real time. Sign in with Google.';

export const FEATURES = [
  { title: 'Budget planner', body: 'Set your total budget and plan exactly how much goes to each category, team or goal.' },
  { title: 'Allocations that add up', body: 'Split your budget into allocations and always see what is left to assign.' },
  { title: 'Expense tracking', body: 'Log spending against each allocation and watch utilization update instantly.' },
  { title: 'Visual reports', body: 'Charts and summary cards show where your money goes at a glance.' },
  { title: 'Secure sign-in', body: 'Email and password or Google sign-in, hashed passwords, JWT sessions and reCAPTCHA.' },
  { title: 'Light and dark themes', body: 'A clean budget manager that follows your system theme on any device.' },
] as const;

export const STEPS = [
  { title: 'Create a free account', body: 'Sign up with your email or continue with Google in seconds.' },
  { title: 'Plan your budget', body: 'Enter your budget and allocate it across the categories that matter to you.' },
  { title: 'Track and adjust', body: 'Record expenses, follow utilization and rebalance allocations any time.' },
] as const;

export const FAQ = [
  { q: 'Is the DevMinds Budget App free?', a: 'Yes. The DevMinds Budget App is a free budget app. Create an account and start planning your budget at no cost.' },
  { q: 'What can I do with this budget planner?', a: 'Set a total budget, allocate it across categories or departments, log expenses against each allocation and see how much of every budget is used.' },
  { q: 'Can I use the budget manager on my phone?', a: 'Yes. The budget manager runs in any modern browser on desktop, tablet or mobile, with nothing to install.' },
  { q: 'Can I sign in with Google?', a: 'Yes. You can sign up and sign in with your Google account or with an email and password.' },
  { q: 'Who makes the DevMinds Budget App?', a: 'The DevMinds Budget App is built by DevMinds, the software studio of Noorullah Azizi, alongside DevMinds Notes, Marketplace and Jobs.' },
] as const;

export const PRODUCTS = [
  { label: 'DevMinds — software studio', url: 'https://devminds.net' },
  { label: 'DevMinds Notes — free note taking app for online notes', url: 'https://notes.devminds.net' },
  { label: 'DevMinds Marketplace — buy and sell online', url: 'https://marketplace.devminds.net' },
  { label: 'DevMinds Jobs — jobs platform and education hub', url: 'https://jobs.devminds.net' },
  { label: 'DevMinds Works — our projects and work', url: 'https://ourworks.devminds.net' },
  { label: 'Noorullah Azizi — founder portfolio', url: 'https://noorullah-azizi.devminds.net' },
] as const;

const organization = {
  '@type': 'Organization',
  '@id': 'https://devminds.net/#organization',
  name: 'DevMinds',
  url: 'https://devminds.net',
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
  founder: { '@type': 'Person', name: 'Noorullah Azizi', url: 'https://noorullah-azizi.devminds.net' },
  sameAs: ['https://github.com/noorullahazizidxb', 'https://noorullah-azizi.devminds.net'],
};

export const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    organization,
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: ['DevMinds Budget Manager', 'DevMinds Budget Planner'],
      url: `${SITE_URL}/`,
      inLanguage: 'en',
      publisher: { '@id': 'https://devminds.net/#organization' },
    },
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/#app`,
      name: SITE_NAME,
      alternateName: ['DevMinds Budget Manager', 'DevMinds Budget Planner', 'Budget App'],
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web browser',
      browserRequirements: 'Requires JavaScript and a modern browser',
      url: `${SITE_URL}/`,
      image: OG_IMAGE,
      description: DEFAULT_DESCRIPTION,
      featureList: FEATURES.map((f) => f.title),
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      publisher: { '@id': 'https://devminds.net/#organization' },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/#breadcrumb`,
      itemListElement: [{ '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/` }],
    },
  ],
};

export const pageJsonLd = (name: string, path: string) => ({
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', '@id': `${SITE_URL}${path}#webpage`, url: `${SITE_URL}${path}`, name, isPartOf: { '@id': `${SITE_URL}/#website` } },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
      ],
    },
  ],
});
