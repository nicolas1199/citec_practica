import { Injectable, NotFoundException } from '@nestjs/common';
import { Regiones } from 'src/database/models/regiones.model';
import { BaseServicesSimple } from '../../common/base/base-services-simple.class';
import { ObtenerPorIdRegionesDto } from '../dtos/regiones.dto';

@Injectable()
export class RegionesService extends BaseServicesSimple {
    async obtenerTodos(): Promise<Regiones[]> {
        return await Regiones.findAll();
    }

    async obtenerPorId(
        clavePrimaria: ObtenerPorIdRegionesDto,
    ): Promise<Regiones> {
        const region = await Regiones.findByPk(clavePrimaria.id);

        if (!region) {
            throw new NotFoundException([
                `No se encontró la region con id ${clavePrimaria.id}`,
            ]);
        }

        return region;
    }
}
