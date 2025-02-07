import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { Comunas } from '../../models/comunas.model';

@Injectable()
export class ComunasSeeder {
    async run() {
        const archivoComunasPath = path.resolve(
            __dirname,
            '../archives/comunas.csv',
        );

        if (!fs.existsSync(archivoComunasPath)) {
            throw new Error(`Archivo no encontrado: ${archivoComunasPath}`);
        }

        const comunasExistentes = await Comunas.count();

        if (comunasExistentes > 0) {
            console.log('Las comunas ya están cargadas en la base de datos.');
            return;
        }

        const archivoComunas = fs.readFileSync(archivoComunasPath, 'utf-8');

        const comunas = parse(archivoComunas, {
            columns: true,
            skip_empty_lines: true,
        });

        // Usar bulkCreate para inserción masiva más rápida
        await Comunas.bulkCreate(comunas, {
            validate: true,
            returning: false,
        });

        console.log('Comunas importadas desde CSV exitosamente.');
    }
}
