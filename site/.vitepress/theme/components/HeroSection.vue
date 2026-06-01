<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <div class="hero-container">
    <div class="hero-text">
      <h1>Software Engineer and Tech Maker</h1>
      <p class="subtitle">Mobile / Android / Embedded / Serverless</p>
    </div>
    <div class="hero-spacer"></div>
    <div class="hero-img">
      <img
        :src="withBase('/i/GoldenGateBridge.jpg')"
        alt="Golden Gate Bridge"
        loading="lazy"
      />
    </div>
  </div>

  <div class="intro-container">
    <p>
      As an engineer with 12 years of experience with Developer Relations at
      Google, I've built software for Android mobile devices, serverless
      applications, and internet-connected cars and TVs. My focus has been on
      developer APIs that enable professionals to create innovative Android
      experiences.
    </p>

    <p>
      Beyond my work at Google, I'm driven by a passion for sustainable
      technology. In college, I led a team that built a solar-powered car for
      the World Solar Challenge, where we raced a street-legal vehicle across
      Australia.
    </p>

    <p>
      I continue to explore my passion for software by building projects in my
      free time, such as interactive art, and a smart garage door with
      Internet-connected microcontrollers and a companion Android app.
    </p>

    <p>Learn more about some of my <a href="./projects">Projects</a>.</p>
  </div>

  <div class="big-image-container">
    <img
      :src="withBase('/i/CalSolFirstPlaceFormulaSun2017.jpg')"
      alt="CalSol crossing the finish line for first place at Formula Sun Grand Prix 2017"
      loading="lazy"
    />
  </div>

  <div class="social-container">
    <div class="social-header">
      <h2>Find me on the Internet</h2>
    </div>
    <div class="social-items-row">
      <div class="social-item">
        <a
          href="https://www.linkedin.com/in/cartland"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Christopher Cartland's LinkedIn profile"
        >
          <div class="image-gradient-container">
            <img
              :src="withBase('/i/LinkedIn.jpg')"
              alt="LinkedIn"
              loading="lazy"
            />
          </div>
          <p>LinkedIn</p>
        </a>
      </div>
      <div class="social-item">
        <a
          href="https://github.com/cartland"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Christopher Cartland's GitHub profile"
        >
          <div class="image-gradient-container">
            <img :src="withBase('/i/GitHub.jpg')" alt="GitHub" loading="lazy" />
          </div>
          <p>GitHub</p>
        </a>
      </div>
      <div class="social-item">
        <a
          href="https://x.com/LandOfCart"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Christopher Cartland's X profile"
        >
          <div class="image-gradient-container">
            <img :src="withBase('/i/X.jpg')" alt="X" loading="lazy" />
          </div>
          <p>X</p>
        </a>
      </div>
      <div class="social-item">
        <a
          href="https://www.threads.net/@LandOfCart"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Christopher Cartland's Threads profile"
        >
          <div class="image-gradient-container">
            <img
              :src="withBase('/i/Threads.jpg')"
              alt="Threads"
              loading="lazy"
            />
          </div>
          <p>Threads</p>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.hero-text {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  text-align: left;
  min-height: 148px;
}

.hero-text h1 {
  font-weight: normal;
  margin-top: 8px;
  margin-bottom: 8px;
  font-size: 3em;
  border: none;
}

.hero-text .subtitle {
  margin-top: 0;
  margin-bottom: 16px;
}

.hero-spacer {
  height: 16px;
  width: 32px;
}

.hero-img {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
}

.hero-img img {
  border-radius: 32px;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.intro-container {
  margin-top: 16px;
}

.intro-container a {
  color: var(--vp-c-text-2);
}

.big-image-container {
  width: 100%;
}

.big-image-container img {
  width: 100%;
  border-radius: 32px;
  object-fit: cover;
}

.social-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 8px;
  padding-right: 8px;
}

.social-header {
  width: 100%;
  text-align: center;
}

.social-items-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.social-item {
  width: 66px;
}

.social-item img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.social-item a {
  text-decoration: none;
  text-align: center;
  color: var(--vp-c-text-2);
}

.social-item p {
  margin: 2px 0 0 0;
}

.image-gradient-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.image-gradient-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  z-index: 1;
}

.image-gradient-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: relative;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .hero-container {
    flex-direction: column;
    width: 100%;
  }

  .hero-text {
    width: 100%;
  }

  .hero-img {
    width: 100%;
  }

  .hero-img img {
    height: auto;
    object-fit: contain;
  }

  .social-items-row {
    gap: 16px;
    padding: 0 16px;
  }

  .social-item {
    width: 48px;
  }

  .social-item p {
    font-size: 0.7em;
  }
}
</style>
