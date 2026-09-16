# Requirements — Pulido, Q&A Directo y Deploy

<!-- Generado/actualizado por /feature -->

## Alcance
- Gestión de Q&A directo desde la vista del proyector (sin panel lateral), permitiendo al presentador borrar preguntas respondidas haciendo clic en ellas (requiere `VITE_PRESENTER_SECRET`).
- Preparación del código backend (`server/`) para despliegue en Render (archivos `render.yaml`, scripts de build).
- Preparación del código frontend (`deck/`) para inyectar variables de entorno de producción.
- Soporte para exportación estática a PDF del deck completo utilizando estilos CSS para impresión (`@media print`).

## Fuera de alcance
- Uso de la API de Presentation nativa del navegador.
- Exportación del deck a un archivo PPTX o a múltiples imágenes exportadas individualmente (sólo soporte PDF vía print).
- Control remoto del deck desde el móvil u otros dispositivos (solo control desde el teclado/clicker físico conectado a la laptop).
- Analytics históricos de las preguntas y polls tras cerrar la sesión.
- Panel de presentador lateral o ventana de notas separada (descartado para simplificar la UX).

## Decisiones tomadas
- **Q&A Directo:** Las preguntas se muestran en la slide final de Q&A y se pueden borrar directamente desde ahí si el host está validado con la clave secreta.
- **Sincronización:** Basada enteramente en el `sessionState` de Socket.io existente.
- **Fallback:** Uso de CSS `@media print` para asegurar que el navegador imprima correctamente la presentación en formato PDF.
- **Deploy Backend:** Render.com como Web Service (Docker o nativo Node).
- **Deploy Frontend:** Vercel o Netlify para archivos estáticos (SPA Vue).

## Contexto relevante
- El objetivo es tener la aplicación en vivo. Las pruebas locales fueron exitosas y la sincronización funciona.
- El repositorio se divide en dos proyectos (deck y server).

## Consideraciones de seguridad de esta feature
- Asegurar que el estado "borrar" de las preguntas solo pueda ser gestionado si el socket tiene el secreto (`VITE_PRESENTER_SECRET`) validado.
- Configurar correctamente CORS en producción en `server/src/index.ts` usando la URL final del frontend desplegado.
