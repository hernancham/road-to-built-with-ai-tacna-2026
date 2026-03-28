import { tool as createTool } from "ai";
import { z } from "zod";
import {
  mockMedications,
  mockInteractions,
  mockPharmacies,
  mockInventory,
} from "../mocks";

// Tool 1: Extract and show medications based on user input or image
export const showDetectedMedicationsTool = createTool({
  description:
    "Muestra la lista de medicamentos extraídos de la receta del usuario (o descritos por él) y los empareja con nuestra base de datos.",
  inputSchema: z.object({
    medications: z
      .array(
        z.object({
          trade_name: z.string().describe("Nombre del medicamento extraído"),
          dosage: z.string().optional().describe("Dosis, si está presente"),
        })
      )
      .describe("Lista de medicamentos detectados en la consulta"),
  }),
  execute: async ({ medications }) => {
    // Simulamos un delay de procesamiento
    await new Promise((res) => setTimeout(res, 1500));

    // Hacemos un "match" simulado con nuestra base de datos (ignorando mayúsculas)
    const matched = medications.map((med) => {
      const found = mockMedications.find((m) =>
        m.trade_name.toLowerCase().includes(med.trade_name.toLowerCase())
      );
      return {
        ...med,
        id: found?.id || `new_med_${Math.random()}`,
        is_known: !!found,
        db_info: found || null,
      };
    });

    return { matched };
  },
});

// Tool 2: Check interactions between medications
export const checkInteractionsTool = createTool({
  description:
    "Verifica si existe alguna contraindicación o interacción peligrosa entre una lista de medicamentos proporcionados. Usa esto SIEMPRE antes de recomendar la compra.",
  inputSchema: z.object({
    medication_ids: z
      .array(z.string())
      .describe("Los IDs de los medicamentos a cruzar"),
  }),
  execute: async ({ medication_ids }) => {
    await new Promise((res) => setTimeout(res, 1500));

    const foundInteractions = [];
    const allPairs = []; // Para poblar la tabla de compatibilidad

    // Cruzar todos los IDs entre sí contra la db de interacciones
    for (let i = 0; i < medication_ids.length; i++) {
      for (let j = i + 1; j < medication_ids.length; j++) {
        const idA = medication_ids[i];
        const idB = medication_ids[j];

        const interaction = mockInteractions.find(
          (int) =>
            (int.item_a_id === idA && int.item_b_id === idB) ||
            (int.item_a_id === idB && int.item_b_id === idA)
        );

        const medA = mockMedications.find(m => m.id === idA)?.trade_name || "Desconocido";
        const medB = mockMedications.find(m => m.id === idB)?.trade_name || "Desconocido";

        allPairs.push({
           medA,
           medB,
           status: interaction ? interaction.severity : "SAFE",
           warning_message: interaction ? interaction.warning_message : "Combinación segura",
        });

        if (interaction) {
          foundInteractions.push(interaction);
        }
      }
    }

    if (foundInteractions.length === 0) {
      return { status: "SAFE", interactions: [], pairs: allPairs };
    }

    const hasHighRisk = foundInteractions.some((i) => i.severity === "HIGH");

    return {
      status: hasHighRisk ? "DANGER" : "WARNING",
      interactions: foundInteractions,
      pairs: allPairs,
    };
  },
});

// Tool 3: Find availability in pharmacies
export const findPharmaciesTool = createTool({
  description: "Encuentra la disponibilidad y el stock de una lista de medicamentos en nuestras sucursales de farmacia.",
  inputSchema: z.object({
    medication_ids: z.array(z.string()).describe("Lista de IDs de los medicamentos a buscar"),
  }),
  execute: async ({ medication_ids }) => {
    await new Promise((res) => setTimeout(res, 1000));

    const results = mockPharmacies.map((pharm) => {
      // Buscar en el inventario para cada medicamento solicitado en esta farmacia
      let availableCount = 0;
      const items = medication_ids.map((medId) => {
        const inv = mockInventory.find(
          (i) => i.pharmacy_id === pharm.id && i.medication_id === medId
        );
        const name = mockMedications.find(m => m.id === medId)?.trade_name || medId;
        
        if (inv && (inv.stock_status === "IN_STOCK" || inv.stock_status === "LOW_STOCK")) {
          availableCount++;
        }
        
        return {
          medication_id: medId,
          name,
          status: inv ? inv.stock_status : "OUT_OF_STOCK",
        };
      });

      return {
        pharmacy: pharm,
        available_count: availableCount,
        total_requested: medication_ids.length,
        items,
      };
    });

    // Ordenar de mayor a menor disponibilidad
    results.sort((a, b) => b.available_count - a.available_count);

    return { results };
  },
});

export const aiTools = {
  showDetectedMedications: showDetectedMedicationsTool,
  checkInteractions: checkInteractionsTool,
  findPharmacies: findPharmaciesTool,
};
