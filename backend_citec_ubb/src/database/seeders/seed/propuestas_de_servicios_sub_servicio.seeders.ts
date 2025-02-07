import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { PropuestaDeServicioSubServicios } from '../../../database/models/propuesta-de-servicio-sub-servicios.model';

@Injectable()
export class PropuestasDeServiciosSubServicioSeeder {
    async run() {
        const archivoPath = path.resolve(
            __dirname,
            '../archives/propuestas_de_servicios_sub_servicio.csv',
        );

        if (!fs.existsSync(archivoPath)) {
            throw new Error(`Archivo no encontrado: ${archivoPath}`);
        }

        const existentes = await PropuestaDeServicioSubServicios.count();

        if (existentes > 0) {
            console.log(
                'Los PropuestaDeServicioSubServicios ya están cargados en la base de datos.',
            );
            return;
        }

        const archivoGiros = fs.readFileSync(archivoPath, 'utf-8');

        const propuestas = parse(archivoGiros, {
            columns: true,
            skip_empty_lines: true,
        });

        await PropuestaDeServicioSubServicios.bulkCreate(propuestas, {
            validate: true,
            returning: false,
        });

        console.log(
            'PropuestaDeServicioSubServicios importados desde CSV exitosamente.',
        );
    }
}
