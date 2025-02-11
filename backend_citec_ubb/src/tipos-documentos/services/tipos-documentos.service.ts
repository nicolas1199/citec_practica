import { Injectable, NotFoundException } from '@nestjs/common';
import { ObtenerPorIdTiposDto } from '../dtos/tipos-documentos.dto';
import { BaseServicesSimple } from '../../common/base/base-services-simple.class';
import { TiposDocumentos } from 'src/database/models/tipo-documento.model';

@Injectable()
export class TiposDocumentosService extends BaseServicesSimple {
    async obtenerTodos(): Promise<TiposDocumentos[]> {
        const retornoTipos = await TiposDocumentos.findAll();

        if (retornoTipos.length === 0) {
            throw new NotFoundException([`No hay tipos de documentos activos`]);
        }

        return retornoTipos;
    }

    async obtenerPorId(clavePrimaria: ObtenerPorIdTiposDto): Promise<TiposDocumentos> {
        const retornoTipo = await TiposDocumentos.findByPk(clavePrimaria.nombre);

        if (!retornoTipo) {
            throw new NotFoundException([
                `No existe el tipo de usuario con el nombre ${clavePrimaria.nombre}`,
            ]);
        }

        return retornoTipo;
    }
}
