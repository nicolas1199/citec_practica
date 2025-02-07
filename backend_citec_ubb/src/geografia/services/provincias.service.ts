import { Injectable, NotFoundException } from '@nestjs/common';
import { Provincias } from '../../database/models/provincias.model';
import { BaseServicesSimple } from 'src/common/base/base-services-simple.class';
import { ObtenerPorIdProvinciasDto } from '../dtos/provincias.dto';
@Injectable()
export class ProvinciasService extends BaseServicesSimple {
    async obtenerTodos(): Promise<Provincias[]> {
        return await Provincias.findAll();
    }

    async obtenerPorId(
        clavePrimaria: ObtenerPorIdProvinciasDto,
    ): Promise<Provincias> {
        const provincia = await Provincias.findByPk(clavePrimaria.id);

        if (!provincia) {
            throw new NotFoundException([
                `No se encontró la provincia con id ${clavePrimaria.id}`,
            ]);
        }

        return provincia;
    }
}
