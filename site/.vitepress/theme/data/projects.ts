export interface Project {
  id: string
  title: string
  description: string
  imagePath: string
  imageAlt: string
  linkUrl: string
  linkText: string
  tags: string
  isExternal: boolean
}

export const projects: Project[] = [
  {
    id: 'android-build-time',
    title: 'Android Build Time',
    description:
      'I host "Android Build Time," a video podcast series produced by the Android team at Google. Through in-depth technical conversations with Android developers, I interview developers about apps and technologies relevant to professional Android developers.',
    imagePath: '/i/AndroidBuildTime.jpg',
    imageAlt: 'Android Build Time Logo',
    linkUrl: 'https://goo.gle/AndroidBuildTime',
    linkText: 'Podcast',
    tags: 'Android, Developer Relations, Technical Communication, Public Speaking',
    isExternal: true,
  },
  {
    id: 'google-tv',
    title: 'Google TV App Ecosystem',
    description:
      "I bootstrapped the Google TV app ecosystem by working with top streaming services to build and launch their apps. The platform's success led Wirecutter to choose Google TV devices as both their top and budget picks for streaming devices multiple years in a row, citing the seamless app integration with the system.",
    imagePath: '/i/GoogleTVWirecutter.jpg',
    imageAlt: 'Google TV Interface',
    linkUrl: 'https://www.nytimes.com/wirecutter/reviews/best-media-streamers/',
    linkText: 'Wirecutter',
    tags: 'Android TV, Google TV, Developer Relations, Streaming Media, App Ecosystem',
    isExternal: true,
  },
  {
    id: 'android-auto',
    title: 'Android Auto Apps',
    description:
      "I led Developer Relations for Android Auto from its announcement in 2014, making music and audio app integrations safer and more delightful with Android Auto and Android Automotive OS. Through partnerships with automotive and app developers, we've grown the platform to be compatible with over 200 million cars on the road as of 2024.",
    imagePath: '/i/AndroidAutoApps.jpg',
    imageAlt: 'Android Auto Interface',
    linkUrl:
      'https://android-developers.googleblog.com/2014/11/begin-developing-with-android-auto.html',
    linkText: 'Blog Post',
    tags: 'Android Auto, Automotive, Cars, Developer Relations, Audio Streaming Apps',
    isExternal: true,
  },
  {
    id: 'play-billing',
    title: 'Google Play Billing',
    description:
      'I wrote example code for managing in-app purchases and subscriptions on Android. I worked with Android developers during the digital boom of music, movies, and TV services as they launched apps and focused on subscription business models. The samples demonstrate best practices for implementing Google Play Billing in Java and Kotlin, including server-side subscription management and real-time developer notifications.',
    imagePath: '/i/GooglePlayBilling.jpg',
    imageAlt: 'Google Play Billing Interface',
    linkUrl: 'https://github.com/cartland/play-billing-samples',
    linkText: 'GitHub',
    tags: 'Android, Google Play, In-App Purchases, Subscriptions, Java, Kotlin, Developer Relations',
    isExternal: true,
  },
  {
    id: 'music-alarms',
    title: 'Music Alarms on Android',
    description:
      'I designed the API integration for music alarms on Android, a feature that allows users to set alarms that play music from their music app. The feature was launched in 2019 and enabled Pandora to integrate into the Clock app on Android. Pandora wrote an engineering blog post about the integration.',
    imagePath: '/i/PandoraMusicAlarms.jpg',
    imageAlt: 'Music Alarms on Android',
    linkUrl:
      'https://engineering.pandora.com/wake-up-to-pandora-with-the-clock-app-from-google-7859fe7743aa',
    linkText: 'Blog Post',
    tags: 'Android, Music, Developer APIs, Developer Relations',
    isExternal: true,
  },
  {
    id: 'exposure-notifications',
    title: 'COVID-19 Exposure Notifications',
    description:
      'I led Developer Relations for the Exposure Notifications System, a collaboration between Google and Apple that helped governments alert people who were exposed to COVID-19. The privacy-preserving technology was adopted by over 50 countries and regions worldwide. Research showed it could detect almost twice as many potential infections as manual contact tracing, and Popular Science recognized it as "Innovation of the Year" in 2020.',
    imagePath: '/i/ExposureNotifications.jpg',
    imageAlt: 'COVID-19 Exposure Notifications Interface',
    linkUrl:
      'https://blog.google/inside-google/covid-19/exposure-notifications-end-year-update/',
    linkText: 'Blog Post',
    tags: 'COVID-19, Privacy, Public Health, Government Partnerships',
    isExternal: true,
  },
  {
    id: 'google-sign-in',
    title: 'Google Sign-In',
    description:
      'I wrote sample code that demonstrated how to authenticate users with Google+ Sign-In (now "Sign in with Google") across multiple platforms. When we started, few apps supported federated identity. Today, most apps and websites let users sign in with their Google account. I created client examples in JavaScript, Java, and Objective-C, along with server implementations in Python, Java, Go, and PHP. I presented this work at Google I/O 2013, helping developers understand and implement Google authentication in their apps.',
    imagePath: '/i/GoogleSignIn.jpg',
    imageAlt: 'Google Sign-In Image',
    linkUrl: 'https://www.youtube.com/watch?v=UUk1bjN7WR8',
    linkText: 'Google I/O Talk',
    tags: 'Authentication, OAuth, Android, iOS, Web, Java, Objective-C, JavaScript, Python, Go, PHP, Cross-Platform Development, Public Speaking',
    isExternal: true,
  },
  {
    id: 'android-deep-links',
    title: 'Android Deep Links',
    description:
      'I led a team that defined best practices for designing and handling deep links on Android. We created comprehensive documentation and educational content, including the Deep Links Crash Course, to help developers understand how to properly integrate their websites with Android apps. This work established standards for seamless navigation between web and Android platforms, improving user experience across the Android ecosystem.',
    imagePath: '/i/AndroidDeepLinks.jpg',
    imageAlt: 'Android Deep Links Diagram',
    linkUrl: 'https://youtu.be/sSF_3CIXdbE',
    linkText: 'YouTube',
    tags: 'Android, Deep Links, App Links, Developer Education, Technical Leadership, Web Integration',
    isExternal: true,
  },
  {
    id: 'world-solar-challenge',
    title: 'World Solar Challenge',
    description:
      'As team lead for CalSol, the UC Berkeley Solar Vehicle Team, I led the development of a solar-powered car for the 2011 Veolia World Solar Challenge. This involved managing mechanical, electrical, and business teams to secure funding and build a street-legal vehicle from scratch, which we then raced across the continent of Australia.',
    imagePath: '/i/WorldSolarChallenge.jpg',
    imageAlt: 'World Solar Challenge Sunset',
    linkUrl:
      'https://calsol.berkeley.edu/2011/11/02/wsc-reflections-by-chris-cartland/',
    linkText: 'Blog Post',
    tags: 'Solar Power, Renewable Energy, Electrical Engineering, Embedded Software, Engineering Leadership',
    isExternal: true,
  },
  {
    id: 'smart-garage',
    title: 'Smart Garage Door',
    description:
      "This project involved designing and building a smart garage door system with internet-connected microcontrollers and a companion Android app. The embedded software manages sensors and actuators to control the garage door, while the Android app provides push notifications and remote control - saving us from accidentally leaving the door open and giving us peace of mind when we're away from home.",
    imagePath: '/i/SmartGarageDoor.jpg',
    imageAlt: 'Smart Garage Door Screenshot',
    linkUrl: 'https://github.com/cartland/SmartGarageDoor',
    linkText: 'GitHub',
    tags: 'Kotlin, Compose, Macrobenchmark, CI/CD, TypeScript, IoT, Embedded Systems, Android Development, Home Automation, Microcontrollers, Serverless',
    isExternal: true,
  },
  {
    id: 'marauders-map',
    title: "Marauder's Map",
    description:
      "I built an interactive Marauder's Map for a Halloween party. The animations are drawn with an HTML5 Canvas runs in a WebView in an Android app. The app was deployed on phones, tablets, and Android TV. We added a bit of magic with NFC magic wands that allowed the wizard to wave their wand and see their footsteps appear on the map in their real location.",
    imagePath: '/i/MaraudersMap.gif',
    imageAlt: "Marauder's Map Screenshot",
    linkUrl:
      'https://cartland.medium.com/building-a-marauders-map-6552fa378cda',
    linkText: 'Blog Post',
    tags: 'Interactive Art, Android Development, HTML5 Canvas, React, NFC, Animation, WebView',
    isExternal: true,
  },
  {
    id: 'instant-runoff',
    title: 'Instant Runoff Voting',
    description:
      'I developed a voting system using Google Apps Script and Google Forms that implements Instant Runoff Voting. The system includes features like unique voting keys, vote modification capabilities, and unauthorized vote prevention. I shared this solution through a technical blog post on the Google Developers Blog, making it accessible for other developers to implement similar voting systems.',
    imagePath: '/i/InstantRunoffVoting.jpg',
    imageAlt: 'Instant Runoff Voting Interface',
    linkUrl:
      'https://gsuite-developers.googleblog.com/2012/11/instant-voting-with-apps-script.html',
    linkText: 'Blog Post',
    tags: 'Google Apps Script, JavaScript',
    isExternal: true,
  },
  {
    id: 'autostereogram',
    title: 'Autostereogram Generator',
    description:
      'I wrote software in Go to generate autostereograms (also known as "Magic Eye" images). Starting from first principles and my experience viewing these 3D illusions, I developed a library that creates autostereograms from depth maps and pattern images. The project includes both a command-line tool and a web service hosted on Google App Engine, making it easy for others to create their own 3D illusions.',
    imagePath: '/i/Autostereogram.jpg',
    imageAlt: 'Autostereogram Example',
    linkUrl: 'https://github.com/cartland/imagic',
    linkText: 'GitHub',
    tags: 'Go Programming, Image Processing, Algorithms',
    isExternal: true,
  },
  {
    id: 'computer-history-museum',
    title: 'Computer History Museum',
    description:
      "I shared my computer science journey at the Computer History Museum's Design Code Build series in 2019. The talk focused on inspiring the next generation of technologists by discussing my path from early programming experiences to working on large-scale technology projects that impact millions of users.",
    imagePath: '/i/ComputerHistoryMuseum.jpg',
    imageAlt: 'Computer History Museum Screenshot',
    linkUrl: 'https://youtube.com/watch?v=uS26m1QaEH4',
    linkText: 'YouTube',
    tags: 'Public Speaking, Computer Science Education, Technical Communication',
    isExternal: true,
  },
  {
    id: 'berkeley-alumni',
    title: 'Berkeley Alumni Spotlight',
    description:
      'UC Berkeley Engineering featured me in their alumni spotlight, where I shared my journey from studying AI with Professor Dan Klein to leading developer outreach at Google. I discussed how my experiences at Cal, including racing a solar-powered car across Australia with CalSol, shaped my approach to solving complex technical challenges and working with ambiguous problems.',
    imagePath: '/i/BerkeleyAlumni.jpg',
    imageAlt: 'Berkeley Engineering Alumni Spotlight',
    linkUrl: 'https://engineering.berkeley.edu/christopher-cartland/',
    linkText: 'Berkeley Spotlight',
    tags: 'Public Speaking, Engineering Leadership',
    isExternal: true,
  },
  {
    id: 'templeton-alumni',
    title: 'Templeton Alumni Profile',
    description:
      'My high school invited me to share how my experiences shaped my future career in technology. In this alumni profile, I discuss my introduction to computer science and the environment at Templeton that helped lay the foundation for my journey into software development and my work at Google.',
    imagePath: '/i/TempletonAlumni.jpg',
    imageAlt: 'Templeton Alumni Profile',
    linkUrl: 'https://www.youtube.com/watch?v=_U_oxDDa3x8',
    linkText: 'YouTube',
    tags: 'Public Speaking',
    isExternal: true,
  },
  {
    id: 'global-temperature-visualization',
    title: 'Global Temperature Visualization',
    description:
      'I created an interactive data visualization of global surface temperatures from 1850 to the present. This project uses a large dataset to show monthly temperature anomalies compared to a baseline period, highlighting the long-term warming trend. The visualization is built with modern web technologies to provide an engaging and informative experience about climate change.',
    imagePath: '/i/Temperature.png',
    imageAlt: 'Global Temperature Visualization',
    linkUrl: '/v2/temperature-visualization',
    linkText: 'Visualization',
    tags: 'Data Visualization, Climate Change, Web Development, D3.js, HTML, CSS, JavaScript',
    isExternal: false,
  },
  {
    id: 'utility-vs-solar-battery',
    title: 'Utility vs. Solar + Battery',
    description:
      'An interactive calculator to compare the long-term costs of utility power vs. a solar and battery system. This tool helps you make an informed decision by modeling the costs over a 30-year period, including opportunity costs and other financial assumptions.',
    imagePath: '/i/solar-battery-cost.png',
    imageAlt: 'Utility vs. Solar + Battery Cost Analysis',
    linkUrl: '/v2/utility-vs-solar-battery',
    linkText: 'Calculator',
    tags: 'Financial Modeling, Cost Analysis, Sustainable Technology, Web Development',
    isExternal: false,
  },
  {
    id: 'portfolio',
    title: 'Portfolio Website',
    description:
      'I built this portfolio website using minimal CSS and JavaScript to create a responsive and accessible experience. The site features a clean, modern design that works seamlessly across all devices while maintaining strong accessibility standards. The website is deployed using GitHub Actions and hosted with Firebase Hosting on a custom domain.',
    imagePath: '/i/ChrisCartlandWebsite.jpg',
    imageAlt: 'Portfolio Website Screenshot',
    linkUrl: 'https://github.com/cartland/cartland-dev',
    linkText: 'GitHub',
    tags: 'Web Development, HTML, CSS, JavaScript, CI/CD, Accessibility, Responsive Design',
    isExternal: true,
  },
]
