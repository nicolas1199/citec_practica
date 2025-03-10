import { Injectable } from '@nestjs/common';
import { VALIDEZ_DE_DOCUMENTO } from 'src/common/constants/validez-de-documento.constants';
import ValidezDocumentos from '../models/validez-documento.model';

@Injectable()
export class ValidezDocumentosSeeder {
    async seed() {
        // Verificar si ya existen los registros
        const count = await ValidezDocumentos.count();

        // Si ya hay registros, no hacemos nada
        if (count > 0) {
            console.log('La tabla de validez de documentos ya tiene datos');
            return;
        }

        // Crear los registros necesarios
        const valoresValidez = Object.values(VALIDEZ_DE_DOCUMENTO);

        for (const valor of valoresValidez) {
            await ValidezDocumentos.create({
                nombre: valor,
                descripcion: `Validez de documento: ${valor}`,
            });
            console.log(`Creado valor de validez: ${valor}`);
        }

        console.log('Seeder de validez de documentos completado');
    }
}
