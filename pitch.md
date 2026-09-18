---
<!-- layout: hero -->
<!-- badge: CHARLA TÉCNICA • ARQUITECTURA DE DATOS E IA -->
<!-- subtitle: El problema oculto de trazabilidad y gobernanza en agentes autónomos -->
# Cuando la IA no sabe de dónde vienen sus datos

---
<!-- layout: hero -->
<!-- trigger: poll-apertura -->
<!-- badge: SONDEO EN VIVO -->
<!-- subtitle: Participa desde tu teléfono celular -->
# Pregunta de Apertura

> Si tu agente de IA o chatbot da una respuesta errónea en producción, ¿cuánto tiempo te tomaría encontrar exactamente qué dato, qué transformación o qué modelo generó ese resultado?

<!-- notes:
Antes de profundizar, quiero hacerles una pregunta simple.

Si ese agente les da una respuesta rara — un número que no cuadra, una recomendación que no tiene sentido — ¿cuánto tiempo les tomaría encontrar exactamente qué dato, qué transformación, qué modelo generó ese resultado?

Por favor, respondan en la pantalla de sus teléfonos.
-->

---
<!-- layout: spotlight -->
<!-- subtitle: Tres pilares fundamentales para dar contexto de negocio real a los modelos de lenguaje -->
# ¿Por qué conectar un agente a un Data Warehouse o Data Lake?

--
### Contexto en tiempo real
Los LLMs tienen fecha de corte. El negocio cambia cada minuto y requiere fuentes vivas sin alucinaciones.

--
### Acción, no solo conversación
Un agente no solo responde preguntas: ejecuta consultas, genera reportes y dispara acciones en sistemas core.

--
### Escala & Procesamiento
Capacidad de procesar millones de registros de transacciones y detectar patrones anómalos en cuestión de segundos.

<!-- notes:
Antes de hablar del dolor, quiero asegurarme de que todos partimos del mismo punto: ¿por qué querríamos conectar un agente de IA directamente a un data warehouse o a un data lake, en primer lugar?

Un modelo de lenguaje, por sí solo —el motor detrás de un agente— no sabe nada de su empresa. Sabe lenguaje, sabe patrones generales del mundo, pero no sabe cuántas unidades vendieron ayer en la región norte, ni qué cliente está a punto de cancelar su contrato. Esa información vive en un solo lugar: sus sistemas de datos.

Un **data warehouse** es como una bodega organizada: los datos ya llegaron limpios, estructurados, en tablas con un propósito claro. Un **data lake** es como un almacén general: guarda datos en su forma más cruda.

¿Por qué conectar un agente ahí? Por tres razones: contexto en tiempo real, acción concreta y escala para procesar volúmenes masivos.
-->

---
<!-- layout: risk-cards -->
<!-- trigger: poll-pulso -->
<!-- subtitle: La desaparición del "humano en el medio" y la ejecución autónoma en cascada -->
# El Dolor: Por qué la IA cambió las reglas del juego

--
### 1. Velocidad Absoluta
De horas de investigación humana a milisegundos de ejecución automática. Se elimina la ventana manual para pausar antes del impacto.

--
### 2. Propagación en Cascada
Sistemas multiagente donde un dato contaminado se propaga por toda la cadena, dificultando rastrear el origen inicial.

--
### 3. Opacidad & Alta Confianza
Lenguaje fluido y seguro que enmascara tablas upstream corruptas o filtros incorrectos aplicados semanas atrás.

<!-- notes:
Durante años, cuando un dashboard mostraba un número mal, un humano investigaba el SQL. Con agentes autónomos, ese humano en el medio está desapareciendo.

Si un agente consulta una tabla con un filtro mal puesto desde hace 2 semanas, disparará órdenes de compra reales a proveedores reales en segundos. Un agente no duda: ejecuta.
-->

---
<!-- layout: dbt-dag -->
<!-- subtitle: Concepto 1 — Prácticas de ingeniería de software aplicadas a transformaciones SQL -->
# 1. dbt (data build tool) & Grafos DAG

--
### Modelos Staging Limpios
Transformaciones base que limpian tipos de datos y filtran registros inválidos desde fuentes crudas.

--
### Modelos Mart Auditables
Tablas unificadas para negocio (fct_sales, dim_customers) listas para consumo de reportes y agentes de IA.

<!-- notes:
dbt es como un ingeniero de software, pero para SQL. Organiza consultas en un DAG (Grafo Dirigido Acíclico), donde cada modelo declara de qué otras tablas depende.
-->

---
<!-- layout: comparison -->
<!-- subtitle: Concepto 2 — Aclarando dos términos clave para evitar confusiones en la charla -->
# 2. Modelos dbt vs Modelos de IA

