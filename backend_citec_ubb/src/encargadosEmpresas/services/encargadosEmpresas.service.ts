import { Injectable } from '@nestjs/common';
import {
    EncargadosEmpresasRetornoDto,
    ActualizarEncargadosEmpresasDTO,
    EliminarEncargadosEmpresasDTO,
    ObtenerPorIdEncargadosEmpresasDTO,
    CrearEncargadosEmpresasDTO,
} from '../dtos/encargadosEmpresas.dto';

import { BaseServices } from 'src/common/base/base-services.class';
import { EncargadosEmpresas } from 'src/database/models/encargadosEmpresas.model';

@Injectable()
export class EncargadosEmpresasService extends BaseServices {
    async crear(
        encargadoEmpresa: CrearEncargadosEmpresasDTO,
    ): Promise<EncargadosEmpresasRetornoDto> {
        const [encargadoExistente, empresaExistente] = await Promise.all([
            EncargadosEmpresas.findOne({
                where: { nombre: encargadoEmpresa.nombre },
            }),
            EncargadosEmpresas.findOne({
                where: { rutEmpresa: encargadoEmpresa.rutEmpresa },
            }),
        ]);

        if (encargadoExistente && empresaExistente) {
            throw new Error('El encargado ya existe');
        }

        if (!empresaExistente) {
            throw new Error('La empresa no existe');
        }

        const nuevoEncargado = await EncargadosEmpresas.create({
            nombre: encargadoEmpresa.nombre,
            rutEmpresa: encargadoEmpresa.rutEmpresa,
        });

        return {
            nombre: nuevoEncargado.nombre,
            rutEmpresa: nuevoEncargado.rutEmpresa,
        } as EncargadosEmpresasRetornoDto;
    }

    async obtenerTodos(): Promise<EncargadosEmpresasRetornoDto[]> {
        const encargados = await EncargadosEmpresas.findAll({
            attributes: ['nombre', 'empresaCliente'],
        });

        return encargados;
    }

    async actualizar(
        encargadoEmpresa: ActualizarEncargadosEmpresasDTO,
    ): Promise<EncargadosEmpresasRetornoDto> {
        const encargadoExistente = await EncargadosEmpresas.findByPk(
            encargadoEmpresa.id,
        );

        if (!encargadoExistente) {
            throw new Error('El encargado no existe');
        }

        const encargadoActualizado = await encargadoExistente.update({
            nombre: encargadoEmpresa.nombre,
        });

        return {
            nombre: encargadoActualizado.nombre,
            rutEmpresa: encargadoActualizado.rutEmpresa,
        } as EncargadosEmpresasRetornoDto;
    }

    async obtenerPorId(
        encargadoEmpresa: ObtenerPorIdEncargadosEmpresasDTO,
    ): Promise<EncargadosEmpresasRetornoDto> {
        const encargadoRetorno = (await EncargadosEmpresas.findByPk(
            encargadoEmpresa.id,
            {
                attributes: ['nombre', 'rutEmpresa'],
            },
        )) as EncargadosEmpresasRetornoDto;

        return encargadoRetorno;
    }

    async eliminar(
        encargadoEmpresa: EliminarEncargadosEmpresasDTO,
    ): Promise<boolean> {
        const encargadoExistente = await EncargadosEmpresas.findByPk(
            encargadoEmpresa.id,
        );

        if (!encargadoExistente) {
            throw new Error('El encargado no existe');
        }

        await encargadoExistente.destroy();

        return true;
    }
}
