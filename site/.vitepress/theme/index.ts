import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'
import HeroSection from './components/HeroSection.vue'
import ProjectCard from './components/ProjectCard.vue'
import ProjectGrid from './components/ProjectGrid.vue'
import TemperatureViz from './components/TemperatureViz.vue'
import SolarCalculator from './components/SolarCalculator.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HeroSection', HeroSection)
    app.component('ProjectCard', ProjectCard)
    app.component('ProjectGrid', ProjectGrid)
    app.component('TemperatureViz', TemperatureViz)
    app.component('SolarCalculator', SolarCalculator)
  },
} satisfies Theme
