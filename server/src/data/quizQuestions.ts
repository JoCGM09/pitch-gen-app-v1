export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ClientQuestion {
  id: string;
  question: string;
  options: string[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "¿Cuál es el riesgo de que la IA acceda a datos sin linaje?",
    options: [
      "Opacidad y ejecución basada en datos corruptos",
      "Mayor consumo de CPU y memoria RAM",
      "Caída de la base de datos por exceso de consultas",
      "Alucinaciones lingüísticas por falta de vocabulario"
    ],
    correctIndex: 0
  },
  {
    id: "q2",
    question: "¿Qué ventaja ofrece un catálogo de datos para un agente de IA?",
    options: [
      "Actúa como mapa de navegación para entender esquemas",
      "Entrena el modelo fundacional",
      "Reduce la latencia de red de los microservicios",
      "Genera gráficos dinámicos automáticamente"
    ],
    correctIndex: 0
  },
  {
    id: "q3",
    question: "¿Qué representa dbt en el flujo de datos?",
    options: [
      "Prácticas de ingeniería de software aplicadas a transformaciones SQL",
      "Un modelo de Inteligencia Artificial estadístico avanzado",
      "Un sistema de almacenamiento de objetos estáticos",
      "Un orquestador serverless de contenedores"
    ],
    correctIndex: 0
  },
  {
    id: "q4",
    question: "¿Qué es OpenLineage?",
    options: [
      "Estándar abierto para captura de metadatos en tiempo de ejecución",
      "Un motor de base de datos relacional open-source",
      "Un framework para despliegue de IA conversacional",
      "Un servicio propietario exclusivo de AWS"
    ],
    correctIndex: 0
  },
  {
    id: "q5",
    question: "¿Qué componente de AWS se usa para el cómputo serverless de contenedores?",
    options: [
      "AWS Fargate",
      "Amazon S3 con Apache Iceberg",
      "Amazon Athena",
      "Amazon EventBridge Scheduler"
    ],
    correctIndex: 0
  },
  {
    id: "q6",
    question: "¿Para qué se utiliza Amazon Athena en esta arquitectura?",
    options: [
      "Motor de consultas SQL serverless",
      "Almacenamiento persistente de logs de aplicación",
      "Orquestación de tareas complejas en contenedores",
      "Generación de reportes de negocio en PDF"
    ],
    correctIndex: 0
  },
  {
    id: "q7",
    question: "¿Cuál es la función de dbt-ol en el pipeline?",
    options: [
      "Contenedor que ejecuta SQL e intercepta eventos de linaje",
      "Entrena y sirve modelos fundacionales",
      "Balanceador de carga elástico para bases de datos",
      "Catálogo de datos visual interactivo"
    ],
    correctIndex: 0
  },
  {
    id: "q8",
    question: "¿Qué permite Amazon S3 con Apache Iceberg?",
    options: [
      "Almacenamiento columnar con transacciones ACID y time travel",
      "Ejecución de código funcional sin servidores",
      "Enrutamiento DNS y distribución global de contenido",
      "Una interfaz nativa para construir agentes IA"
    ],
    correctIndex: 0
  },
  {
    id: "q9",
    question: "¿Qué rol juega Amazon EventBridge Scheduler?",
    options: [
      "Disparador programado (cron) de cero servidores en reposo",
      "Base de datos indexada en memoria",
      "Motor de análisis semántico basado en LLM",
      "Canal de comunicación síncrona tipo WebSocket"
    ],
    correctIndex: 0
  },
  {
    id: "q10",
    question: "¿Cómo envía esta arquitectura los eventos de linaje a DataZone sin intermediarios?",
    options: [
      "Transporte directo SigV4 a la API PostLineageEvent",
      "Usando colas asíncronas SQS",
      "A través de múltiples proxies y Lambdas",
      "Mediante webhooks REST sin autenticar"
    ],
    correctIndex: 0
  },
  {
    id: "q11",
    question: "¿Qué visualiza Amazon SageMaker Unified Studio en este contexto?",
    options: [
      "El grafo de linaje de datos a nivel de columna",
      "El costo de ejecución exacto de AWS Fargate",
      "El tráfico histórico de red entre contenedores",
      "La latencia del presentador en tiempo real"
    ],
    correctIndex: 0
  },
  {
    id: "q12",
    question: "¿Por qué los LLMs necesitan conexión a un Data Warehouse o Data Lake?",
    options: [
      "Para tener contexto de negocio en tiempo real y evitar alucinaciones",
      "Para compilar su propio código backend automáticamente",
      "Para mejorar la sintaxis y gramática en múltiples idiomas",
      "Para replicar la interfaz de un dashboard clásico"
    ],
    correctIndex: 0
  },
  {
    id: "q13",
    question: "¿Qué diferencia fundamental hay entre un modelo dbt y un modelo de IA?",
    options: [
      "El modelo dbt es determinístico (SQL) y el de IA es estadístico",
      "Ambos son exactamente el mismo concepto técnico",
      "El modelo dbt realiza inferencias más rápido",
      "El modelo dbt entiende el lenguaje natural y razona"
    ],
    correctIndex: 0
  },
  {
    id: "q14",
    question: "¿Qué sucede con la 'propagación en cascada' cuando hay datos erróneos?",
    options: [
      "El error viaja por el sistema dificultando rastrear su origen inicial",
      "Un mecanismo de seguridad lo corrige automáticamente",
      "El sistema se congela para prevenir la ejecución",
      "El agente de IA realiza un rollback de datos"
    ],
    correctIndex: 0
  },
  {
    id: "q15",
    question: "¿Qué eventos clave emite automáticamente OpenLineage al ejecutar un modelo?",
    options: [
      "START, COMPLETE y FAIL",
      "LOGIN, QUERY y LOGOUT",
      "CLICK, HOVER y SUBMIT",
      "COMMIT, PUSH y MERGE"
    ],
    correctIndex: 0
  },
  {
    id: "q16",
    question: "¿Qué función cumple AWS Step Functions en la arquitectura propuesta?",
    options: [
      "Orquestador de máquina de estados con reintentos nativos",
      "Distribuidor de tráfico hacia el motor Athena",
      "Catálogo centralizado de metadatos estáticos",
      "Servidor de websockets para la audiencia"
    ],
    correctIndex: 0
  },
  {
    id: "q17",
    question: "¿Qué significa el concepto de 'Linaje de Datos'?",
    options: [
      "El árbol genealógico del dato, rastreando su origen y transformaciones",
      "Un algoritmo específico para clustering de usuarios",
      "El sistema de facturación por capa de uso",
      "El nivel jerárquico de acceso a bases de datos"
    ],
    correctIndex: 0
  },
  {
    id: "q18",
    question: "¿Cómo ayuda el linaje en un entorno de cumplimiento regulatorio (Compliance)?",
    options: [
      "Demostrando a auditores el origen exacto de una decisión automatizada",
      "Encriptando automáticamente todas las columnas sensibles",
      "Limitando el ancho de banda por región",
      "Creando copias de seguridad cada 24 horas"
    ],
    correctIndex: 0
  },
  {
    id: "q19",
    question: "¿Cuál de los siguientes se considera un destino downstream en un grafo de linaje?",
    options: [
      "Agentes de IA y dashboards analíticos",
      "Tablas maestras de datos crudos",
      "Logs de la aplicación web",
      "Desencadenadores de eventos cron"
    ],
    correctIndex: 0
  },
  {
    id: "q20",
    question: "¿Cuál es el primer paso recomendado para acelerar la adopción segura de IA?",
    options: [
      "Desplegar un piloto pequeño con los modelos dbt críticos",
      "Desconectar todos los sistemas monolíticos heredados",
      "Alimentar el LLM con todos los correos de la empresa",
      "Reemplazar auditores por agentes IA"
    ],
    correctIndex: 0
  }
];
