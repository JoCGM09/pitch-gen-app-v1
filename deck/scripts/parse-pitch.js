import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../../pitch.md');
const outputPath = path.resolve(__dirname, '../src/data/slides.json');

function parsePitch() {
  const markdown = fs.readFileSync(inputPath, 'utf-8');

  const notesRegex = /<!-- notes:\s*([\s\S]*?)\s*-->/g;
  const triggerRegex = /<!-- trigger:\s*(.*?)\s*-->/g;
  const layoutRegex = /<!-- layout:\s*(.*?)\s*-->/g;
  const subtitleRegex = /<!-- subtitle:\s*(.*?)\s*-->/g;
  const badgeRegex = /<!-- badge:\s*(.*?)\s*-->/g;

  // Split por slide '---'
  const slideBlocks = markdown.split(/\n---\n/);

  const slides = slideBlocks.map((block, slideIndex) => {
    let rawContent = block.trim();
    if (!rawContent) return null;

    let interactionTrigger = undefined;
    let notes = undefined;
    let layout = 'cards';
    let subtitle = undefined;
    let badge = undefined;

    // Extraer layout
    const layoutMatch = layoutRegex.exec(rawContent);
    if (layoutMatch) {
      layout = layoutMatch[1].trim();
      rawContent = rawContent.replace(layoutRegex, '');
    }
    layoutRegex.lastIndex = 0;

    // Extraer subtitle
    const subtitleMatch = subtitleRegex.exec(rawContent);
    if (subtitleMatch) {
      subtitle = subtitleMatch[1].trim();
      rawContent = rawContent.replace(subtitleRegex, '');
    }
    subtitleRegex.lastIndex = 0;

    // Extraer badge
    const badgeMatch = badgeRegex.exec(rawContent);
    if (badgeMatch) {
      badge = badgeMatch[1].trim();
      rawContent = rawContent.replace(badgeRegex, '');
    }
    badgeRegex.lastIndex = 0;

    // Extraer trigger
    const triggerMatch = triggerRegex.exec(rawContent);
    if (triggerMatch) {
      interactionTrigger = triggerMatch[1].trim();
      rawContent = rawContent.replace(triggerRegex, '');
    }
    triggerRegex.lastIndex = 0;

    // Extraer notas
    const notesMatch = notesRegex.exec(rawContent);
    if (notesMatch) {
      notes = marked.parse(notesMatch[1].trim());
      rawContent = rawContent.replace(notesRegex, '');
    }
    notesRegex.lastIndex = 0;

    // Extraer título (# Header)
    const titleMatch = rawContent.match(/^#\s+(.*)$/m);
    const title = titleMatch ? titleMatch[1].trim() : `Slide ${slideIndex + 1}`;

    // Remover la linea del titulo del rawContent para el contenido base
    let baseRaw = rawContent.replace(/^#\s+.*$/m, '').trim();
    // Limpiar '--' inicial si existe
    baseRaw = baseRaw.replace(/^--\s*[\r\n]+/, '').trim();

    // Separar content base y steps con '--'
    let parts = baseRaw.split(/\n--\n/).map(p => p.trim()).filter(Boolean);
    
    let baseContentHtml = '';
    let stepParts = [];

    if (parts.length > 0 && parts[0].startsWith('### ')) {
      // Todas las partes son steps
      stepParts = parts;
    } else if (parts.length > 0) {
      baseContentHtml = marked.parse(parts[0]);
      baseContentHtml = baseContentHtml.replace(/<p>/g, '<p class="text-lg text-slate-300 leading-relaxed mb-4">');
      baseContentHtml = baseContentHtml.replace(/<strong>/g, '<strong class="font-bold text-blue-400">');
      baseContentHtml = baseContentHtml.replace(/<blockquote>/g, '<blockquote class="glass-card p-6 border-l-4 border-l-blue-500 my-6 text-slate-200 italic font-medium">');
      stepParts = parts.slice(1);
    }

    const steps = stepParts.map((stepMarkdown, stepIndex) => {
      const rawStep = stepMarkdown.trim();
      
      // Extraer h3 título del step si existe
      const stepTitleMatch = rawStep.match(/^###\s+(.*)$/m);
      const stepTitle = stepTitleMatch ? stepTitleMatch[1].trim() : `Paso ${stepIndex + 1}`;
      
      let stepBodyMarkdown = rawStep.replace(/^###\s+.*$/m, '').trim();
      let stepBodyHtml = marked.parse(stepBodyMarkdown);
      stepBodyHtml = stepBodyHtml.replace(/<p>/g, '<p class="text-slate-300 text-sm md:text-base leading-relaxed">');
      stepBodyHtml = stepBodyHtml.replace(/<strong>/g, '<strong class="font-bold text-blue-400">');

      return {
        id: `slide-${slideIndex}-step-${stepIndex}`,
        title: stepTitle,
        content: stepBodyHtml,
        rawMarkdown: stepBodyMarkdown
      };
    });

    return {
      id: `slide-${slideIndex}`,
      title,
      layout,
      ...(subtitle && { subtitle }),
      ...(badge && { badge }),
      content: baseContentHtml,
      ...(steps.length > 0 && { steps }),
      ...(interactionTrigger && { interactionTrigger }),
      ...(notes && { notes })
    };
  }).filter(Boolean);

  fs.writeFileSync(outputPath, JSON.stringify(slides, null, 2), 'utf-8');
  console.log(`[Parser] Procesado ${slides.length} slides de pitch.md -> slides.json`);
}

parsePitch();
