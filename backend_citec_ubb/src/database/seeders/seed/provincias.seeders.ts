import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { Provincias } from '../../models/provincias.model';

@Injectable()
export class ProvinciasSeeder {
    async run() {
        const archivoProvinciasPath = path.resolve(
            __dirname,
            '../archives/provincias.csv',
        );

        if (!fs.existsSync(archivoProvinciasPath)) {
            throw new Error(`Archivo no encontrado: ${archivoProvinciasPath}`);
        }

        const provinciasExistentes = await Provincias.count();

        if (provinciasExistentes > 0) {
            console.log(
                'Las provincias ya están cargadas en la base de datos.',
            );
            return;
        }

        const archivoProvincias = fs.readFileSync(
            archivoProvinciasPath,
            'utf-8',
        );

        const provincias = parse(archivoProvincias, {
            columns: true,
            skip_empty_lines: true,
        });

        await Provincias.bulkCreate(provincias, {
            validate: true,
            returning: false,
        });
        console.log('Provincias importadas desde CSV exitosamente.');
    }
}
