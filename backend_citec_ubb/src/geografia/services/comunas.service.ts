import { Injectable, NotFoundException } from '@nestjs/common';
import { Comunas } from '../../database/models/comunas.model';
import { BaseServicesSimple } from 'src/common/base/base-services-simple.class';
import { ObtenerPorIdComunasDto } from '../dtos/comunas.dto';

@Injectable()
export class ComunasService extends BaseServicesSimple {
    async obtenerTodos(): Promise<Comunas[]> {
        return await Comunas.findAll();
    }

    async obtenerPorId(
        clavePrimaria: ObtenerPorIdComunasDto,
    ): Promise<Comunas> {
        const comuna = await Comunas.findByPk(clavePrimaria.id);

        if (!comuna) {
            throw new NotFoundException([
                `No se encontró la comuna con id ${clavePrimaria.id}`,
            ]);
        }

        return comuna;
    }
}
