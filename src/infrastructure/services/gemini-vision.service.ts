import { GoogleGenAI } from '@google/genai';
import { IAIVisionPort } from '@domain/ports/ai-vision.port';
import { BillItem } from '@domain/entities/bill-item.entity';
import { envs } from '@infrastructure/config/env';

export class GeminiVisionService implements IAIVisionPort {
  private readonly ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: envs.GEMINI_API_KEY });
  }

  async extractBillData(imageBuffer: Buffer, mimeType: string): Promise<Partial<BillItem>[]> {
    const prompt = `
      Eres un asistente experto en analizar tickets de compra y extraer sus ítems.
      Analiza la imagen adjunta correspondiente a un ticket o factura de compra.
      
      Debes identificar todos los productos y devolver estrictamente un arreglo JSON (array de objetos) donde cada objeto represente un ítem del ticket, adaptándose a la siguiente estructura exacta:
      
      [
        {
          "quantity": number (cantidad comprada, si no dice asume 1),
          "netPrice": number (precio total del ítem pagado, no el precio unitario, sino el precio final cobrado en esa línea),
          "netUnit": string (usar estrictamente uno de estos valores: "kg", "unit", "gr", "lt". Si es unidad usar "unit"),
          "idProduct": 0 (envía siempre 0, es obligatorio)
        }
      ]
      
      IMPORTANTE:
      - Devuelve ÚNICAMENTE el JSON.
      - No incluyas bloques de código markdown (\`\`\`json).
      - No agregues ningún texto, explicaciones, ni etiquetas de inicio/fin.
      - El objeto raíz debe ser obligatoriamente el arreglo JSON [].
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
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

    if (!aiResponseText) {
      throw new Error('Gemini API did not return any text.');
    }

    try {
      // Limpieza por si acaso Gemini incluyó algo de markdown a pesar de responseMimeType
      const cleanJsonString = aiResponseText.replace(/```json|```/g, '').trim();
      const extractedItems: Partial<BillItem>[] = JSON.parse(cleanJsonString);
      return extractedItems;
    } catch (error) {
      console.error('Error parsing JSON from Gemini AI:', aiResponseText);
      throw new Error('La respuesta de la IA no es un JSON válido.');
    }
  }
}
