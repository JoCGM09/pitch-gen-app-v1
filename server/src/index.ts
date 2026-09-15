import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { globalState } from './state/sessionState';

const app = express();
const port = process.env.PORT || 3001;
const PRESENTER_SECRET = process.env.PRESENTER_SECRET || 'dev-secret-key';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173'; // Vite default

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

// Basic Rate Limiting en memoria para Audience Votes
const voteRateLimits = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 1000; // 1 voto por segundo por UUID

// Conexión de clientes a Socket.io
io.on('connection', (socket) => {
  console.log(`[Socket] Nuevo cliente conectado: ${socket.id}`);

  // Enviar el estado actual apenas se conecta alguien
  socket.emit('audience:sync', globalState.getSnapshot());

  socket.on('presenter:sync', (payload: { slideIndex: number, stepIndex: number, trigger: string | null, secret?: string }) => {
    // 1. Autorización
    if (payload.secret !== PRESENTER_SECRET) {
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

  socket.on('audience:vote', (payload: { triggerId: string, uuid: string, option: string }) => {
    // 1. Validación de inputs y estructura
    if (!payload || typeof payload.triggerId !== 'string' || typeof payload.uuid !== 'string' || typeof payload.option !== 'string') {
      return;
    }
    
    // Evitar payloads gigantes
    if (payload.triggerId.length > 100 || payload.uuid.length > 100 || payload.option.length > 100) {
      return;
    }

    // 2. Rate Limiting simple (Bypass in test)
    const now = Date.now();
    const lastVoteTime = voteRateLimits.get(payload.uuid) || 0;
    const isTest = process.env.NODE_ENV === 'test';
    
    if (!isTest && (now - lastVoteTime < RATE_LIMIT_WINDOW_MS)) {
      return; // Ignorar si vota demasiado rápido (Debounce/Rate limit)
    }
    voteRateLimits.set(payload.uuid, now);

    // 3. Registrar el voto si coincide con algún trigger
    if (payload.triggerId) {
      globalState.registerVote(payload.triggerId, payload.uuid, payload.option);
      
      io.emit('poll:results', { 
        triggerId: payload.triggerId, 
        results: globalState.getPollResults(payload.triggerId) 
      });
    }
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
