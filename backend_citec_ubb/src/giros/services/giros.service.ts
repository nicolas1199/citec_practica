import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Giros } from '../../database/models/giros.model';
import { BaseServicesSimple } from '../../common/base/base-services-simple.class';
import { GirosRetornoDto, ObtenerPorIdGirosDto } from '../dtos/giros.dto';

@Injectable()
export class GirosService extends BaseServicesSimple {
    async obtenerTodos(): Promise<Giros[]> {
        const girosRetorno = await Giros.findAll();

        if (girosRetorno.length === 0) {
            throw new NotFoundException([`No hay giros activos`]);
        }

        return girosRetorno;
    }

    async obtenerPorId(clavePrimaria: ObtenerPorIdGirosDto): Promise<Giros> {
        const girosRetorno = await Giros.findByPk(clavePrimaria.codigo);

        if (!girosRetorno) {
            throw new NotFoundException([
                `No existe el giro con id ${clavePrimaria.codigo}`,
            ]);
        }

        return girosRetorno;
    }
}
