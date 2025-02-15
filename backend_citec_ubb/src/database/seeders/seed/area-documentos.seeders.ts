import { Injectable } from "@nestjs/common";
import { AreasDocumentos } from "src/database/models/area-documento.model";
import * as fs from 'fs';
import { parse } from "csv-parse/sync";
import * as path from "path";

@Injectable()
export class AreasDocumentosSeeder {
    async run() {
        const archivoAreasDocumentosPath = path.resolve(
            __dirname,
            '../archives/area-documentos.csv',
        );

        if (!fs.existsSync(archivoAreasDocumentosPath)) {
            throw new Error(`Archivo no encontrado: ${archivoAreasDocumentosPath}`);
        }

        const areaDocumentosExistentes = await AreasDocumentos.count();

        if (areaDocumentosExistentes > 0) {
            console.log('Los codigos de area ya están cargadas en la base de datos.');
            return;
        }

        const archivoAreasDocumentos = fs.readFileSync(archivoAreasDocumentosPath, 'utf-8');

        const areaDocumentos = parse(archivoAreasDocumentos, {
            columns: true,
            skip_empty_lines: true,
        });

        await AreasDocumentos.bulkCreate(areaDocumentos, {
            validate: true,
            returning: false,
        });

        console.log('Areas importadas desde CSV exitosamente.');
    }
}