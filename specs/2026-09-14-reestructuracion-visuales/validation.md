# Validation — Reestructuración Visual y de Contenido

## Criterios de Aceptación
- [ ] La presentación muestra fuentes tipográficas modernas de calidad profesional (`Plus Jakarta Sans` / `Inter` / `JetBrains Mono`).
- [ ] Cada slide tiene un diseño estructurado y adaptado a su tipo (Hero con bio, Tarjetas en Grid 3 columnas, Tarjetas de Conceptos con analogías, Diagrama de Arquitectura AWS interactivo).
- [ ] El diagrama de arquitectura AWS incluye los 4 pasos claramente diferenciados con animación de flujo, badges de servicio y panel de detalles técnicos.
- [ ] El header de la diapositiva indica el estado de la presentación e informa si un Poll/Trigger está activo.
- [ ] El footer muestra una barra de progreso suave, el número de slide actual y los controles disponibles.
- [ ] La navegación offline con clic, teclado y clicker sigue funcionando con cero latencia.
- [ ] `npm run build` en `deck` pasa sin ningún error de TypeScript ni sintaxis.

## Cómo probarlo manualmente
1. Ejecutar `npm run parse` en `deck` para regenerar `slides.json`.
2. Ejecutar `npm run dev` en `deck` y abrir `http://localhost:5173`.
3. Navegar por todas las diapositivas con teclado (Flecha derecha / Espacio / Clic) probando los pasos internos.
4. Verificar la fluidez del diagrama AWS en la Slide 5 y el panel de detalles de `amazon_datazone_api`.
