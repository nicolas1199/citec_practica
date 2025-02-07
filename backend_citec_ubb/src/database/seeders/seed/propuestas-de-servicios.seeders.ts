import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { PropuestasDeServicios } from '../../../database/models/propuestas-de-servicios.model';

@Injectable()
export class PropuestasDeServiciosSeeder {
    async run() {
        const archivoPath = path.resolve(
            __dirname,
            '../archives/propuestas_de_servicios.csv',
        );

        if (!fs.existsSync(archivoPath)) {
            throw new Error(`Archivo no encontrado: ${archivoPath}`);
        }

        const existentes = await PropuestasDeServicios.count();

        if (existentes > 0) {
            console.log(
                'Las propuestas de servicios ya están cargados en la base de datos.',
            );
            return;
        }

        const archivoGiros = fs.readFileSync(archivoPath, 'utf-8');

        const propuestas = parse(archivoGiros, {
            columns: true,
            skip_empty_lines: true,
        });

        await PropuestasDeServicios.bulkCreate(propuestas, {
            validate: true,
            returning: false,
        });

        console.log(
            'Propuestas de servicios importados desde CSV exitosamente.',
        );
    }
}
