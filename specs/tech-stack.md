# Stack Tecnológico

<!-- Generado/actualizado por /constitution -->

## Stack Seleccionado
| Capa         | Elección | Justificación |
|--------------|--------|-----------|
| Frontend     | Vue (SPA) | Liviano, sin overhead de SSR (como Next.js), ideal para un motor standalone enfocado en animaciones y control de DOM local. |
| Animaciones  | CSS Transitions | Suficiente para la mayoría de revelados (fade, slide). Si es necesario, integración con Motion One para animaciones más complejas del guion. |
| Backend Realtime | Node.js + Socket.io | Estándar y robusto para sincronización de estado bi-direccional entre el presentador y la audiencia móvil. Estado gestionado 100% en memoria en el servidor, priorizando baja latencia y simplicidad de despliegue sobre persistencia. |
| Base de datos| N/A | Se ha decidido descartar Supabase y bases de datos persistentes a favor de memoria pura (`Map` en Node) para cumplir a cabalidad con la regla de datos efímeros y simplicidad. |
| Hosting/CI   | Vercel (Front) / Render o Railway (Node) | Permite despliegue rápido del front-end Vue en Vercel. El servidor de Socket.io puro debe ir en un contenedor/servicio persistente como Render o Railway. |
| Diagramas    | Mermaid.js / SVG | Ideal para arquitecturas técnicas y control por pasos ("capas") narrativas. |

## Alternativas Descartadas
- **Next.js / SSR:** Añade complejidad y latencia innecesaria; el deck debe ser proyector-first, 100% offline-capaz en su núcleo visual, y no requiere SEO.
- **Slidev / reveal.js:** Descartados por requerimiento de la misión. Se necesita control absoluto del loop de navegación para atarlo al disparo automático de encuestas.
- **Base de datos persistente (SQL tradicional):** No se mantendrá histórico ni analítica de los polls post-evento. Los datos son efímeros. El uso de Supabase se restringe a canal de estado en tiempo real.

## Estándares Técnicos, Buenas Prácticas y Seguridad
- **Tolerancia a fallos de red:** La aplicación Vue (Deck del presentador) debe atrapar errores del socket y permitir seguir navegando la presentación de forma local, ignorando los features de audiencia.
- **Seguridad / Anti-abuso:** Implementar rate-limiting o debounce en el Q&A de la audiencia.
- **Modo Pantalla Completa:** Requerido para la experiencia de proyección en la capa del presentador.
- **URLs por Slide:** Implementar deep-linking (`/deck/:slide/:step`) usando Vue Router para facilitar ensayos.