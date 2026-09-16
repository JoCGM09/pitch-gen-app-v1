# Definición de Marca: Pitch Gen

## Contexto y Tono
- **Producto:** Motor de presentación web a medida con interacción sincronizada de audiencia.
- **Tono de Voz:** Profesional, técnico, eficiente y directo.
- **Entorno Principal:** Ambientes oscuros (proyección en salas, auditorios) y pantallas móviles forzadas a coincidir con esta estética para minimizar el impacto lumínico durante la presentación.

## Tipografía
- **Fuente Principal:** Inter (o system-ui). Seleccionada por su excelente legibilidad en pantallas digitales, esencial para un deck de presentación y opciones de encuestas en dispositivos móviles.
- **Jerarquía:** 
  - Títulos: Bold (700)
  - Cuerpo: Regular (400) / Medium (500) para botones.

## Paleta de Color (Modo Oscuro Forzado)
Se prioriza un entorno Dark Mode, con colores de acento vibrantes para guiar la interacción (botones, encuestas).

- **Fondo Principal:** `#111827` (Gray 900) - Oscuro pero no negro puro para reducir fatiga visual.
- **Texto Principal:** `#F3F4F6` (Gray 100) - Contraste alto pero cómodo.
- **Primario / Acción:** `#3B82F6` (Blue 500) - Usado para botones principales y selección.
- **Acento / Resaltado:** `#10B981` (Emerald 500) - Usado para estados de éxito o opciones seleccionadas.
- **Superficies / Tarjetas:** `#1F2937` (Gray 800) - Para destacar opciones de poll sobre el fondo.

*Nota de Accesibilidad:* La combinación de texto `#F3F4F6` sobre fondo `#111827` ha sido verificada arrojando un ratio de **16.12:1**, pasando holgadamente los estándares AA y AAA.

## Reglas de Interacción y Animación
- **Animaciones UI Móvil:** Aparición de encuestas mediante **Fade Simple** (`opacity` transition). Se prohíben animaciones complejas (bounces, slides pronunciados) para mantener la seriedad técnica y la inmediatez.
- **Selección de Encuestas:** Retroalimentación inmediata de selección (cambio de color de borde/fondo) y bloqueo visual tras el voto.

## Vocabulario y Copy
- **Acciones:** "Enviar", "Votar", "Confirmar".
- **Mensajes de Espera:** "Esperando la siguiente pregunta...", "Mira a la pantalla principal".
- Evitar jerga confusa o lenguaje excesivamente lúdico.
