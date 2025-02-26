import { Injectable } from "@nestjs/common";
import { DocumentosModel } from "../../models/documentos.model";
import * as fs from 'fs';
import { parse } from "csv-parse/sync";
import * as path from "path";

@Injectable()
export class DocumentosSeeder {
    async run() {
        const archivoDocumentosPath = path.resolve(
            __dirname,
            '../archives/documentos.csv',
        );

        if (!fs.existsSync(archivoDocumentosPath)) {
            throw new Error(`Archivo no encontrado: ${archivoDocumentosPath}`);
        }

        const documentosExistentes = await DocumentosModel.count();

        if (documentosExistentes > 0) {
            console.log('Los documentos ya están cargados en la base de datos.');
            return;
        }

        const archivoDocumentos = fs.readFileSync(archivoDocumentosPath, 'utf-8');

        const documentos = parse(archivoDocumentos, {
            columns: true,
            skip_empty_lines: true,
        });

        await DocumentosModel.bulkCreate(documentos, {
            validate: true,
            returning: false,
        });

        console.log('DocumentosModel importados desde CSV exitosamente.');
    }
}