# Pitch Gen: Motor de Presentación Web a Medida con Interacción Sincronizada

Un motor de presentación web diseñado desde cero para unificar la experiencia del presentador en la pantalla grande y la interacción de la audiencia en sus dispositivos móviles. 

A diferencia de soluciones tradicionales o librerías genéricas (como Slidev o reveal.js), este motor está construido a medida para permitir que el **avance de una diapositiva dispare automáticamente interacciones en tiempo real** (polls, preguntas) en el teléfono del público, manteniendo el control total del ciclo de navegación.

## Características Principales

### Para el Presentador (Desktop-first / Proyector)
- **Navegación Unificada:** Soporta teclado (flechas, espacio, PageUp/PageDown), clic de mouse y puntero/clicker físico. Un solo input controla toda la experiencia.
- **Pasos Internos (Fragments):** Soporte completo para revelar contenido por partes dentro de la misma diapositiva, simulando los "builds" de Keynote o PowerPoint.
- **Tolerancia a Fallo Cero (Offline-first):** El motor principal de diapositivas corre 100% en local en el navegador. Si el servidor de tiempo real falla o el WiFi del evento cae, la presentación continúa sin interrupciones.
- **Diagramas Declarativos:** Integración nativa con Mermaid.js y SVG a medida para revelar diagramas de arquitectura por capas narrativas.
- **Deep-Linking:** Cada diapositiva y paso interno tiene una URL única (`/deck/12/2`) para facilitar ensayos y saltos directos.

### Para la Audiencia (Móvil)
- **Cero Fricción Visual:** La audiencia no ve las diapositivas en su teléfono. Solo interactúan cuando el presentador llega a un punto de interacción.
- **Interacciones Sincronizadas:**
  - Encuestas binarias (Apertura).
  - Checks de pulso de opción múltiple (Mitad de charla).
  - Votaciones finales.
  - Q&A (Preguntas y respuestas abiertas) disponible en todo momento.
- **Apuntes Generados:** Al finalizar la sesión, los usuarios pueden llevarse un resumen progresivo de los puntos clave dictados en la teoría.

## Arquitectura y Stack Tecnológico

El sistema se basa en "Dos superficies, un servidor", operando de manera efímera para preservar la privacidad y reducir costos de infraestructura.

- **Frontend (Deck + App de Audiencia):** SPA en **Vue** + **TypeScript** + **Tailwind CSS**. Prioriza una carga rápida y transiciones CSS nativas ligeras, descartando SSR (Next.js) por no ser necesario.
- **Backend (Tiempo Real):** **Node.js** + **Socket.io**.
- **Base de Datos:** Ninguna. Se gestiona un **estado 100% en memoria** o Redis. Los datos de la audiencia y resultados son completamente efímeros.

## Desarrollo e Instalación

*(Instrucciones estándar para inicializar el proyecto Vue + Node.js)*

```bash
# 1. Clonar el repositorio
git clone <url-del-repo> pitch-gen
cd pitch-gen

# 2. Instalar dependencias
npm install

# 3. Levantar los servidores en modo desarrollo
npm run dev
```

> **Nota para IAs/Agentes:** Este proyecto sigue un flujo de desarrollo estricto basado en Documentación de Diseño de Software (SDD). Revisa siempre el archivo `AGENTS.md` y la carpeta `specs/` (`mission.md`, `tech-stack.md`) antes de proponer código o arquitectura nueva. No se deben crear archivos sin un `plan.md` aprobado.

## Gestión de Contenidos

El contenido fuente de las diapositivas (la *spec* de contenido) se define en el archivo `pitch.md` (o se genera a partir de la carpeta `/fuentes`). El motor mapea los puntos clave e `interactionTriggers` definidos en dicho guion directamente a la presentación en vivo.
