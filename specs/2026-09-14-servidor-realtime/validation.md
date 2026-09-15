# Criterios de Validación: Fase 3 - Servidor Realtime

La implementación se considera lista para revisión/merge cuando se cumplan **todos** los siguientes criterios verificables:

## 1. Conectividad y Puertos
- [ ] El servidor corre exitosamente con `ts-node` o compilado en el puerto `3001` sin conflictos de CORS.
- [ ] La aplicación frontend (`/deck` en puerto `5173`) se conecta a Socket.io sin errores en la consola.

## 2. Flujo Presentador -> Servidor
- [ ] Cuando el presentador navega hacia adelante o atrás usando las flechas, la consola del servidor backend imprime que recibió un evento `presenter:sync` con el índice correcto de la diapositiva y el paso.
- [ ] Al entrar a una slide con `interactionTrigger` (ej. "poll-apertura"), el backend registra dicho trigger como "activo" en su memoria.

## 3. Tolerancia a fallos y Estado
- [ ] Si se detiene y reinicia el proceso del servidor backend, el cliente de prueba HTML no se rompe permanentemente.
- [ ] Al avanzar una diapositiva en el deck *después* de reiniciar el servidor, el servidor recupera correctamente el conocimiento de en qué slide está la presentación.

## 4. Prevención de Duplicados
- [ ] Enviando múltiples veces el mismo voto desde el cliente de pruebas HTML con el mismo `UUID`, el contador total de votos en el servidor para ese trigger sube a `1` y no sigue incrementándose.
- [ ] Enviando votos desde un segundo cliente HTML simulado (abierto en modo incógnito / otro UUID), el contador total sube a `2`.
