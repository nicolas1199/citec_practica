import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { Giros } from '../../../database/models/giros.model';

@Injectable()
export class GirosSeeder {
    async run() {
        const archivoGirosPath = path.resolve(
            __dirname,
            '../archives/giros.csv',
        );

        if (!fs.existsSync(archivoGirosPath)) {
            throw new Error(`Archivo no encontrado: ${archivoGirosPath}`);
        }

        const girosExistentes = await Giros.count();

        if (girosExistentes > 0) {
            console.log('Los giros ya están cargados en la base de datos.');
            return;
        }

        const archivoGiros = fs.readFileSync(archivoGirosPath, 'utf-8');

        const giros = parse(archivoGiros, {
            columns: true,
            skip_empty_lines: true,
        });

        await Giros.bulkCreate(giros, {
            validate: true,
            returning: false,
        });

        console.log('Giros importados desde CSV exitosamente.');
    }
}
