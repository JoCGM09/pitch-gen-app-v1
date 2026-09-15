import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { globalState } from './state/sessionState';

const app = express();
const port = 3001;

// Configurar middlewares
app.use(cors());
app.use(express.json());

// Crear servidor HTTP y vincular Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Habilitar acceso para todos los orígenes en dev
    methods: ['GET', 'POST']
  }
});

// Servir la carpeta public estáticamente para test-client.html
app.use(express.static('public'));

// Ruta base para testeo rápido
app.get('/', (req, res) => {
  res.send('Pitch Gen Realtime Server is running');
});

// Conexión de clientes a Socket.io
io.on('connection', (socket) => {
  console.log(`[Socket] Nuevo cliente conectado: ${socket.id}`);

  // Enviar el estado actual apenas se conecta alguien
  socket.emit('audience:sync', globalState.getSnapshot());

  socket.on('presenter:sync', (payload: { slideIndex: number, stepIndex: number, trigger: string | null }) => {
    globalState.syncPresenter(payload.slideIndex, payload.stepIndex, payload.trigger);
    io.emit('audience:sync', globalState.getSnapshot());
    
    // Si hay un trigger activo, emitir también sus resultados actuales (posiblemente ceros)
    if (payload.trigger) {
      io.emit('poll:results', { 
        triggerId: payload.trigger, 
        results: globalState.getPollResults(payload.trigger) 
      });
    }
  });

  socket.on('audience:vote', (payload: { triggerId: string, uuid: string, option: string }) => {
    // Validar que exista el trigger activo actual coincida con el voto (o permitir votar en polls antiguos si se quiere, según el caso)
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

// Arrancar el servidor
server.listen(port, () => {
  console.log(`[Server] Corriendo en http://localhost:${port}`);
});
