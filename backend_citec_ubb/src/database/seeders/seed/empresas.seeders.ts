import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { Empresas } from '../../models/empresas.model';

@Injectable()
export class EmpresasSeeder {
    async run() {
        const archivoEmpresasPath = path.resolve(
            __dirname,
            '../archives/empresas.csv',
        );

        if (!fs.existsSync(archivoEmpresasPath)) {
            throw new Error(`Archivo no encontrado: ${archivoEmpresasPath}`);
        }

        const empresasExistentes = await Empresas.count();

        if (empresasExistentes > 0) {
            console.log('Las empresas ya están cargadas en la base de datos.');
            return;
        }

        const archivoEmpresas = fs.readFileSync(archivoEmpresasPath, 'utf-8');

        const empresas = parse(archivoEmpresas, {
            columns: true,
            skip_empty_lines: true,
        });

        await Empresas.bulkCreate(empresas, {
            validate: true,
            returning: false,
        });

        console.log('Empresas importadas desde CSV exitosamente.');
    }
}
