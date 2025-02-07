import { Injectable, NotFoundException } from '@nestjs/common';
import { Tipos } from '../../database/models/tipos.model';
import { ObtenerPorIdTiposDto } from '../dtos/tipos.dto';
import { BaseServicesSimple } from '../../common/base/base-services-simple.class';

@Injectable()
export class TiposService extends BaseServicesSimple {
    async obtenerTodos(): Promise<Tipos[]> {
        const retornoTipos = await Tipos.findAll();

        if (retornoTipos.length === 0) {
            throw new NotFoundException([`No hay tipos de usuario activos`]);
        }

        return retornoTipos;
    }

    async obtenerPorId(clavePrimaria: ObtenerPorIdTiposDto): Promise<Tipos> {
        const retornoTipo = await Tipos.findByPk(clavePrimaria.nombre);

        if (!retornoTipo) {
            throw new NotFoundException([
                `No existe el tipo de usuario con el nombre ${clavePrimaria.nombre}`,
            ]);
        }

        return retornoTipo;
    }
}
