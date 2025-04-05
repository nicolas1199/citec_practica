import { Injectable } from '@nestjs/common';
import { Usuarios } from '../../models/usuarios.model';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { parse } from 'csv-parse/sync';
import * as path from 'path';

@Injectable()
export class UsuariosSeeder {
    async run() {
        const archivoUsuariosPath = path.resolve(
            __dirname,
            '../archives/usuarios.csv',
        );

        if (!fs.existsSync(archivoUsuariosPath)) {
            throw new Error(`Archivo no encontrado: ${archivoUsuariosPath}`);
        }

        const usuariosExistentes = await Usuarios.count();

        if (usuariosExistentes > 0) {
            console.log('Los usuarios ya están cargados en la base de datos.');
            return;
        }

        const archivoUsuarios = fs.readFileSync(archivoUsuariosPath, 'utf-8');

        const usuarios = parse(archivoUsuarios, {
            columns: true,
            skip_empty_lines: true,
        });

        await Usuarios.bulkCreate(usuarios, {
            validate: true,
            returning: false,
        });

        console.log('Usuarios importados desde CSV exitosamente.');
    }

    /**
     * Método para crear un usuario de prueba
     * Solo se ejecuta en desarrollo
     */
    async seed() {
        if (process.env.NODE_ENV !== 'prod') {
            // Buscar directamente usando el modelo
            const testUser = await Usuarios.findOne({
                where: { email: 'prueba@gmail.com' },
            });

            if (!testUser) {
                // Crear directamente usando el modelo
                await Usuarios.create({
                    email: 'prueba@gmail.com',
                    nombre: 'Prueba',
                    apellido: 'Prueba',
                    contraseña: await bcrypt.hash('prueba', 10),
                    nombre_tipos: 'ADMINISTRADOR',
                });
            }
        }
    }
}
