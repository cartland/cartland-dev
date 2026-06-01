<script setup lang="ts">
import ProjectCard from './ProjectCard.vue'
import { projects } from '../data/projects'
</script>

<template>
  <div class="project-grid-wrapper">
    <div class="section-header">
      <p>
        Here are some of my key projects, spanning from large-scale Google
        initiatives like Google TV and COVID-19 Exposure Notifications to
        innovative personal projects in sustainable technology and interactive
        art. These projects showcase my expertise in developer platforms,
        embedded systems, and creative technology solutions.
      </p>
    </div>

    <nav class="toc-container" aria-label="Table of contents">
      <a
        v-for="project in projects"
        :key="project.id"
        :href="`#${project.id}`"
        class="toc"
        >{{ project.title }}</a
      >
    </nav>

    <div class="project-grid">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :id="project.id"
        :title="project.title"
        :description="project.description"
        :image-path="project.imagePath"
        :image-alt="project.imageAlt"
        :link-url="project.linkUrl"
        :link-text="project.linkText"
        :tags="project.tags"
        :is-external="project.isExternal"
      />
    </div>
  </div>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  gap: 0;
}

.section-header {
  margin-bottom: 16px;
}

.toc-container {
  display: flex;
  flex-wrap: wrap;
}

.toc {
  padding-left: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-top: 4px;
  margin-bottom: 4px;
  break-inside: avoid;
  text-decoration: none;
  color: var(--vp-c-text-2);
}

.toc:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}

@media print {
  .project-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  body {
    font-size: 8pt;
  }
}
</style>
