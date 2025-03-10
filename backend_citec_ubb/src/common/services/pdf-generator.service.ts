import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfGeneratorService {
    /**
     * Genera un PDF a partir de contenido HTML
     * @param htmlContent Contenido HTML a convertir en PDF
     * @param options Opciones adicionales para la generación del PDF
     * @returns Buffer con el contenido del PDF
     */
    async generatePdfFromHtml(
        htmlContent: string,
        options?: {
            headerTemplate?: string;
            footerTemplate?: string;
            title?: string;
            landscape?: boolean;
            format?: string;
            margin?: {
                top?: string;
                right?: string;
                bottom?: string;
                left?: string;
            };
        },
    ): Promise<Buffer> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        // Establecer el contenido HTML en la página
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
        });

        // Definir formato como tipo de papel permitido
        const paperFormat = options?.format || 'A4';

        // Generar el PDF
        const pdfBuffer = await page.pdf({
            format: paperFormat as puppeteer.PaperFormat,
            printBackground: true,
            margin: options?.margin || {
                top: '2cm',
                right: '2cm',
                bottom: '2cm',
                left: '2cm',
            },
            headerTemplate: options?.headerTemplate || '',
            footerTemplate: options?.footerTemplate || '',
            displayHeaderFooter: !!(
                options?.headerTemplate || options?.footerTemplate
            ),
            landscape: options?.landscape || false,
        });

        await browser.close();

        // Convertir Uint8Array a Buffer
        return Buffer.from(pdfBuffer);
    }

    /**
     * Guarda el PDF en un archivo temporal
     * @param pdfBuffer Buffer del PDF
     * @param customFileName Nombre personalizado del archivo (opcional)
     * @returns Ruta del archivo guardado
     */
    async savePdfToFile(
        pdfBuffer: Buffer,
        customFileName?: string,
    ): Promise<string> {
        const uploadsDir = path.join(process.cwd(), 'uploads', 'temp');

        // Asegurarse de que el directorio existe
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Usar nombre personalizado si se proporciona, de lo contrario generar uno aleatorio
        const fileName =
            customFileName ||
            `${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
        const filePath = path.join(uploadsDir, fileName);

        await fs.promises.writeFile(filePath, pdfBuffer);
        return filePath;
    }

    /**
     * Aplica un estilo CSS estándar a un fragmento de HTML
     * @param htmlFragment Fragmento HTML a estilizar
     * @param title Título del documento
     * @returns HTML completo con estilos
     */
    applyDefaultStyles(htmlFragment: string, title?: string): string {
        return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title || 'Informe CITEC UBB'}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #003366;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
          }
          h2 {
            font-size: 20px;
            margin-top: 25px;
            margin-bottom: 15px;
            color: #003366;
          }
          h3 {
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 10px;
            color: #004080;
          }
          p {
            margin-bottom: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          .page-break {
            page-break-after: always;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header img {
            max-height: 80px;
          }
          .text-center {
            text-align: center;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="text-center">INFORME TÉCNICO</h1>
          <h2 class="text-center">${title || ''}</h2>
        </div>
        ${htmlFragment}
        <div class="footer">
          <p>CITEC UBB - Centro de Investigación en Tecnologías de la Construcción</p>
          <p>Universidad del Bío-Bío</p>
        </div>
      </body>
      </html>
    `;
    }
}
