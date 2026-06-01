import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Christopher Cartland',
  description:
    'Software Engineer specializing in Android, Mobile, Embedded, and Serverless technologies',
  outDir: '../public/v2',
  base: '/v2/',
  cleanUrls: true,
  deadLinks: 'fail',
  // Lock dark mode and hide the light/dark toggle: the site has no light
  // theme (the :root and .dark color sets are identical), so the toggle is a
  // no-op. 'force-dark' keeps dark mode and removes the switch from the nav.
  appearance: 'force-dark',

  head: [
    ['link', { rel: 'icon', href: '/v2/favicon.ico', type: 'image/x-icon' }],
    ['link', { rel: 'manifest', href: '/v2/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#130830' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: '',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;500;700&display=swap',
      },
    ],
  ],

  themeConfig: {
    // Logo carries the name via alt text for screen readers; the visible
    // text label is redundant for sighted users who can see the logo.
    logo: {
      src: '/i/ChristopherCartlandLogo.jpg',
      alt: 'Christopher Cartland',
    },
    siteTitle: false,

    nav: [
      { text: 'About', link: '/' },
      { text: 'Projects', link: '/projects' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cartland' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/cartland' },
      { icon: 'x', link: 'https://x.com/LandOfCart' },
    ],

    footer: {
      message: '',
      copyright: '© 2024 Christopher Cartland',
    },
  },

  vite: {
    optimizeDeps: {
      include: ['chart.js'],
    },
  },
})
