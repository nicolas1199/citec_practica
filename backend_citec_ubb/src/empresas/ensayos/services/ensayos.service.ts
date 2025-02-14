import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Op } from 'sequelize';

import {
    CrearEnsayoDto,
    ActualizarEnsayoDto,
    ObtenerPorIdEnsayoDto,
    EliminarEnsayoDto,
    RetornoEnsayo,
} from '../dtos/ensayos.dto';

import { Ensayos } from '../../../database/models/ensayos.model';
import { ESTADOS } from '../../../common/constants/estados.constants'; // Si es necesario
import { ADJUDICADO } from 'src/common/constants/adjudicados.constants'; // Si es necesario

@Injectable()
export class EnsayosService {
    async crear(ensayo: CrearEnsayoDto): Promise<RetornoEnsayo> {
        // Crear ensayo
        const ensayoCreado = await Ensayos.create({
            nombre_ensayo: ensayo.nombre_ensayo,
            tipo_servicio_id: ensayo.tipo_servicio_id,
        });  // Cast explícito a Ensayos

        return ensayoCreado as RetornoEnsayo;
    }

    async actualizar(ensayo: ActualizarEnsayoDto): Promise<RetornoEnsayo> {
        // Validar que exista el ensayo
        const ensayoExistente = await Ensayos.findOne({
            where: { id: ensayo.id },
        });

        if (!ensayoExistente) {
            throw new NotFoundException([`Ensayo con id ${ensayo.id} no encontrado`]);
        }

        // Actualizar ensayo
        await Ensayos.update(
            {
                nombre_ensayo: ensayo.nombre_ensayo,
                tipo_servicio_id: ensayo.tipo_servicio_id,
            },  // Cast explícito a Ensayos
            {
                where: { id: ensayo.id },
            },
        );

        return this.obtenerPorId({ id: ensayo.id });
    }

    async eliminar(clavePrimaria: EliminarEnsayoDto): Promise<RetornoEnsayo> {
        const ensayo = await Ensayos.findOne({
            where: { id: clavePrimaria.id },
        });

        if (!ensayo) {
            throw new NotFoundException([`Ensayo con id ${clavePrimaria.id} no encontrado`]);
        }

        try {
            await Ensayos.destroy({ where: { id: clavePrimaria.id } });
        } catch (error) {
            throw new ConflictException([`Error al eliminar ensayo con id ${clavePrimaria.id}`]);
        }

        return this.obtenerPorId({ id: clavePrimaria.id });
    }

    async obtenerTodos(): Promise<any> {
        const ensayosRetorno = await Ensayos.findAll({
            where: { estado: ESTADOS.OPCION_1 },  // Si se utiliza el campo `estado`
            attributes: ['id', 'nombre_ensayo', 'tipo_servicio_id'],
        });

        if (ensayosRetorno.length === 0) {
            throw new NotFoundException(['No hay ensayos disponibles']);
        }

        return ensayosRetorno;
    }

    async obtenerPorId(clavePrimaria: ObtenerPorIdEnsayoDto): Promise<RetornoEnsayo> {
        const ensayoRetorno = await Ensayos.findOne({
            where: { id: clavePrimaria.id },
            attributes: ['id', 'nombre_ensayo', 'tipo_servicio_id'],
        });

        if (!ensayoRetorno) {
            throw new NotFoundException([`Ensayo con id ${clavePrimaria.id} no encontrado`]);
        }

        return ensayoRetorno;
    }
}