--
### Modelo dbt (Receta SQL)
Un archivo `.sql` con una consulta SELECT determinística. Define cómo se construye una tabla o vista a partir de otras.

--
### Modelo de IA (Cerebro Estadístico)
El modelo de lenguaje (LLM) que razona, comprende el lenguaje natural y toma decisiones autónomas.

<!-- notes:
No hay que confundirlos: un modelo dbt es una receta SQL escrita (.sql). Un modelo de IA es el cerebro estadístico. El modelo de IA consulta el resultado del modelo dbt.
-->

---
<!-- layout: agent-catalog -->
<!-- subtitle: Concepto 3 — El índice centralizado que guía la navegación de los agentes autónomos -->
# 3. El Catálogo de Datos como Mapa de IA

--
### 1. Prompt de Negocio
El usuario pide al agente: "¿Cuáles fueron las ventas en la Región Norte este mes?"

--
### 2. Consulta al Catálogo
El Agente no adivina: consulta la API del Catálogo de Datos para leer esquemas y descripciones.

--
### 3. Compilación SQL Verificada
Con las columnas y tipos de datos del catálogo, el agente genera la consulta SELECT correcta.

--
### 4. Ejecución Auditable
Ejecuta la consulta y entrega el resultado adjuntando el ID del modelo fuente auditado.

<!-- notes:
El catálogo de datos es el índice de la biblioteca. Los agentes de IA modernos usan el catálogo como su mapa de navegación. Sin catálogo, el agente navega a ciegas.
-->

---
<!-- layout: lineage-tree -->
<!-- subtitle: Concepto 4 — Rastrear el origen, transformaciones y destinos downstream -->
# 4. Linaje de Datos: El Árbol Genealógico del Dato

--
### 1. Origen Upstream (Fuentes Crudas)
Identificación exacta de la tabla o archivo crudo de donde provinieron los datos originales.

--
### 2. Transformaciones Intermedias (Modelos SQL)
Registro de cada modelo SQL intermedio que filtró, unió o modificó la información.

--
### 3. Destinos Downstream (Agentes & Dashboards)
Catálogo de dashboards, modelos de ML y agentes de IA que consumen el resultado final.

<!-- notes:
El linaje de datos es el árbol genealógico de un dato. Si un valor está mal calculado, el linaje permite hallar el filtro corrupto en minutos, no en semanas.
-->

---
<!-- layout: standard-cards -->
<!-- subtitle: Concepto 5 — Estándar abierto para la captura de metadatos en tiempo de ejecución -->
# 5. OpenLineage: Estándar Abierto

--
### Eventos en Tiempo Real
Emisión automática de eventos START, COMPLETE y FAIL por cada modelo ejecutado.

--
### Mapeo Columna a Columna
Captura el flujo detallado de cómo cada columna específica se derivó de tablas anteriores.

--
### Integración Agnóstica
Funciona igual para dbt, Airflow y Spark, comunicándose con cualquier catálogo vía API estándar.

<!-- notes:
OpenLineage es el idioma común. Permite que cualquier herramienta hable linaje con cualquier catálogo sin estar atados a un único proveedor cerrado.
-->

---
<!-- layout: impact-grid -->
<!-- subtitle: Tres riesgos críticos para el escalamiento de la Inteligencia Artificial -->
# El Costo Real de No Tener Esto

--
### 1. Respuestas Seguras pero Equivocadas
Modelos alimentados por tablas obsoletas con documentación estática en Confluence desactualizada hace meses.

--
### 2. Imposibilidad de Auditoría en Compliance
Sectores regulados (salud, finanzas) incapaces de demostrar el origen de una decisión automatizada ante auditores.

--
### 3. Pérdida de Confianza Organizacional
Un solo error no explicable por falta de linaje destruye permanentemente la adopción interna de IA.

<!-- notes:
Antes de invertir en más agentes, la pregunta fundamental es: ¿tenemos trazabilidad automática de nuestros datos? Sin linaje, cada agente nuevo es un riesgo no auditable.
-->

---
<!-- layout: aws-building-block-1 -->
<!-- subtitle: Llevando los conceptos teóricos a componentes serverless individuales en AWS -->
# Bloques de Construcción AWS (I): Orquestación & Cómputo

--
### 1. Amazon EventBridge Scheduler
Disparador programado (cron) de cero servidores en reposo. Gatilla la ejecución según horario o evento S3.

--
### 2. AWS Step Functions
Orquestador de máquina de estados con integración nativa `ecs:runTask.sync` y reintentos con backoff exponencial.

--
### 3. Amazon ECS en AWS Fargate
Cómputo serverless de contenedores con asignación efímera de CPU/RAM pagando sólo por segundos usados.

