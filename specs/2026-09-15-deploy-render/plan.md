# Plan — Pulido, Q&A Directo y Deploy

## 1. Limpieza de Panel y Gestión Q&A Directa
- [x] Eliminar el componente `PresenterPanel.vue` y sus referencias en `DeckView.vue`.
- [x] Asegurar que el botón de eliminar pregunta ('✕') en la vista `qa-view` sea siempre visible (no solo en hover) para facilitar su uso durante la proyección.
- [x] Verificar que la función `handleRemoveQA` emite el evento al servidor con el secreto activo y la pregunta desaparece para todos.

## 2. Preparación para Deploy en Render (Backend)
- [x] Crear el archivo `render.yaml` en la raíz del proyecto para definir el servicio Node.js (servidor de websockets).
- [x] Configurar los scripts de `package.json` en el backend para la instalación y ejecución segura en producción (`npm run build`, `npm start`).

## 3. Estilos de Impresión y Pulido
- [x] Añadir bloque `@media print` en la hoja de estilos global (`style.css`).
- [x] Configurar el CSS de impresión para ocultar la UI y forzar que cada slide ocupe un `page-break` completo, utilizando un layout lineal vertical.

## 4. Deploy Frontend y Verificación Final
- [x] Preparar configuración para despliegue del frontend (Deck y app de Audiencia).
- [x] Asegurarse de que `VITE_WS_URL` de producción se pueda inyectar correctamente en el frontend.