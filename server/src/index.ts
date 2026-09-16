import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { globalState } from './state/sessionState';

const app = express();
const port = process.env.PORT || 3001;

let ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
if (!ALLOWED_ORIGIN) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('[Warning] ALLOWED_ORIGIN no está definido en producción. Usando restrictivo por defecto.');
    ALLOWED_ORIGIN = ''; // restrictivo por defecto
  } else {
    ALLOWED_ORIGIN = 'http://localhost:5173'; // Vite default para desarrollo
  }
}

if (!process.env.PRESENTER_SECRET && process.env.NODE_ENV !== 'test') {
  console.warn('[Warning] PRESENTER_SECRET no está definido en el entorno. La sincronización del presentador podría fallar en producción.');
}

// Configurar middlewares
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

// Crear servidor HTTP y vincular Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST']
  }
});

// Servir la carpeta public estáticamente para test-client.html
app.use(express.static('public'));

// Ruta base para testeo rápido
app.get('/', (req, res) => {
  res.send('Pitch Gen Realtime Server is running');
});

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Basic Rate Limiting en memoria para Audience Votes y Q&A
const voteRateLimits = new Map<string, number>();
const qaRateLimits = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 1000; // 1 voto por segundo por UUID
const QA_RATE_LIMIT_WINDOW_MS = 30000; // 1 pregunta cada 30 segundos por UUID

// Conexión de clientes a Socket.io
io.on('connection', (socket) => {
  console.log(`[Socket] Nuevo cliente conectado: ${socket.id}`);

  // Enviar el estado actual apenas se conecta alguien
  socket.emit('audience:sync', globalState.getSnapshot());

  socket.on('presenter:sync', (payload: { slideIndex: number, stepIndex: number, trigger: string | null, secret?: string }) => {
    // 1. Autorización dinámica evaluada contra env
    if (payload.secret !== process.env.PRESENTER_SECRET) {
      console.warn(`[Socket] Intento no autorizado de presenter:sync desde ${socket.id}`);
      return;
    }

    // 2. Validación de inputs básicos
    if (typeof payload.slideIndex !== 'number' || typeof payload.stepIndex !== 'number') {
      return;
    }

    globalState.syncPresenter(payload.slideIndex, payload.stepIndex, payload.trigger);
    io.emit('audience:sync', globalState.getSnapshot());
    
    // Si hay un trigger activo, emitir también sus resultados actuales
    if (payload.trigger) {
      io.emit('poll:results', { 
        triggerId: payload.trigger, 
        results: globalState.getPollResults(payload.trigger) 
      });
    }
  });

  socket.on('presenter:reset', (payload: { secret?: string }) => {
    if (payload.secret !== process.env.PRESENTER_SECRET) {
      return;
    }
    globalState.resetSession();
    io.emit('session:reset');
    io.emit('qa:list', []);
    if (globalState.activeTrigger) {
      io.emit('poll:results', { triggerId: globalState.activeTrigger, results: {} });
    }
  });

  socket.on('presenter:get-qa', (payload: { secret?: string }) => {
    if (payload.secret !== process.env.PRESENTER_SECRET) {
      return;
    }
    socket.emit('qa:list', globalState.getQAQuestions());
  });

  socket.on('presenter:remove-qa', (payload: { secret?: string, id: string }) => {
    if (payload.secret !== process.env.PRESENTER_SECRET) {
      return;
    }
    if (typeof payload.id === 'string') {
      globalState.removeQAQuestion(payload.id);
      io.emit('qa:remove', payload.id);
    }
  });

  socket.on('audience:vote', (payload: { triggerId: string, uuid: string, option: string }) => {
    // 1. Validación de inputs y estructura
    if (!payload || typeof payload.triggerId !== 'string' || typeof payload.uuid !== 'string' || typeof payload.option !== 'string') {
      return;
    }
    
    // Evitar payloads gigantes
    if (payload.triggerId.length > 100 || payload.uuid.length > 100 || payload.option.length > 100) {
      return;
    }

    // 2. Rate Limiting simple (Bypass in test) basado en la IP
    const now = Date.now();
    const clientIp = socket.handshake.address;
    const lastVoteTime = voteRateLimits.get(clientIp) || 0;
    const isTest = process.env.NODE_ENV === 'test';
    
    if (!isTest && (now - lastVoteTime < RATE_LIMIT_WINDOW_MS)) {
      return; // Ignorar si vota demasiado rápido (Debounce/Rate limit)
    }
    voteRateLimits.set(clientIp, now);

    // 3. Registrar el voto si coincide con algún trigger
    if (payload.triggerId) {
      globalState.registerVote(payload.triggerId, payload.uuid, payload.option);
      
      io.emit('poll:results', { 
        triggerId: payload.triggerId, 
        results: globalState.getPollResults(payload.triggerId) 
      });
    }
  });

  socket.on('audience:qa', (payload: { uuid: string, question: string }) => {
    if (!payload || typeof payload.uuid !== 'string' || typeof payload.question !== 'string') {
      return;
    }

    // Sanitización y recorte de caracteres (max 250)
    let rawQuestion = payload.question.trim().slice(0, 250);
    if (!rawQuestion || payload.uuid.length > 100) {
      return;
    }
    
    // Escapar caracteres HTML para mitigar XSS
    const cleanQuestion = escapeHtml(rawQuestion);

    // Rate limit Q&A: 1 pregunta cada 30s basado en IP (Bypass in test)
    const now = Date.now();
    const clientIp = socket.handshake.address;
    const lastQaTime = qaRateLimits.get(clientIp) || 0;
    const isTest = process.env.NODE_ENV === 'test';

    if (!isTest && (now - lastQaTime < QA_RATE_LIMIT_WINDOW_MS)) {
      return;
    }
    qaRateLimits.set(clientIp, now);

    const qaItem = {
      id: 'qa-' + Math.random().toString(36).substring(2, 9),
      uuid: payload.uuid,
      question: cleanQuestion,
      timestamp: now
    };

    globalState.addQAQuestion(qaItem);
    io.emit('qa:new', qaItem);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Cliente desconectado: ${socket.id}`);
  });
});

// Arrancar el servidor solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => {
    console.log(`[Server] Corriendo en puerto ${port}`);
  });
}

export { app, server, io };
