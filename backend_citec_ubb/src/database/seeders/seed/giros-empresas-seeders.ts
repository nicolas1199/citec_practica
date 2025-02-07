import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { GirosEmpresas } from '../../models/giros-empresas.model';

@Injectable()
export class GirosEmpresasSeeder {
    async run() {
        const archivosEmpresasGirosPath = path.resolve(
            __dirname,
            '../archives/giros_empresas.csv',
        );

        if (!fs.existsSync(archivosEmpresasGirosPath)) {
            throw new Error(
                `Archivo no encontrado: ${archivosEmpresasGirosPath}`,
            );
        }

        const empresasExistentes = await GirosEmpresas.count();

        if (empresasExistentes > 0) {
            console.log(
                'Los giros de las empresas ya están cargadas en la base de datos.',
            );
            return;
        }

        const archivosEmpresasGiros = fs.readFileSync(
            archivosEmpresasGirosPath,
            'utf-8',
        );

        const empresas = parse(archivosEmpresasGiros, {
            columns: true,
            skip_empty_lines: true,
        });

        await GirosEmpresas.bulkCreate(empresas, {
            validate: true,
            returning: false,
        });

        console.log('Giros Empresas importadas desde CSV exitosamente.');
    }
}
