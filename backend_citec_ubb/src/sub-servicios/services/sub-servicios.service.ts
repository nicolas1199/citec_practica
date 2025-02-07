import { Injectable, NotFoundException } from '@nestjs/common';
import { SubServicios } from '../../database/models/sub-servicios.model';
import { BaseServicesSimple } from '../../common/base/base-services-simple.class';
import { ObtenerPorIdSubServiciosDto } from '../dtos/sub-servicios.dto';
import { GruposDeServicios } from '../../database/models/grupos-de-servicios.model';

@Injectable()
export class SubServiciosService extends BaseServicesSimple {
    async obtenerTodos(): Promise<SubServicios[]> {
        const subserviciosRetorno = await SubServicios.findAll({
            include: [
                {
                    model: GruposDeServicios,
                    as: 'grupoDeServicio',
                    attributes: ['nombre'],
                    through: { attributes: [] },
                },
            ],
        });

        if (subserviciosRetorno.length === 0) {
            throw new NotFoundException(['No hay subservicios']);
        }

        return subserviciosRetorno;
    }

    async obtenerPorId(
        clavePrimaria: ObtenerPorIdSubServiciosDto,
    ): Promise<SubServicios> {
        const subservicioRetorno = await SubServicios.findOne({
            where: { nombre: clavePrimaria.nombre },
            include: [
                {
                    model: GruposDeServicios,
                    as: 'grupoDeServicio',
                    attributes: ['nombre'],
                    through: { attributes: [] },
                },
            ],
        });

        if (!subservicioRetorno) {
            throw new NotFoundException([
                `No existe el subservicio con nombre ${clavePrimaria.nombre}`,
            ]);
        }

        return subservicioRetorno;
    }
}
