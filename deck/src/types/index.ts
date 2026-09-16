export interface SlideStep {
  id: string;
  title?: string;
  content: string; // Puede ser HTML o texto para renderizar
  rawMarkdown?: string;
}

export interface Slide {
  id: string;
  title?: string;
  layout?: 'hero' | 'cards' | 'concepts' | 'architecture' | 'highlight' | 'action' | string;
  subtitle?: string;
  badge?: string;
  content: string; // Contenido base de la slide
  steps?: SlideStep[]; // Fragments que van apareciendo
  interactionTrigger?: string; // ID para disparar evento en el server (Fase 3)
  notes?: string; // Notas del presentador
}
