import { GoogleGenAI } from '@google/genai';
import { IAIVisionPort } from '@domain/ports/ai-vision.port';
import { ExtractedBillDataDTO } from '@domain/dtos/extracted-bill-data.dto';
import { ItemReferenceDTO } from '@domain/dtos/item-reference.dto';
import { envs } from '@infrastructure/config/env';
import { logger } from '@infrastructure/logging/logger.config';

export class GeminiVisionService implements IAIVisionPort {
  private readonly ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: envs.GEMINI_API_KEY });
  }

  async extractBillData(
    imageBuffer: Buffer,
    mimeType: string,
    categories: ItemReferenceDTO[],
    brands: ItemReferenceDTO[],
    aiInstructions?: string,
  ): Promise<ExtractedBillDataDTO> {
    logger.info('Iniciando el procesamiento de imagen con Gemini AI...');

    const categoriesJson = JSON.stringify(categories, null, 2);
    const brandsJson = JSON.stringify(brands, null, 2);

    let basePrompt = `
      Eres un asistente experto en analizar tickets de compra y extraer datos.
      Analiza la imagen adjunta correspondiente a un ticket o factura de compra.
      
      Tenemos la siguiente lista de categorías disponibles en nuestra base de datos:
      ${categoriesJson}

      Y la siguiente lista de marcas disponibles en nuestra base de datos:
      ${brandsJson}

      Debes identificar el negocio (shop) y todos los productos adquiridos, devolviendo estrictamente un JSON con la siguiente estructura exacta:
      
      {
        "receipt_number": string | null (Busca el N° de Ticket, Factura o Comprobante impreso. Devuelve solo el número o serie, o null si es ilegible),
        "items": [
          {
            "alias_name": string (el nombre literal como aparece impreso en el ticket),
            "suggested_name": string (un nombre genérico y limpio propuesto para este producto, fácil de leer),
            "quantity": number (cantidad comprada, intentar extraer del ticket o asumir 1),
            "net_unit": string (usar estrictamente uno de estos valores: "u", "g", "kg", "l", "ml". Si es unidad usar "u"),
            "content_value": number | null (valor de contenido si lo dice ej. 500, sino null),
            "net_price": number (precio total del ítem pagado, el neto sumado, no unitario),
            "id_category": number | null (encuentra la mejor categoría de la lista. Si NO hay ninguna que encaje, devuelve null),
            "suggested_category": string | null (si id_category es null, sugiere un nombre corto y descriptivo para la categoría nueva, sino null),
            "id_brand": number | null (encuentra la mejor marca de la lista. Si NO hay ninguna que encaje, devuelve null),
            "suggested_brand": string | null (si id_brand es null, sugiere el nombre de la marca basándote en el nombre original del ticket, sino null),
            "match_status": string (por defecto devuelve "NEW")
          }
        ]
      }
      
      IMPORTANTE:
      - Devuelve ÚNICAMENTE el JSON puro.
      - No incluyas bloques de código markdown (\`\`\`json).
      - El objeto raíz debe ser obligatoriamente el formato JSON descrito arriba {...}.
    `;

    if (aiInstructions) {
      // Sanitizar la instrucción del usuario: limitar a 300 caracteres y escapar comillas
      const sanitizedInstructions = aiInstructions.trim().substring(0, 300).replace(/"/g, "'");
      logger.info('Instrucciones extra provistas para la IA:', { instructions: sanitizedInstructions });
      
      basePrompt += `\n\nINSTRUCCIONES EXTRA ESPECÍFICAS DEL USUARIO PARA ESTA IMAGEN:\n- ${sanitizedInstructions}`;
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: basePrompt },
            {
              inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const aiResponseText = response.text;

    logger.info('Respuesta de Gemini AI:', { result: aiResponseText });

    if (!aiResponseText) {
      throw new Error('Gemini API did not return any text.');
    }

    try {
      // Limpieza por si acaso Gemini incluyó algo de markdown a pesar de responseMimeType
      const cleanJsonString = aiResponseText.replace(/```json|```/g, '').trim();
      const extractedData: ExtractedBillDataDTO = JSON.parse(cleanJsonString);
      return extractedData;
    } catch (error) {
      logger.error('Error parsing JSON from Gemini AI:', { result: aiResponseText });
      throw new Error('La respuesta de la IA no es un JSON válido.');
    }
  }
}
