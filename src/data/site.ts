// All copy on the site lives here. Sourced from the 2026 resume.

export const profile = {
  name: 'Martin Butarbutar',
  role: 'Frontend Engineer',
  email: 'butarbutar.m@gmail.com',
  linkedin: 'https://www.linkedin.com/in/martin-butarbutar',
  github: 'https://github.com/marxtinn',
  resume: '/Martin-Butarbutar-Resume.pdf',
  location: 'Jakarta, Indonesia',
  availability: 'Open to remote and hybrid roles',
  description:
    'Frontend engineer building web apps in React, Vue and TypeScript, with a focus on maintainable components and accessible UI.',
};

export const metrics = [
  { value: 71, suffix: '', prefix: '', label: 'Merged pull requests on the compliance app' },
  { value: 314, suffix: '', prefix: '', label: 'Of 477 commits authored, about half the production code' },
  { value: 87, suffix: '%', label: 'Fewer lines in the largest route files after a TanStack Query migration', prefix: 'Up to ' },
  { value: 283, suffix: '', prefix: '', label: 'Automated tests written: 66 Playwright and 217 Vitest' },
];

export type Project = {
  id: string;
  title: string;
  org: string;
  period: string;
  summary: string;
  stack: string[];
  icons?: string[];
  points: string[];
  layout: string;
  highlights?: string[];
  tone: 'accent' | 'dots' | 'surface' | 'ink';
};

