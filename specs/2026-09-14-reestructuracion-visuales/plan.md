# Plan — Diagrama AWS Fiel y Servicios Separados

## 1. Desglose Individual de Servicios AWS en `pitch.md` y Layouts
- [ ] Separar las diapositivas de servicios AWS para presentar individualmente EventBridge, Step Functions, Fargate, `dbt-ol`, Athena, Iceberg/S3, Glue Catalog, DataZone API y SageMaker Studio.
- [ ] Actualizar `parse-pitch.js` para compilar los nuevos bloques.

## 2. Rediseño Fiel del Diagrama SVG en `AwsArchitectureDiagram.vue`
- [ ] Reestructurar el SVG para incluir las cajas y conectores exactos del diagrama oficial de AWS.
- [ ] Implementar la selección/recorrido individualizado de los 9 nodos con fichas técnicas separadas ("Propósito del Servicio" + "Por qué en AWS" + "Configuración / Código").

## 3. Integración en `DeckView.vue` y Verificación
- [ ] Actualizar `DeckView.vue` con soporte de renderizado para los servicios separados.
- [ ] Ejecutar `node scripts/parse-pitch.js`.
- [ ] Correr `vitest` y `vue-tsc -b && vite build` en `deck`.
