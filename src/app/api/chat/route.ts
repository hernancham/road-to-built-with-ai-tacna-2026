import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage, stepCountIs } from "ai";
import { aiTools } from "@/lib/ai/tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Convertimos a CoreMessage
  const coreMessages = await convertToModelMessages(messages);

  // Mapeamos y arreglamos los data: URL porque el Polyfill de fetch de Next.js
  // (o Undici en Node 18) falla con TypeError: URL scheme must be http or https
  // cuando el AI SDK intenta descargar la imagen.
  for (const message of coreMessages) {
    if (typeof message.content !== "string" && Array.isArray(message.content)) {
      for (let i = 0; i < message.content.length; i++) {
        const part = message.content[i];
        if (part.type === "image") {
          let urlStr = "";
          if (part.image instanceof URL) {
            urlStr = part.image.toString();
          } else if (typeof part.image === "string") {
            urlStr = part.image;
          }

          if (urlStr.startsWith("data:")) {
            const base64Data = urlStr.split(",")[1];
            part.image = Buffer.from(base64Data, "base64");
          }
        } else if (part.type === "file") {
          let urlStr = "";
          if (part.data instanceof URL) {
            urlStr = part.data.toString();
          } else if (typeof part.data === "string") {
            urlStr = part.data;
          }
          if (urlStr.startsWith("data:")) {
            const base64Data = urlStr.split(",")[1];
            part.data = Buffer.from(base64Data, "base64");
          }
        }
      }
    }
  }

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system:
      "Eres un asistente farmacéutico experto (FarmaGuard/GoodPills) creado para prevenir interacciones medicamentosas apoyando al farmacéutico o al paciente. \n" +
      "Cuando el usuario suba una receta médica (en foto) o te describa sus medicamentos, tu deber PRIMORDIAL es:\n" +
      "1. Extraer los nombres de los medicamentos usando la herramienta `showDetectedMedications` para mostrársela en la interfaz interactiva.\n" +
      "2. Esperar su confirmación. Si el usuario pide añadir/quitar algo, actualízalo usando de nuevo tu herramienta.\n" +
      "3. JAMÁS recomiendes o finalices sin antes usar `checkInteractions` con los IDs de los medicamentos para ver si hay riesgo de muerte o interacción grave.\n" +
      "4. Usa `findPharmacies` para verificar disponibilidad en sucursales en base a su necesidad validada, luego muestra esa información.\n" +
      "Habla siempre de forma empática, profesional y concisa (estás en la interfaz de un chat). NO adivines interacciones, confía EXCLUSIVAMENTE en lo que devuelva la herramienta `checkInteractions`.",
    messages: coreMessages,
    tools: aiTools,
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}


