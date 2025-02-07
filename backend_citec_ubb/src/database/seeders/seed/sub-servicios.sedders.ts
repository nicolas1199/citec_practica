import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { SubServicios } from '../../../database/models/sub-servicios.model';

@Injectable()
export class SubServiciosSeeder {
    async run() {
        const archivoPath = path.resolve(
            __dirname,
            '../archives/sub_servicios.csv',
        );

        if (!fs.existsSync(archivoPath)) {
            throw new Error(`Archivo no encontrado: ${archivoPath}`);
        }

        const existentes = await SubServicios.count();

        if (existentes > 0) {
            console.log(
                'Los subservicios ya están cargados en la base de datos.',
            );
            return;
        }

        const archivoGiros = fs.readFileSync(archivoPath, 'utf-8');

        const propuestas = parse(archivoGiros, {
            columns: true,
            skip_empty_lines: true,
        });

        await SubServicios.bulkCreate(propuestas, {
            validate: true,
            returning: false,
        });

        console.log('Subservicios importados desde CSV exitosamente.');
    }
}
