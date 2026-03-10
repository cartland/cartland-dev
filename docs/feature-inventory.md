# chriscart.land — Feature Inventory

> **Purpose:** Document every feature of the chriscart.land website so that after a refactor, each feature can be verified as preserved. This serves as the acceptance checklist.

---

## 1. Pages & Routes

| Route                          | Source File                                  | Purpose                                                    |
| ------------------------------ | -------------------------------------------- | ---------------------------------------------------------- |
| `/`                            | `public/index.html`                          | Home/about page — bio, hero image, social links            |
| `/projects`                    | `public/projects.html`                       | Portfolio — 19 project cards in 3-col grid, table of contents |
| `/temperature-visualization`   | `public/temperature-visualization.html`      | Interactive temperature grid visualization                 |
| `/utility-vs-solar-battery`    | `public/utility-vs-solar-battery.html`       | Solar vs utility cost calculator                           |
| `/battery-butler-privacy-policy` | `public/battery-butler-privacy-policy.html` | Battery Butler app privacy policy                          |
| `/garage-privacy-policy`       | `public/garage-privacy-policy.html`          | Garage app privacy policy                                  |
| `/404`                         | `public/404.html`                            | Custom error page with home link                           |
| `/playground/*`                | `public/playground/*.html`                   | 3 layout test pages (hero, card-layout, paragraph-image)   |

Firebase config: `cleanUrls: true`, rewrites for `/` and `/projects`.

- [ ] All routes load without errors
- [ ] Clean URLs work (no `.html` extension needed)
- [ ] Rewrites resolve correctly

---

## 2. Home Page (`index.html`)

- [ ] Hero section: name, tagline ("Software Engineer and Tech Maker"), subtitle ("Mobile / Android / Embedded / Serverless")
- [ ] Golden Gate Bridge hero image (side-by-side on desktop, stacked on mobile)
- [ ] Bio paragraphs: Google career, Developer Relations, World Solar Challenge, personal projects
- [ ] CalSol finish-line image
- [ ] CTA link to Projects page
- [ ] Social media links (LinkedIn, GitHub, X, Threads) with icon images
- [ ] JS: `adjustHeroImgHeight()` syncs image to text height on desktop

---

## 3. Projects Page (`projects.html`)

- [ ] Table of contents with anchor links to each project section
- [ ] 19 project cards, each with: image (lazy-loaded), title, description, external link button, tags
- [ ] 3-column CSS Grid (responsive to 1-column on mobile)
- [ ] Print-optimized styles (3-col maintained, URLs shown, page-break avoidance)

**Projects list:**

1. Android Build Time (podcast)
2. Google TV App Ecosystem (Wirecutter)
3. Android Auto Apps (200M+ cars)
4. Google Play Billing
5. Music Alarms on Android (Pandora)
6. COVID-19 Exposure Notifications (50+ countries)
7. Google Sign-In
8. Android Deep Links
9. World Solar Challenge (CalSol)
10. Smart Garage Door (IoT)
11. Marauder's Map (NFC + Canvas)
12. Instant Runoff Voting (Apps Script)
13. Autostereogram Generator (Go)
14. Computer History Museum talk
15. Berkeley Alumni Spotlight
16. Templeton Alumni Profile
17. Global Temperature Visualization
18. Utility vs. Solar + Battery
19. Portfolio Website (self-referential)

- [ ] All 19 project cards present
- [ ] Each card has image, title, description, link button, and tags
- [ ] Table of contents links scroll to correct section

---

## 4. Temperature Visualization (`temperature-visualization.html`)

- [ ] Grid visualization: years as columns, months as rows, colored by value
- [ ] 4 viewing modes: Temperature, Anomaly, Anomaly 3-month avg, Anomaly 5-month avg
- [ ] 3 color presets: Default, Greyscale, Inferno (loaded from JSON)
- [ ] Advanced 5-point color picker (Low / LowMid / Mid / HighMid / High) with HSV sliders + hex input
- [ ] Download Image button (html2canvas PNG export)
- [ ] Download/Upload Colors (JSON)
- [ ] Description text updates per mode
- [ ] NOAA NCEI data attribution

