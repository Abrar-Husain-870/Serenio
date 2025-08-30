import { Chart as ChartJS, Filler } from 'chart.js';

// Apply calm, accessible defaults globally
export function applyCalmChartDefaults() {
  ChartJS.register(Filler);
  ChartJS.defaults.font.family = 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
  ChartJS.defaults.font.size = 13;
  ChartJS.defaults.color = 'rgba(148, 163, 184, 0.9)'; // slate-400/90

  // Elements
  // Rounded line caps, visible points only for data
  ChartJS.defaults.elements.line.borderCapStyle = 'round';
  ChartJS.defaults.elements.line.borderJoinStyle = 'round';
  ChartJS.defaults.elements.line.tension = 0.35;
  ChartJS.defaults.elements.point.radius = 3;
  ChartJS.defaults.elements.point.hoverRadius = 5;

  // Layout
  ChartJS.defaults.datasets.line.borderWidth = 2;
  ChartJS.defaults.plugins.legend.display = false;
  ChartJS.defaults.plugins.tooltip.mode = 'index';
  ChartJS.defaults.plugins.tooltip.intersect = false;
}
