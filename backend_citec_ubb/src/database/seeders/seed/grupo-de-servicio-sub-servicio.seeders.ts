import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { GrupoDeServicioSubServicios } from '../../../database/models/grupo-de-servicio-sub-servicios.model';

@Injectable()
export class GrupoDeServiciosSubServiciosSeeder {
    async run() {
        const archivoGirosPath = path.resolve(
            __dirname,
            '../archives/grupo_de_servicio_sub_servicios.csv',
        );

        if (!fs.existsSync(archivoGirosPath)) {
            throw new Error(`Archivo no encontrado: ${archivoGirosPath}`);
        }

        const girosExistentes = await GrupoDeServicioSubServicios.count();

        if (girosExistentes > 0) {
            console.log(
                'Los GrupoDeServicioSubServicios ya están cargados en la base de datos.',
            );
            return;
        }

        const archivoGiros = fs.readFileSync(archivoGirosPath, 'utf-8');

        const giros = parse(archivoGiros, {
            columns: true,
            skip_empty_lines: true,
        });

        await GrupoDeServicioSubServicios.bulkCreate(giros, {
            validate: true,
            returning: false,
        });

        console.log(
            'GrupoDeServicioSubServicios importados desde CSV exitosamente.',
        );
    }
}