export const projects: Project[] = [
  {
    id: 'compliance',
    title: 'Accounting compliance web app',
    org: 'Tesserac AI',
    period: '2026',
    summary:
      'Lead frontend contributor to a BAS/GST compliance app for accounting firms, from Xero connect to client working papers.',
    stack: ['React 19', 'TypeScript', 'TanStack Router', 'TanStack Query'],
    icons: ['simple-icons:react', 'simple-icons:typescript', 'simple-icons:reactquery', 'simple-icons:xero'],
    points: [
      'Authored 314 of 477 commits and 71 merged PRs, about half of the production source code.',
      'Planned and ran a migration to TanStack Query with 10 shared API hook modules, cutting the 5 largest route and component files by 71 to 87% (the dashboard page went from 1,000 to 153 lines).',
      'Built the end-to-end job workflow: Xero connect wizard, document upload driven by a Chrome extension, transaction review (bank, GST, payroll, invoices, journals), trial balance checks and working papers.',
      'Shipped passwordless sign-in (magic link, Google OAuth), session management with token revoke, and a password-protected portal for sharing working papers with clients.',
      'Replaced a fetch-everything query with server-side pagination and bulk actions, merged 12 copy-pasted dialogs into one shared shell, and closed all 30 open Dependabot security advisories.',
    ],
    highlights: ['Xero connect wizard and job workflow', 'Passwordless sign-in and client portal', 'All 30 Dependabot advisories closed'],
    layout: 'md:col-span-2 lg:row-span-2',
    tone: 'accent',
  },
  {
    id: 'assistant',
    title: 'AI assistant in Slack and Teams',
    org: 'Tesserac AI',
    period: '2026',
    summary:
      'TypeScript services that let users chat with an AI assistant inside Slack and Microsoft Teams, taken from sandbox to production.',
    stack: ['TypeScript', 'Node.js', 'CopilotKit', 'Vitest'],
    icons: ['ph:slack-logo', 'ph:microsoft-teams-logo'],
    points: [
      'Built the services from sandbox prototypes to production and wrote about 217 Vitest cases across both.',
      'Added a live status card and progress indicators to Teams replies.',
      'Fixed pasted images (Teams) and pasted tables (Slack) going missing from conversations.',
      'Found why Slack replies over 12k characters were silently cut off (a bug inside CopilotKit) and shipped a patch.',
      'Contributed to the Go and Python backends these services call: a streaming chat endpoint, sender authorization checks and Microsoft 365 mail notifications.',
    ],
    layout: 'md:col-span-2',
    tone: 'surface',
  },
  {
    id: 'legal',
    title: 'Legal platform and Word add-in',
    org: 'Tesserac AI',
    period: '2026',
    summary: 'Set up the first end-to-end test suite and built AI checklist generation with live job status.',
    stack: ['React', 'Office.js', 'Playwright', 'WebSocket'],
    icons: ['ph:microsoft-word-logo'],
    points: [
      'Set up the first end-to-end test suite: 66 Playwright tests with page objects and API mocks, running in GitHub Actions on Chromium, Firefox and WebKit.',
      'Built AI checklist generation from document templates, with live job status over WebSocket (backoff reconnect, state kept across page refresh).',
      'Replaced base64 form uploads with pre-signed storage uploads and per-file progress bars, cutting the submit timeout from 5 minutes to 1.',
      'Fixed placeholder editing in the Word add-in under Track Changes, which had left orphaned content controls and broken occurrence counts.',
    ],
    layout: '',
    tone: 'ink',
  },
  {
    id: 'm365',
    title: 'Microsoft 365 agent tooling',
    org: 'Tesserac AI',
    period: '2026',
    summary: 'Rewrote the command-line tool AI agents use for Microsoft 365, then hardened it after a real incident.',
    stack: ['Node.js', 'Microsoft Graph'],
    icons: ['ph:microsoft-outlook-logo'],
    points: [
      'Rewrote the Microsoft 365 command-line tool the agents use into 16 Node.js modules and added support for shared mailboxes, Teams, meetings, OneNote, SharePoint and OneDrive.',
      'Fixed the tool after an incident that misfiled 83 client emails (pagination, stable message IDs, undo logs for batch moves) and covered it with a mocked test harness.',
      'Wrote and maintained agent skill instructions for Google Workspace, LexisNexis legal research and legal intake, used by law-firm clients.',
    ],
    layout: '',
    tone: 'dots',
  },
  {
    id: 'email-builder',
    title: 'Drag-and-drop email builder',
    org: 'Tesserac AI',
    period: '2026',
    summary:
      'Bootstrapped an email builder with undo/redo and exports that render correctly in Outlook and Apple Mail.',
    stack: ['React', 'Zustand', 'dnd-kit', 'Vitest'],
    points: [
      'Built a document store with undo/redo (Zustand, Immer, Zundo), resizable columns and 5 block types.',
      'Made exports render correctly in Outlook and Apple Mail (600px tables, table-based dividers, UTF-8 EML) and locked canvas-to-export parity with 41 Vitest cases.',
      'Fixed an AI editing agent (Mastra) that dropped content from long briefs by tightening its prompt with a section checklist and raising its step limit.',
    ],
    layout: 'md:col-span-2',
    tone: 'dots',
  },
  {
    id: 'tracker',
    title: 'Project and work-item tracker',
    org: 'Tesserac AI',
    period: '2026',
    summary: 'A "My work" view across every project, with bulk actions and the Go endpoint behind it.',
    stack: ['React', 'TypeScript', 'Go'],
    points: [
      'Built the "My work" page and home summary so users see work assigned to them across all projects, plus the Go endpoint behind it.',
      'Added bulk selection, inline status changes and quick comments to the cross-project list, matching the project-scoped views.',
      'Fixed layout bugs where pages failed to scroll and long pasted text pushed dialog buttons off-screen.',
    ],
    layout: '',
    tone: 'surface',
  },
  {
    id: 'nexlaw',
    title: 'NexLaw legal platform',
    org: 'NexLaw Inc',
    period: '2025',
    summary: 'Modular subscription flows, an optimistic legal chat and Astro feature pages for a US legal-tech company.',
    stack: ['Vue 2', 'Vuex', 'Astro'],
    icons: ['simple-icons:vuedotjs', 'simple-icons:astro'],
    points: [
      'Split the subscription feature into modular Vue 2 components and Vuex modules.',
      'Added polling and optimistic updates to the legal chat, so messages show up without waiting on the server.',
      'Restructured the Trial Prep module around structured Vuex stores to keep automation data consistent.',
      'Designed and built the UI states missing from the design specs.',
      'Built feature pages in Astro with Vue and React components.',
    ],
    layout: '',
    tone: 'surface',
  },
  {
    id: 'nex360',
    title: 'Nex360 revamp: auth and audience intelligence',
    org: 'NexLaw Inc',
    period: '2025',
    summary:
      'Nuxt 3 modules with hybrid SSR, typed Pinia stores, WCAG 2.1 AA UI and interactive D3 analytics dashboards.',
    stack: ['Nuxt 3', 'TypeScript', 'Pinia', 'Tailwind CSS 4', 'D3'],
    icons: ['simple-icons:nuxt', 'simple-icons:d3', 'simple-icons:tailwindcss'],
    points: [
      'Built the modules in Nuxt 3 (Vue 3 Composition API) and TypeScript with hybrid SSR/CSR rendering.',
      'Set up a feature-based architecture with typed, SSR-hydrated Pinia stores.',
      'Built accessible UI with Tailwind CSS 4 and shadcn-nuxt to WCAG 2.1 AA.',
      'Routed all REST calls through one HTTP client with JWT auth and Zod-validated API contracts.',
      'Built interactive analytics dashboards with D3 and Unovis.',
    ],
    layout: 'md:col-span-2 lg:col-span-4',
    tone: 'accent',
  },
];