**JS modules:** `main.js`, `api.js`, `colors.js`, `dom.js`, `state.js`

**Data files:** 5 CSVs, 3 baseline JSONs, 3 color preset JSONs in `/global-temperatures/`

---

## 5. Solar Battery Calculator (`utility-vs-solar-battery.html`)

- [ ] Chart.js bar chart: annual cost comparison
- [ ] Cost summary panel: Total Utility Cost, Total Solar+Battery Cost, Savings
- [ ] 3 input sections:
  - General: duration (years), investment opportunity cost (%)
  - Utility: initial annual bill, annual cost increase (%)
  - Solar+Battery: upfront solar cost, solar lifespan, battery cost, battery lifespan, battery cost decrease/replacement, grid connection fee (%)
- [ ] Share button: generates URL with abbreviated query params, copies to clipboard
- [ ] Restore Defaults button
- [ ] URL parameter support with aliases (d, ocr, iuc, uci, scb, sl, bcb, bl, bcd, uup)
- [ ] Real-time recalculation on input change
- [ ] Tailwind CSS dark theme with gradient header text

---

## 6. Privacy Policy Pages

### Battery Butler (`battery-butler-privacy-policy.html`)

- [ ] Private/limited access note, Play Store link
- [ ] Sections: info collected, usage, no third-party sharing, account/data deletion instructions, contact email

### Garage (`garage-privacy-policy.html`)

- [ ] Private/limited access note, Play Store link
- [ ] Sections: info collected, usage, no third-party sharing, user choices, security practices

---

## 7. Navigation & Layout

- [ ] **Header**: Logo (dark + light versions swap), nav links (About, Projects)
- [ ] **Desktop**: horizontal nav
- [ ] **Mobile (<600px)**: hamburger menu → full-screen overlay with focus trapping (Tab/Shift+Tab/Escape)
- [ ] **Footer**: copyright + home link on all pages
- [ ] **Active page**: underline style + `aria-current="page"`
- [ ] JS: `toggleMenu()`, `trapFocus()`, `markCurrentNavLinkAsActive()`

---

## 8. Design System

### Colors

- [ ] `--background-color: #130830` (dark purple, main pages)
- [ ] `--color: #ffffff` (text)
- [ ] `--color-link: #cccccc` or `#c1c1c1`
- [ ] Card selected: `rgba(255, 255, 255, 0.2)`

### Typography

- [ ] Roboto (Google Fonts), weights: 100, 400, 500, 700
- [ ] Base 0.9em, scales up on larger screens

### Animations

- [ ] Hamburger → X rotation (0.3s)
- [ ] Overlay fade (0.3s opacity)
- [ ] Logo swap opacity transition
- [ ] Hover effects on links/cards

### Responsive breakpoint: 600px

- [ ] Grid: 3-col → 1-col
- [ ] Hero: side-by-side → stacked
- [ ] Nav: horizontal → hamburger
- [ ] Social icons: 66px → 48px

### Buttons

- [ ] Pill-shaped (border-radius: 32px), uppercase, border-based, hover opacity

---

## 9. Accessibility

- [ ] Skip-to-main-content link (visually hidden, shows on focus)
- [ ] `focus-visible` outlines (2px) on all interactive elements
- [ ] Semantic HTML: `<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`, `<section>`
- [ ] ARIA: `aria-expanded` on menu, `aria-current="page"`, `aria-label` on buttons/images
- [ ] Keyboard: Enter/Space on menu icon, Tab trapping in mobile menu, Escape to close
- [ ] Image alt text, proper heading hierarchy, form labels with `for`

---

## 10. Performance & PWA

