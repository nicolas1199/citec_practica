import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { GruposDeServicios } from '../../models/grupos-de-servicios.model';

@Injectable()
export class GruposDeServiciosSeeder {
    async run() {
        const archivoPath = path.resolve(
            __dirname,
            '../archives/grupos_de_servicios.csv',
        );

        if (!fs.existsSync(archivoPath)) {
            throw new Error(`Archivo no encontrado: ${archivoPath}`);
        }

        const existentes = await GruposDeServicios.count();

        if (existentes > 0) {
            console.log(
                'Los Grupos de servicios ya están cargados en la base de datos.',
            );
            return;
        }

        const archivoGiros = fs.readFileSync(archivoPath, 'utf-8');

        const propuestas = parse(archivoGiros, {
            columns: true,
            skip_empty_lines: true,
        });

        await GruposDeServicios.bulkCreate(propuestas, {
            validate: true,
            returning: false,
        });

        console.log('Grupos de servicios importados desde CSV exitosamente.');
    }
}