export const experience = [
  {
    company: 'Tesserac AI',
    role: 'Software Engineer',
    period: 'Jan to Oct 2026',
    place: 'Jakarta',
    about: 'AI assistants and workflow software for accounting and law firms.',
    highlights: [
      'Lead frontend contributor on the accounting compliance app.',
      'Built the Slack and Teams integrations for the AI assistant.',
      'Set up the first Playwright end-to-end suite for the legal platform.',
    ],
  },
  {
    company: 'NexLaw Inc',
    role: 'Front End Engineer',
    period: 'May to Oct 2025',
    place: 'San Francisco, remote',
    about: 'US legal-tech company. Worked remotely on two products.',
    highlights: [
      'Shipped Vue 2 and Vuex features on the core legal platform.',
      'Built the Nuxt 3 auth and audience intelligence modules for Nex360.',
    ],
  },
  {
    company: 'AyoPajak',
    role: 'Front End Engineer Intern',
    period: 'Sep to Nov 2024',
    place: 'PT Garda Bina Utama, Jakarta',
    about: 'Online tax filing for individuals and businesses in Indonesia, recognized by the tax authority.',
    highlights: [
      'Turned mockups into reusable React components for the individual tax return (e-SPT OP) module.',
      'Worked with the backend team to debug and speed up existing features.',
    ],
  },
];

export const marquee = [
  { icon: 'simple-icons:react', name: 'React' },
  { icon: 'simple-icons:typescript', name: 'TypeScript' },
  { icon: 'simple-icons:vuedotjs', name: 'Vue' },
  { icon: 'simple-icons:nextdotjs', name: 'Next.js' },
  { icon: 'simple-icons:nuxt', name: 'Nuxt' },
  { icon: 'simple-icons:astro', name: 'Astro' },
  { icon: 'simple-icons:reactquery', name: 'TanStack Query' },
  { icon: 'simple-icons:tailwindcss', name: 'Tailwind CSS' },
  { icon: 'simple-icons:shadcnui', name: 'shadcn/ui' },
  { icon: 'simple-icons:playwright', name: 'Playwright' },
  { icon: 'simple-icons:vitest', name: 'Vitest' },
  { icon: 'simple-icons:nodedotjs', name: 'Node.js' },
  { icon: 'simple-icons:go', name: 'Go' },
  { icon: 'simple-icons:python', name: 'Python' },
  { icon: 'simple-icons:supabase', name: 'Supabase' },
  { icon: 'simple-icons:d3', name: 'D3' },
  { icon: 'simple-icons:zod', name: 'Zod' },
  { icon: 'simple-icons:githubactions', name: 'GitHub Actions' },
  { icon: 'simple-icons:claude', name: 'Claude Code' },
];

export const skills = [
  { group: 'Languages', items: ['TypeScript', 'JavaScript (ES6+)', 'Go (working)', 'Python (working)'] },
  {
    group: 'Frontend',
    items: ['React', 'Next.js', 'Vue 2/3', 'Nuxt 3', 'Astro', 'TanStack Router/Query/Table', 'Zustand', 'Pinia', 'Vuex', 'Redux', 'React Hook Form', 'Zod'],
  },
  { group: 'Styling and UI', items: ['Tailwind CSS', 'shadcn/ui', 'Radix UI', 'D3', 'WCAG 2.1 AA'] },
  { group: 'Testing', items: ['Playwright (E2E, page objects, API mocking)', 'Vitest'] },
  {
    group: 'APIs and integrations',
    items: ['REST', 'WebSockets', 'SSE', 'Node.js', 'Supabase', 'Microsoft Graph', 'Slack API', 'Office.js', 'CopilotKit', 'Mastra'],
  },
  { group: 'Tools', items: ['Git', 'GitHub Actions', 'Vite', 'Docker (basic)', 'Claude Code'] },
];

export const education = [
  { school: 'Purwadhika Digital Technology School', detail: 'Full-stack Web Development', note: 'Score 88.32 / 100' },
  { school: 'Diponegoro University', detail: 'B.Eng. in Mechanical Engineering', note: 'GPA 3.26 / 4.00' },
];

export const languages = [
  { name: 'Bahasa Indonesia', level: 'Fluent' },
  { name: 'English', level: 'Fluent' },
  { name: 'German', level: 'Conversational' },
];
