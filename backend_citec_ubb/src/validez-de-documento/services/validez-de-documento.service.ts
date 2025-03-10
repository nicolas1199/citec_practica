import { Injectable, NotFoundException } from '@nestjs/common';
import { ObtenerPorIdValidezDto } from '../dto/create-validez-de-documento.dto';
import { BaseServicesSimple } from 'src/common/base/base-services-simple.class';
import ValidezDocumentos from 'src/database/models/validez-documento.model';

@Injectable()
export class ValidezDeDocumentoService extends BaseServicesSimple {
    async obtenerTodos(): Promise<ValidezDocumentos[]> {
        const retornoTipos = await ValidezDocumentos.findAll();

        if (retornoTipos.length === 0) {
            throw new NotFoundException([`No hay tipos de usuario activos`]);
        }

        return retornoTipos;
    }
    async obtenerPorId(
        clavePrimaria: ObtenerPorIdValidezDto,
    ): Promise<ValidezDocumentos> {
        const retornoEstado = await ValidezDocumentos.findByPk(
            clavePrimaria.nombre,
        );

        if (!retornoEstado) {
            throw new NotFoundException([
                `No existe el tipo de usuario con el nombre ${clavePrimaria.nombre}`,
            ]);
        }
        return retornoEstado;
    }
}
