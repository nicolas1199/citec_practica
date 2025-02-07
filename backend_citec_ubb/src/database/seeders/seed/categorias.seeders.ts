import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { Categorias } from '../../../database/models/categorias.model';

@Injectable()
export class CategoriasSeeder {
    async run() {
        const archivoCategoriasPath = path.resolve(
            __dirname,
            '../archives/categorias.csv',
        );

        if (!fs.existsSync(archivoCategoriasPath)) {
            throw new Error(`Archivo no encontrado: ${archivoCategoriasPath}`);
        }

        const categoriasExistentes = await Categorias.count();

        if (categoriasExistentes > 0) {
            console.log(
                'Las categorías ya están cargadas en la base de datos.',
            );
            return;
        }

        const archivoCategorias = fs.readFileSync(
            archivoCategoriasPath,
            'utf-8',
        );

        const categorias = parse(archivoCategorias, {
            columns: true,
            skip_empty_lines: true,
        });

        await Categorias.bulkCreate(categorias, {
            validate: true,
            returning: false,
        });

        console.log('Categorías importadas desde CSV exitosamente.');
    }
}
