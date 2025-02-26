import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import { parse } from "csv-parse/sync";
import * as path from "path";
import InfoGralDocumentosModel from "src/database/models/info-gral-documento.model";

@Injectable()
export class InfoGralDocumentosSeeder {
    async run() {
        const archivoDocumentosPath = path.resolve(
            __dirname,
            '../archives/info-gral-documentos.csv',
        );

        if (!fs.existsSync(archivoDocumentosPath)) {
            throw new Error(`Archivo no encontrado: ${archivoDocumentosPath}`);
        }

        const infoExistente = InfoGralDocumentosModel.count();

        if (await infoExistente > 0) {
            console.log('La informacion general de los documentos ya están cargados en la base de datos.');
            return;
        }

        const archivoDocumentos = fs.readFileSync(archivoDocumentosPath, 'utf-8');

        const documentos = parse(archivoDocumentos, {
            columns: true,
            skip_empty_lines: true,
        });

        await InfoGralDocumentosModel.bulkCreate(documentos, {
            validate: true,
            returning: false,
        });

        console.log('Informacion general de los documentos importados desde CSV exitosamente.');
    }
}