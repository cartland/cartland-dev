<script setup lang="ts">
import { withBase } from 'vitepress'

const props = defineProps<{
  id: string
  title: string
  description: string
  imagePath: string
  imageAlt: string
  linkUrl: string
  linkText: string
  tags: string
  isExternal: boolean
}>()
</script>

<template>
  <div class="card" :id="id">
    <div class="image-gradient-container">
      <img :src="withBase(imagePath)" :alt="imageAlt" loading="lazy" />
    </div>
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <a
      :href="isExternal ? linkUrl : withBase(linkUrl)"
      :target="isExternal ? '_blank' : undefined"
      :rel="isExternal ? 'noopener noreferrer' : undefined"
      :aria-label="`${linkText} - ${title}`"
      class="project-link"
      >{{ linkText }}</a
    >
    <div class="tags">{{ tags }}</div>
  </div>
</template>

<style scoped>
.card {
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  margin-bottom: 32px;
  transition: background-color 0.3s ease;
  padding: 16px;
}

.card:target {
  position: relative;
}

.card:target::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 48px;
  z-index: -1;
}

.image-gradient-container {
  position: relative;
  border-radius: 32px;
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
}

.card img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 32px;
  object-fit: cover;
  display: block;
  margin: 0 auto 0;
}

.card h2 {
  margin-top: 8px;
  margin-bottom: 8px;
  font-size: 1.2em;
  border: none;
}

.card p {
  margin-top: 0;
  margin-bottom: 12px;
}

.project-link {
  margin-top: auto;
  display: inline-block;
  padding: 16px;
  text-decoration: none;
  border: 1px solid var(--vp-c-text-2);
  border-radius: 32px;
  text-align: center;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.project-link:hover {
  opacity: 0.8;
}

.tags {
  font-size: 0.5em;
  color: var(--vp-c-text-2);
  margin-top: 8px;
  padding-left: 18px;
  padding-right: 18px;
}

@media print {
  .card {
    page-break-inside: avoid;
    break-inside: avoid;
    width: 100%;
    margin-bottom: 20px;
    padding: 10px;
  }

  .card img {
    max-height: 120px;
    width: auto;
  }

  .card h2 {
    font-size: 10pt;
    margin: 4px 0;
  }

  .card p {
    font-size: 8pt;
    margin: 4px 0;
  }

  .project-link {
    padding: 4px 8px;
    font-size: 7pt;
  }

  .project-link::after {
    content: '\A(' attr(href) ')';
  }

  .tags {
    font-size: 6pt;
  }
}
</style>
