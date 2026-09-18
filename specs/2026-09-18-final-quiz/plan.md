# Plan de Implementación: Final Quiz Interactivo

## 1. Resumen
La feature "Final Quiz" es una experiencia de gamificación para la audiencia al cierre de la presentación, diseñada para validar los conocimientos técnicos expuestos (Data Lineage, dbt, OpenLineage, AWS Fargate, etc.). El objetivo del asistente es contestar 4 preguntas correctamente de forma consecutiva (alcanzar una racha de 4/4) para obtener una insignia de victoria. Para garantizar integridad y seguridad, las preguntas, respuestas y la validación residen exclusivamente en el servidor (backend). El presentador podrá visualizar en tiempo real cómo avanza la audiencia mediante un gráfico consolidado.

## 2. Arquitectura de Datos y Eventos Socket.io

### Estado en el Servidor (Memoria)
El servidor mantendrá un mapa `quizSessions` para trackear el progreso de cada usuario usando el identificador existente `userUuid`:
```typescript
interface QuizSession {
  streak: number; // de 0 a 4
  currentQuestions: QuestionDTO[]; // 4 preguntas asignadas aleatoriamente
}
```
Además, un estado global agregado para emitir estadísticas al presentador:
```typescript
interface QuizStats {
  0: number; // Usuarios con racha 0
  1: number; // Usuarios con racha 1
  2: number; // Usuarios con racha 2
  3: number; // Usuarios con racha 3
  4: number; // Victorias (Racha de 4/4)
}
```

### Eventos Socket.io

**Cliente -> Servidor:**
- `audience:quiz-start`: Solicitud para iniciar el quiz. El servidor inicializa la racha a 0, selecciona 4 preguntas aleatorias del banco de 20 y las devuelve (solo ID, texto de pregunta y 4 opciones sin la respuesta).
- `audience:quiz-submit`: Payload `{ questionId, optionIndex }`. Envía la respuesta seleccionada por el usuario.

**Servidor -> Cliente (Audiencia):**
- `quiz:question-result`: Payload `{ correct: boolean, streak: number, newQuestions?: QuestionDTO[] }`. Devuelve la evaluación. Si falla, la racha vuelve a 0 y envía 4 preguntas nuevas (sin revelar la correcta). Si acierta, sube la racha.
- `quiz:victory`: Se emite cuando el jugador alcanza satisfactoriamente el 4/4.

**Servidor -> Cliente (Presentador):**
- `quiz:stats`: Payload `QuizStats`. Emite el conteo global de usuarios por estado (0/4 a 4/4) cada vez que hay un cambio.

## 3. Banco de 20 Preguntas
El origen de este banco de preguntas debe residir **exclusivamente** en el backend en `server/src/data/quizQuestions.ts`.

1. **¿Cuál es el riesgo de que la IA acceda a datos sin linaje?**
   - *A) Opacidad y ejecución basada en datos corruptos (Correcta)*
   - B) Mayor consumo de CPU y memoria RAM
   - C) Caída de la base de datos por exceso de consultas
   - D) Alucinaciones lingüísticas por falta de vocabulario
2. **¿Qué ventaja ofrece un catálogo de datos para un agente de IA?**
   - *A) Actúa como mapa de navegación para entender esquemas (Correcta)*
   - B) Entrena el modelo fundacional
   - C) Reduce la latencia de red de los microservicios
   - D) Genera gráficos dinámicos automáticamente
3. **¿Qué representa dbt en el flujo de datos?**
   - *A) Prácticas de ingeniería de software aplicadas a transformaciones SQL (Correcta)*
   - B) Un modelo de Inteligencia Artificial estadístico avanzado
   - C) Un sistema de almacenamiento de objetos estáticos
   - D) Un orquestador serverless de contenedores
4. **¿Qué es OpenLineage?**
   - *A) Estándar abierto para captura de metadatos en tiempo de ejecución (Correcta)*
   - B) Un motor de base de datos relacional open-source
   - C) Un framework para despliegue de IA conversacional
   - D) Un servicio propietario exclusivo de AWS
