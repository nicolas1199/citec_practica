import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { Regiones } from '../../models/regiones.model';

@Injectable()
export class RegionesSeeder {
    async run() {
        const archivoRegionesPath = path.resolve(
            __dirname,
            '../archives/regiones.csv',
        );

        if (!fs.existsSync(archivoRegionesPath)) {
            throw new Error(`Archivo no encontrado: ${archivoRegionesPath}`);
        }

        const regionesExistentes = await Regiones.count();

        if (regionesExistentes > 0) {
            console.log('Las regiones ya están cargadas en la base de datos.');
            return;
        }

        const archivoRegiones = fs.readFileSync(archivoRegionesPath, 'utf-8');

        const regiones = parse(archivoRegiones, {
            columns: true,
            skip_empty_lines: true,
        });

        await Regiones.bulkCreate(regiones, {
            validate: true,
            returning: false,
        });

        console.log('Regiones importadas desde CSV exitosamente.');
    }
}