- [ ] `loading="lazy"` on all project images
- [ ] `preconnect` to Google Fonts
- [ ] ES6 modules (no global scope pollution)
- [ ] Minimal external deps: Google Fonts, Chart.js (calculator only), html2canvas (temp viz only)
- [ ] `manifest.json`: app name, short name, standalone display, theme color #263551, favicon icon
- [ ] `favicon.ico` (48x48)

---

## 11. Meta & SEO

- [ ] `charset="utf-8"`, viewport meta
- [ ] Per-page `<meta name="description">`
- [ ] `<meta name="theme-color">` (#263551 or #130830)
- [ ] Canonical URLs per page
- [ ] `<title>` per page

---

## 12. Assets

### Images (`/public/i/`) — 24+ files

**Logo:** `ChristopherCartlandLogo.jpg`, `ChristopherCartlandLogoLight.jpg`, `Favicon.jpg`

**Project images:** AndroidAutoApps, AndroidBuildTime, AndroidDeepLinks, Autostereogram, BerkeleyAlumni, CalSolFirstPlaceFormulaSun2017, ChrisCartlandWebsite, ComputerHistoryMuseum, ExposureNotifications, GitHub, GoldenGateBridge, GooglePlayBilling, GoogleSignIn, GoogleTVWirecutter, InstantRunoffVoting, LinkedIn, MaraudersMap.gif (animated), PandoraMusicAlarms, SmartGarageDoor, Temperature.png, TempletonAlumni, Threads, WorldSolarChallenge, X

**Other:** solar-battery-cost.png

### Playground images (`/public/playground/`)

bridge.jpg, bridge_tall.jpg, bridge_wide.jpg

### Temperature data (`/public/global-temperatures/`)

**CSVs:** hadcrut-1850-1900, hadcrut-1850-1900-f3m, hadcrut-1850-1900-f5m, gistemp-1951-1980, hadcrut-1901-2020

**JSONs:** base-1850-1900, base-1901-2020, base-1951-1980, colors-default, colors-grey, colors-inferno

- [ ] All image assets present and loading
- [ ] All data files present and parseable
- [ ] Animated GIF (MaraudersMap) plays correctly

---

## 13. Firebase Hosting Config

```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "/projects", "destination": "/projects.html" },
      { "source": "/", "destination": "/index.html" }
    ],
    "cleanUrls": true
  }
}
```

- [ ] Config unchanged or equivalent behavior preserved
- [ ] Clean URLs working
- [ ] Rewrites resolving correctly

---

## 14. External Links (must still work post-refactor)

- [ ] Social: LinkedIn (/in/cartland), GitHub (/cartland), X (/LandOfCart), Threads (/@LandOfCart)
- [ ] Play Store: Battery Butler, Garage app
- [ ] Contact: chris@chriscart.land
- [ ] Data: NOAA NCEI
- [ ] Professional: Google blogs, Android blogs, YouTube talks, Wirecutter, Berkeley Engineering

---

## 15. Apps (not served on website, but in repo)

- `apps/SolarBattery/` — Kotlin Multiplatform (Android/iOS/Desktop/Wasm) version of the solar calculator
- `apps/TemperatureVisualization/` — Kotlin CLI tool that generates the temperature data/visualizations

These are separate build artifacts, not part of the Firebase-hosted site.

- [ ] Apps still build independently
- [ ] No broken cross-references between apps and website

---

## Verification Approach

After refactoring, verify each numbered section above:

1. Visit each route — confirm it loads and matches described content
2. Check responsive behavior at <600px and >600px for each page
3. Test all interactive features (menu, color pickers, calculator inputs, share URL, download image)
4. Verify accessibility (tab through page, skip link, screen reader landmarks)
5. Run `npm test` (unit tests, HTML validation, CSS lint, JS lint, link check)
6. Check print styles on projects page
7. Confirm all external links resolve
8. Verify meta tags, manifest, favicon in browser dev tools