5. **¿Qué componente de AWS se usa para el cómputo serverless de contenedores?**
   - *A) AWS Fargate (Correcta)*
   - B) Amazon S3 con Apache Iceberg
   - C) Amazon Athena
   - D) Amazon EventBridge Scheduler
6. **¿Para qué se utiliza Amazon Athena en esta arquitectura?**
   - *A) Motor de consultas SQL serverless (Correcta)*
   - B) Almacenamiento persistente de logs de aplicación
   - C) Orquestación de tareas complejas en contenedores
   - D) Generación de reportes de negocio en PDF
7. **¿Cuál es la función de `dbt-ol` en el pipeline?**
   - *A) Contenedor que ejecuta SQL e intercepta eventos de linaje (Correcta)*
   - B) Entrena y sirve modelos fundacionales
   - C) Balanceador de carga elástico para bases de datos
   - D) Catálogo de datos visual interactivo
8. **¿Qué permite Amazon S3 con Apache Iceberg?**
   - *A) Almacenamiento columnar con transacciones ACID y time travel (Correcta)*
   - B) Ejecución de código funcional sin servidores
   - C) Enrutamiento DNS y distribución global de contenido
   - D) Una interfaz nativa para construir agentes IA
9. **¿Qué rol juega Amazon EventBridge Scheduler?**
   - *A) Disparador programado (cron) de cero servidores en reposo (Correcta)*
   - B) Base de datos indexada en memoria
   - C) Motor de análisis semántico basado en LLM
   - D) Canal de comunicación síncrona tipo WebSocket
10. **¿Cómo envía esta arquitectura los eventos de linaje a DataZone sin intermediarios?**
    - *A) Transporte directo SigV4 a la API PostLineageEvent (Correcta)*
    - B) Usando colas asíncronas SQS
    - C) A través de múltiples proxies y Lambdas
    - D) Mediante webhooks REST sin autenticar
11. **¿Qué visualiza Amazon SageMaker Unified Studio en este contexto?**
    - *A) El grafo de linaje de datos a nivel de columna (Correcta)*
    - B) El costo de ejecución exacto de AWS Fargate
    - C) El tráfico histórico de red entre contenedores
    - D) La latencia del presentador en tiempo real
12. **¿Por qué los LLMs necesitan conexión a un Data Warehouse o Data Lake?**
    - *A) Para tener contexto de negocio en tiempo real y evitar alucinaciones (Correcta)*
    - B) Para compilar su propio código backend automáticamente
    - C) Para mejorar la sintaxis y gramática en múltiples idiomas
    - D) Para replicar la interfaz de un dashboard clásico
13. **¿Qué diferencia fundamental hay entre un modelo dbt y un modelo de IA?**
    - *A) El modelo dbt es determinístico (SQL) y el de IA es estadístico (Correcta)*
    - B) Ambos son exactamente el mismo concepto técnico
    - C) El modelo dbt realiza inferencias más rápido
    - D) El modelo dbt entiende el lenguaje natural y razona
14. **¿Qué sucede con la "propagación en cascada" cuando hay datos erróneos?**
    - *A) El error viaja por el sistema dificultando rastrear su origen inicial (Correcta)*
    - B) Un mecanismo de seguridad lo corrige automáticamente
    - C) El sistema se congela para prevenir la ejecución
    - D) El agente de IA realiza un rollback de datos
15. **¿Qué eventos clave emite automáticamente OpenLineage al ejecutar un modelo?**
    - *A) START, COMPLETE y FAIL (Correcta)*
    - B) LOGIN, QUERY y LOGOUT
    - C) CLICK, HOVER y SUBMIT
    - D) COMMIT, PUSH y MERGE
16. **¿Qué función cumple AWS Step Functions en la arquitectura propuesta?**
    - *A) Orquestador de máquina de estados con reintentos nativos (Correcta)*
    - B) Distribuidor de tráfico hacia el motor Athena
    - C) Catálogo centralizado de metadatos estáticos
    - D) Servidor de websockets para la audiencia
17. **¿Qué significa el concepto de "Linaje de Datos"?**
    - *A) El árbol genealógico del dato, rastreando su origen y transformaciones (Correcta)*
    - B) Un algoritmo específico para clustering de usuarios
    - C) El sistema de facturación por capa de uso
    - D) El nivel jerárquico de acceso a bases de datos
