# Requerimientos: Diagrama AWS Exacto y Servicios de AWS Separados

## 1. Alcance
1. **Servicios de AWS Separados e Individualizados:**
   - Separar cada servicio de AWS en tarjetas/fichas independientes con detalle técnico profundo (Qué hace, Por qué se usa, Snippet de configuración o Comando CLI):
     1. Amazon EventBridge Scheduler
     2. AWS Step Functions
     3. Amazon ECS en AWS Fargate
     4. `dbt-ol` (OpenLineage Wrapper)
     5. Amazon Athena (`dbt-athena`)
     6. Amazon S3 con Apache Iceberg
     7. AWS Glue Data Catalog
     8. Amazon DataZone API (`amazon_datazone_api`)
     9. Amazon SageMaker Unified Studio
2. **Diagrama Fiel a la Arquitectura Oficial de AWS:**
   - Reestructurar el mapa SVG en `AwsArchitectureDiagram.vue` para replicar exactamente el diagrama del blog post oficial de AWS:
     - EventBridge Scheduler $\rightarrow$ Step Functions (`ecs:runTask.sync`) $\rightarrow$ ECS Fargate (`dbt-ol`).
     - ECS Fargate $\rightarrow$ Athena $\rightarrow$ S3 (Iceberg) y Glue Data Catalog.
     - ECS Fargate (`dbt-ol`) $\rightarrow$ Transporte nativo SigV4 $\rightarrow$ API `PostLineageEvent` de Amazon DataZone.
     - Glue Catalog $\rightarrow$ Importación de Activos $\rightarrow$ SageMaker Unified Studio (Grafo a nivel de columna).
3. **Navegación Interactiva por Servicio:**
   - En el diagrama de arquitectura, permitir seleccionar/recorrer cada nodo de servicio de manera individual para inspeccionar sus características exclusivas.

## 2. Decisiones Tomadas
* **Cero Servicios Agrupados:** No combinar EventBridge con Step Functions ni Athena con S3 en una sola caja; cada servicio tendrá su caja y tarjeta propia en la presentación y el diagrama.