--
### 4. `dbt-ol` (OpenLineage Wrapper)
Contenedor que ejecuta las recetas SQL e intercepta cada modelo generando eventos de linaje en tiempo real.

<!-- notes:
Presentamos por separado cada servicio de AWS para orquestación y cómputo: EventBridge Scheduler, Step Functions, ECS Fargate y dbt-ol.
-->

---
<!-- layout: aws-building-block-2 -->
<!-- subtitle: Procesamiento SQL columnar, catálogo unificado y transmisión nativa de linaje -->
# Bloques de Construcción AWS (II): Motor, Storage & Gobernanza

--
### 5. Amazon Athena (dbt-athena)
Motor de consultas SQL serverless con procesamiento paralelo pagando sólo por bytes escaneados.

--
### 6. Amazon S3 (Apache Iceberg)
Almacenamiento columnar Parquet con soporte Apache Iceberg para transacciones ACID y time travel.

--
### 7. AWS Glue Data Catalog
Registro centralizado de metadatos de tablas y particiones utilizado por Athena y SageMaker.

--
### 8. Amazon DataZone API (`amazon_datazone_api`)
Transporte nativo directo SigV4 a la API `PostLineageEvent` sin Lambdas, SQS o proxies intermedios.

--
### 9. Amazon SageMaker Unified Studio
Visualizador gráfico interactivo que correlaciona los eventos y grafica el linaje a nivel de columna.

<!-- notes:
Presentamos por separado cada servicio para motor, storage y gobernanza: Athena, S3 Iceberg, Glue Catalog, DataZone API y SageMaker Studio.
-->

---
<!-- layout: architecture -->
<!-- subtitle: Diagrama integrador exactamente fiel a la arquitectura de referencia oficial de AWS -->
# Arquitectura Serverless Integrada en AWS

<AwsArchitectureDiagram />

--
### 1. Orquestación Serverless (EventBridge + Step Functions)
Gatilla la ejecución e invoca ECS Fargate mediante `ecs:runTask.sync`.

--
### 2. Cómputo & Transformación (Fargate + dbt-ol)
Ejecuta `dbt-ol` y envía consultas SQL a Athena mientras captura eventos OpenLineage.

--
### 3. Almacenamiento ACID & Catálogo (Athena + S3 Iceberg + Glue)
Athena procesa SQL, persiste tablas Iceberg en S3 y registra esquemas en Glue.

--
### 4. Transmisión Directa de Linaje (DataZone + SageMaker Studio)
Transporte `amazon_datazone_api` publica directo a DataZone y SageMaker dibuja el grafo a nivel de columna.

<!-- notes:
Aquí vemos la arquitectura serverless completa en acción. Cero infraestructura que administrar, linaje automático en cada ejecución y costo proporcional al uso real.
-->

---
<!-- layout: highlight -->
<!-- subtitle: Convertir la trazabilidad pasiva en gobernanza proactiva para agentes autónomos -->
# Cerrando el Círculo: De vuelta a la IA

--
### Detección Inmediata de Incidentes
Un modelo o filtro SQL modificado en las últimas 24 horas es rastreable visualmente en segundos en lugar de semanas.

--
### Nivel de Confianza Dinámico para Agentes
Agentes autónomos consultando el linaje vía API antes de actuar: si la fuente no es verificada, solicita confirmación humana.

--
### La Misma Pregunta Fundamental
Tanto para compliance como para la propia IA antes de actuar: *"¿De dónde viene este dato y puedo confiar en él?"*

<!-- notes:
Un catálogo con linaje automático permite gobernanza proactiva para agentes. El agente puede evaluar si la fuente es confiable antes de tomar una acción.
-->

---
<!-- layout: action -->
<!-- trigger: poll-cierre -->
<!-- subtitle: Tres pasos concretos para acelerar la adopción segura de IA -->
# Cierre y Llamado a la Acción

--
### 1. Desplegar un Piloto Pequeño
Comenzar con los 10 modelos dbt que alimentan los casos de uso de IA más críticos de la organización.

--
### 2. Auditar Trazabilidad antes de sumar Agentes
Evaluar la capacidad de reconstruir el origen de los datos antes de conceder autonomía a nuevos modelos LLM.

--
### 3. Conectar Linaje con Gobernanza Unificada
Democratizar la visualización del grafo de dependencias entre ingeniería, negocio y cumplimiento regulatorio.

<!-- notes:
Tres pasos: piloto pequeño, auditar trazabilidad antes de sumar más agentes y democratizar la gobernanza. Muchas gracias.
-->

---
<!-- layout: qa-view -->
<!-- trigger: final-quiz -->
<!-- badge: SESIÓN INTERACTIVA -->
<!-- subtitle: Preguntas de la audiencia recibidas durante la charla -->
# Preguntas y Respuestas (Q&A)

