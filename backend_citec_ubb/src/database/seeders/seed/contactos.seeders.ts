import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';
import { Contactos } from '../../models/contactos.model';

@Injectable()
export class ContactosSeeder {
    async run() {
        const archivocontactosPath = path.resolve(
            __dirname,
            '../archives/contactos.csv',
        );

        if (!fs.existsSync(archivocontactosPath)) {
            throw new Error(`Archivo no encontrado: ${archivocontactosPath}`);
        }

        const contactosExistentes = await Contactos.count();

        if (contactosExistentes > 0) {
            console.log('Los contactos ya están cargadas en la base de datos.');
            return;
        }

        const archivocontactos = fs.readFileSync(archivocontactosPath, 'utf-8');

        const contactos = parse(archivocontactos, {
            columns: true,
            skip_empty_lines: true,
        });

        await Contactos.bulkCreate(contactos, {
            validate: true,
            returning: false,
        });

        console.log('Contactos importados desde CSV exitosamente.');
    }
}
