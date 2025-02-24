import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import { parse } from "csv-parse/sync";
import * as path from "path";
import ValidezDocumentos from "src/database/models/validez-documento.model";

@Injectable()
export class ValidezDocumentosSeeder {
    async run() {
        const archivoValidezDocumentosPath = path.resolve(
            __dirname,
            '../archives/validez_de_documento.csv',
        );

        if (!fs.existsSync(archivoValidezDocumentosPath)) {
            throw new Error(`Archivo no encontrado: ${archivoValidezDocumentosPath}`);
        }

        const areaDocumentosExistentes = await ValidezDocumentos.count();

        if (areaDocumentosExistentes > 0) {
            console.log('Los estados de validez ya están cargadas en la base de datos.');
            return;
        }

        const archivoValidezDocumentos = fs.readFileSync(archivoValidezDocumentosPath, 'utf-8');

        const areaDocumentos = parse(archivoValidezDocumentos, {
            columns: true,
            skip_empty_lines: true,
        });

        await ValidezDocumentos.bulkCreate(areaDocumentos, {
            validate: true,
            returning: false,
        });

        console.log('Estados de validez importados desde CSV exitosamente.');
    }
}