18. **¿Cómo ayuda el linaje en un entorno de cumplimiento regulatorio (Compliance)?**
    - *A) Demostrando a auditores el origen exacto de una decisión automatizada (Correcta)*
    - B) Encriptando automáticamente todas las columnas sensibles
    - C) Limitando el ancho de banda por región
    - D) Creando copias de seguridad cada 24 horas
19. **¿Cuál de los siguientes se considera un destino downstream en un grafo de linaje?**
    - *A) Agentes de IA y dashboards analíticos (Correcta)*
    - B) Tablas maestras de datos crudos
    - C) Logs de la aplicación web
    - D) Desencadenadores de eventos cron
20. **¿Cuál es el primer paso recomendado para acelerar la adopción segura de IA?**
    - *A) Desplegar un piloto pequeño con los modelos dbt críticos (Correcta)*
    - B) Desconectar todos los sistemas monolíticos heredados
    - C) Alimentar el LLM con todos los correos de la empresa
    - D) Reemplazar auditores por agentes IA

## 4. Componentes a Modificar/Crear

### Backend (`server/src/`)
- **`data/quizQuestions.ts` (Nuevo)**: Exporta el array del banco de preguntas (incluyendo la respuesta correcta y las opciones).
- **`services/quizService.ts` (Nuevo)**: Lógica principal para mantener el estado de `quizSessions`, seleccionar las 4 preguntas para cada intento (limpiando el atributo de la respuesta correcta), validar aciertos/errores contra el array completo y mutar la racha.
- **`socket/quizHandlers.ts` (Nuevo)**: Handlers para los eventos de Socket.io `audience:quiz-start` y `audience:quiz-submit`, que consultan al `quizService` y se comunican con los clientes y el dashboard.

### Cliente - Audiencia (`audience-app/src/`)
- **`views/QuizView.vue` (Nuevo)**: Pantalla de la aplicación móvil donde se visualiza el estado del juego (Racha: x/4), la pregunta en curso y botones de las 4 opciones.
- **`components/QuizVictory.vue` (Nuevo)**: Renderizado del estado de victoria (pantalla final con la insignia) a mostrarse una vez que se completan las 4 preguntas de manera perfecta.
- **`store/quizStore.ts` (Nuevo)**: Manejo del estado reactivo para la sesión del quiz usando el `userUuid` alojado en localStorage (`pitchgen_audience_uuid`).

### Cliente - Presentador (`deck-app/src/`)
- **`components/QuizStatsWidget.vue` (Nuevo)**: Widget SVG o basado en Tailwind que captura el evento global `quiz:stats` e ilustra las barras y volúmenes de usuarios en tiempo real (ej. 15 usuarios en 0/4, 5 en 2/4, 2 en 4/4).
- **`views/DeckView.vue` (Modificado)**: Añadir la lógica para detectar si el slide activo contiene el trigger `interactionTrigger: 'final-quiz'` de modo que proyecte o muestre en el panel al `QuizStatsWidget.vue`.

## 5. Pasos de Verificación

1. **Restricción de Seguridad del Banco**: Inspeccionar la carga útil en el panel de red (DevTools) del cliente para validar que la respuesta correcta NUNCA viaja en los objetos recibidos desde el servidor.
2. **Ciclo de Reinicio Inmediato**: Acertar intencionalmente 2 preguntas y errar la tercera. Verificar en UI que la racha desciende a 0 y que el servidor remite instantáneamente un nuevo set de 4 preguntas sin mostrar cuál debió ser la opción válida.
3. **Persistencia de Sesión por userUuid**: Refrescar la web del móvil tras obtener 1 respuesta correcta. Verificar que el backend mantiene la sesión conectada y restablece la misma pregunta y racha activa vía reconexión de socket.
4. **Reactividad del Presentador**: Abriendo múltiples emulaciones móviles y contestando aleatoriamente, asegurar que el gráfico proyectado en el deck (`QuizStatsWidget`) refleja y totaliza dinámicamente los progresos de todo el público.
5. **Condición de Éxito Definitivo (4/4)**: Completar exitosamente la racha y validar que aparece la pantalla de victoria/insignia (componente visualizado en la audiencia).