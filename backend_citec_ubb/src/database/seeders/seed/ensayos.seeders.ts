import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { Ensayos } from '../../models/ensayos.model';

@Injectable()
export class EnsayosSeeder {
    async run() {
        const archivoPath = path.resolve(
            __dirname,
            '../archives/ensayos.csv',
        );

        if (!fs.existsSync(archivoPath)) {
            throw new Error(`Archivo no encontrado: ${archivoPath}`);
        }

        const existentes = await Ensayos.count();

        if (existentes > 0) {
            console.log(
                'Los ensayos ya están cargados en la base de datos.',
            );
            return;
        }

        const archivoGiros = fs.readFileSync(archivoPath, 'utf-8');

        const propuestas = parse(archivoGiros, {
            columns: true,
            skip_empty_lines: true,
        });

        await Ensayos.bulkCreate(propuestas, {
            validate: true,
            returning: false,
        });

        console.log('Ensayos importados desde CSV exitosamente.');
    }
}
