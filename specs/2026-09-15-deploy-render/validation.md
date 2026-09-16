# Validation — Pulido, Q&A Directo y Deploy

## Criterios de aceptación
- [ ] No existen componentes visuales del "Panel del Presentador" en `DeckView.vue`.
- [ ] El botón de eliminar pregunta ('✕') en la vista `qa-view` es visible siempre y funcional para borrar preguntas de la vista global.
- [ ] Existe un archivo `render.yaml` válido en la raíz que apunte a `server/`.
- [ ] El backend (`server/`) tiene un script `build` que compila TypeScript a JS, y un script `start` que corre Node puro.
- [ ] Al imprimir (Ctrl+P) la página, se muestran las slides adaptadas a página completa, ocultando barras de progreso, footer y elementos interactivos.

## Cómo probarlo manualmente
1. Abrir `http://localhost:<port>/deck/0/-1`.
2. Verificar que no haya botones de "Panel" en el footer.
3. Ingresar la clave de presentador, ir a la última slide de Q&A.
4. Enviar una pregunta desde otra pestaña `/join/test-room`. Ver que aparece. Dar click a la `✕` en la vista del deck y comprobar que la pregunta se borra.
5. Pulsar Ctrl+P; debe aparecer la previsualización de impresión en un formato apto (fondos oscuros, sin menús interactivos).

## Checklist antes de mergear
- [ ] Tests pasando (Agent: test-writer - `/test`)
- [ ] Revisión de seguridad sin hallazgos critical/high (Agent: security-reviewer - `/security-review`)
- [ ] plan.md con todos los grupos marcados como hechos
