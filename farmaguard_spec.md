# Especificación del Proyecto: FarmaGuard V2 (GoodPills)

## 📌 Contexto y Objetivo Principal
FarmaGuard ha evolucionado a una aplicación web integral impulsada por Inteligencia Artificial orientada 100% al paciente. 
El usuario puede subir una receta médica (en formato imagen), tras lo cual nuestra IA (usando Gemini Vision) extraerá la lista de medicamentos prescritos y hará un pareo (match) de similitud semántica con nuestra base de datos.

A través de una **interfaz interactiva de chat**, el usuario podrá ver la lista detectada, agregar o quitar medicamentos, y confirmar su receta. 
Posteriormente, el sistema **cruza esta información en busca de contraindicaciones** e interacciones peligrosas entre medicamentos. 
Por último, el usuario puede consultar en qué **sucursales de farmacia** hay disponibilidad de los medicamentos validados.

---

## 🛠️ Restricciones Tecnológicas (Stack)
- **Framework:** React con Next.js (App Router).
- **IA:** Vercel AI SDK v6 + Google Gemini (Flash 2.5) para visión, extracción de datos estructurados y chat.
- **Estilación:** Tailwind CSS (utility-first).
- **Componentes UI:** shadcn/ui.
- **Íconos:** Lucide React.
- **Estética y Diseño:** Limpio, profesional, al estilo "health-tech" y que transmita confianza. Paleta de azules/verdes médicos con colores de alerta claros (rojo/amarillo).

---

## 💾 Esquema de Base de Datos (MOCKS - Supabase en el futuro)

1. **`medications`**
   - `id`, `trade_name`, `active_ingredient`, `description`.
2. **`interactions`**
   - Relaciona patologías o medicamentos entre sí y reporta un riesgo.
   - `item_a_id`, `item_b_id`, `severity` (`LOW`, `MODERATE`, `HIGH`), `warning_message`.
3. **`pharmacies`**
   - `id`, `name`, `address`.
4. **`inventory`**
   - `pharmacy_id`, `medication_id`, `stock_status` (`IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`).

---

## 📱 Flujo de Pantallas de la Aplicación

La aplicación funcionará como un proceso (pipeline) continuo en la misma vista, integrado directamente en el portal del paciente.

### FASE 1: Subida de la Receta (Upload)
- Una interfaz atractiva de estilo *Drag & Drop* centrada para subir la foto/PDF de la receta médica proporcionada por el doctor.
- Una vez cargada, se mostrará un estado de "Analizando documento con IA...".

### FASE 2: Chat Asistido y Extracción (Review & Edit)
- La IA extraerá los datos y responderá a través del componente de **Chat**.
- Usando *UI Generativa* (Generative UI), el chat no solo responderá texto, sino que incrustará una **Tarjeta Interactiva** con la lista de los medicamentos detectados.
- En esta tarjeta, el usuario tendrá la potestad de eliminar medicamentos que no desee comprar o pedirle a la IA mediante texto ("Agrega Paracetamol") que sume más ítems al carrito.

### FASE 3: Verificación de Riesgos (Safety Cross-Check)
- Cuando el usuario indique estar listo, un botón primario `[Verificar Análisis de Riesgo]` procesará la lista.
- El sistema cruzará la lista actual de medicamentos simulando llamadas a base de datos.
- Despliegue del "Semáforo":
  - 🟢 **SAFE:** Tarjeta verde (Sin contraindicaciones cruzadas).
  - 🟡 **WARNING:** Tarjeta amarilla indicando riesgo leve/moderado (Ej. Somnolencia).
  - 🔴 **DANGER:** Tarjeta roja bloqueando o alertando un riesgo crítico (Ej. Hemorragia interna o choque de ingredientes activos).

### FASE 4: Localizador de Farmacias (Availability / Checkout)
- El paso final mostrará un mapa simulado o lista de **Sucursales**.
- Ordenará las sucursales según aquellas que posean todo el listado de ingredientes validados en su inventario.
- Ej: "Farmacia Centro - 100% disponibles" vs "Farmacia Norte - Falta 1 medicamento".

---

## 📌 Progreso
(Desarrollo en curso basándose fuertemente en IA SDK v6 streaming y React Server Components).
