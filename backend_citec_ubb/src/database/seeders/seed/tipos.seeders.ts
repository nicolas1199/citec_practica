import { Injectable } from '@nestjs/common';
import { Tipos } from '../../models/tipos.model';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';

@Injectable()
export class TiposSeeder {
    async run() {
        const archivoTiposPath = path.resolve(
            __dirname,
            '../archives/tipos.csv',
        );

        if (!fs.existsSync(archivoTiposPath)) {
            throw new Error(`Archivo no encontrado: ${archivoTiposPath}`);
        }

        const tiposExistentes = await Tipos.count();

        if (tiposExistentes > 0) {
            console.log('Los tipos ya están cargados en la base de datos.');
            return;
        }

        const archivoTipos = fs.readFileSync(archivoTiposPath, 'utf-8');

        const tipos = parse(archivoTipos, {
            columns: true,
            skip_empty_lines: true,
        });

        await Tipos.bulkCreate(tipos, {
            validate: true,
            returning: false,
        });

        console.log('Tipos importados desde CSV exitosamente.');
    }
}
