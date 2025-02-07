import { Injectable, NotFoundException } from '@nestjs/common';
import { GruposDeServicios } from '../../database/models/grupos-de-servicios.model';
import { BaseServicesSimple } from '../../common/base/base-services-simple.class';
import {
    ObtenerPorIdGrupoDeServiciosDto,
    RetornoGrupoDeServiciosDto,
} from '../dtos/grupo-de-servicios.dto';

@Injectable()
export class GrupoDeServiciosService extends BaseServicesSimple {
    async obtenerTodos(): Promise<GruposDeServicios[]> {
        const gruposRetorno = await GruposDeServicios.findAll();

        if (gruposRetorno.length === 0) {
            throw new NotFoundException(['No hay grupos de servicios']);
        }

        return gruposRetorno;
    }

    async obtenerPorId(
        clavePrimaria: ObtenerPorIdGrupoDeServiciosDto,
    ): Promise<GruposDeServicios> {
        const grupoRetorno = await GruposDeServicios.findByPk(
            clavePrimaria.nombre,
        );

        if (!grupoRetorno) {
            throw new NotFoundException([
                `No existe el grupo de servicio con nombre ${clavePrimaria.nombre}`,
            ]);
        }

        return grupoRetorno;
    }
}
