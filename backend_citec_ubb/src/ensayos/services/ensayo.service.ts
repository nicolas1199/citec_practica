import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Ensayos } from 'src/database/models/ensayos.model';

import {
    CrearEnsayoDto,
    ActualizarEnsayoDto,
    ObtenerPorIdEnsayoDto,
    EliminarEnsayoDto,
    RetornoEnsayoDto,
} from '../dtos/ensayo.dto';

@Injectable()
export class EnsayosService {
    async crear(ensayo: CrearEnsayoDto): Promise<RetornoEnsayoDto> {
        // Crear ensayo
        const ensayoCreado = await Ensayos.create({
            nombre_ensayo: ensayo.nombre_ensayo,
            tipo_servicio_id: ensayo.tipo_servicio_id,
        });
        await ensayoCreado.save(); // 🔹 Guarda en la base de datos
        console.log('✅ Ensayo guardado en la BD:', ensayoCreado);

        return ensayoCreado as RetornoEnsayoDto;
    }

    async actualizar(id: number, ensayo: ActualizarEnsayoDto): Promise<RetornoEnsayoDto> {
        // Validar que exista el ensayo
        const ensayoExistente = await Ensayos.findOne({
            where: { id },
        });

        if (!ensayoExistente) {
            throw new NotFoundException([`Ensayo con id ${id} no encontrado`]);
        }

        // Actualizar ensayo
        await Ensayos.update(
            {
                nombre_ensayo: ensayo.nombre_ensayo,
                tipo_servicio_id: ensayo.tipo_servicio_id,
            },
            {
                where: { id },
            },
        );

        return this.obtenerPorId({id}); // Llamamos con el DTO
    }

    async eliminar(
        clavePrimaria: EliminarEnsayoDto,
    ): Promise<{ mensaje: string }> {
        const ensayo = await Ensayos.findOne({
            where: { id: clavePrimaria.id },
        });
    
        if (!ensayo) {
            throw new NotFoundException([
                `Ensayo con id ${clavePrimaria.id} no encontrado`,
            ]);
        }
    
        try {
            await Ensayos.destroy({ where: { id: clavePrimaria.id } });
            return { mensaje: `Ensayo con id ${clavePrimaria.id} eliminado correctamente` }; // ✅ Respuesta correcta
        } catch (error) {   
            throw new ConflictException([
                `Error al eliminar ensayo con id ${clavePrimaria.id}`,
            ]);
        }
    }
    

    async obtenerTodos(): Promise<any> {
        const ensayosRetorno = await Ensayos.findAll({
            attributes: ['id', 'nombre_ensayo', 'tipo_servicio_id'],
        });

        if (ensayosRetorno.length === 0) {
            throw new NotFoundException(['No hay ensayos disponibles']);
        }

        // Log para ver los datos mapeados
        const ensayosMapeados = ensayosRetorno.map((ensayo) => ({
            id: ensayo.id,
            nombre: ensayo.nombre_ensayo,
            id_servicio: ensayo.tipo_servicio_id,
        }));

        return ensayosMapeados;
    }

    async obtenerPorId(
        clavePrimaria: ObtenerPorIdEnsayoDto,
    ): Promise<RetornoEnsayoDto> {
        const ensayoRetorno = await Ensayos.findOne({
            where: { id: clavePrimaria.id },
            attributes: ['id', 'nombre_ensayo', 'tipo_servicio_id'],
        });

        if (!ensayoRetorno) {
            throw new NotFoundException([
                `Ensayo con id ${clavePrimaria.id} no encontrado`,
            ]);
        }

        return ensayoRetorno;
    }
}
