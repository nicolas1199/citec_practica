import {
    Injectable,
    NotFoundException,
    ConflictException,
    Query,
} from '@nestjs/common';

import { Op } from 'sequelize';

import {
    CrearPropuestasDeServiciosDto,
    ActualizarPropuestasDeServiciosDto,
    ObtenerPorIdPropuestasDeServiciosDto,
    EliminarPropuestasDeServiciosDto,
    RetornoPropuestaDeServicio,
} from '../dtos/propuestas-de-servicios.dto';

import { PropuestasDeServicios } from '../../database/models/propuestas-de-servicios.model';
import { BaseServices } from '../../common/base/base-services.class';
import { ESTADOS } from '../../common/constants/estados.constants';
import { Empresas } from '../../database/models/empresas.model';
import { SubServicios } from 'src/database/models/sub-servicios.model';
import { GruposDeServicios } from 'src/database/models/grupos-de-servicios.model';
import { PropuestaDeServicioSubServicios } from 'src/database/models/propuesta-de-servicio-sub-servicios.model';
import { ADJUDICADO } from 'src/common/constants/adjudicados.constants';
import { Estados } from 'src/common/constants/estados.constants';
import { Exclude } from 'class-transformer';
import { QueryTypes } from 'sequelize';

@Injectable()
export class PropuestasDeServiciosService {
    async crear(
        propuesta: CrearPropuestasDeServiciosDto,
    ): Promise<RetornoPropuestaDeServicio> {
        //validaciones en paralelo
        const [rutReceptor, subservicios] = await Promise.all([
            Empresas.findOne({
                where: { rut: propuesta.rut_receptor },
                attributes: ['rut'],
            }),
            SubServicios.findAll({
                where: {
                    nombre: {
                        [Op.in]: propuesta.sub_servicios,
                    },
                },
                attributes: ['nombre', 'pago_neto'],
                include: [
                    {
                        model: GruposDeServicios,
                        as: 'grupoDeServicio',
                        attributes: ['nombre'],
                        through: { attributes: [] },
                    },
                ],
            }),
        ]);

        if (!rutReceptor) {
            throw new NotFoundException([
                `Empresa con rut ${propuesta.rut_receptor} no encontrada`,
            ]);
        }

        //validar que los subservicios existan
        if (subservicios.length !== propuesta.sub_servicios.length) {
            const subserviciosEncontrados = subservicios.map((s) => s.nombre);
            const subserviciosNoExistentes = propuesta.sub_servicios.filter(
                (nombre) => !subserviciosEncontrados.includes(nombre),
            );
            throw new NotFoundException([
                `Los siguientes subservicios no existen: ${subserviciosNoExistentes.join(' , ')}`,
            ]);
        }

        //validar que no haya subservicios repetidos
        const subserviciosUnicos = new Set(propuesta.sub_servicios);
        if (subserviciosUnicos.size !== propuesta.sub_servicios.length) {
            throw new ConflictException(['No se pueden repetir subservicios']);
        }

        // Calculate total pago from subservicios pago_neto
        const pagoTotal = subservicios.reduce(
            (sum, sub) => sum + sub.pago_neto,
            0,
        );

        //Crear propuesta
        const propuestaCreada = await PropuestasDeServicios.create({
            año: propuesta.año,
            pago: pagoTotal, // Use calculated total
            fecha: propuesta.fecha,
            estado: ESTADOS.OPCION_1,
            rut_receptor: propuesta.rut_receptor,
            adjudicado: ADJUDICADO.OPCION_1,
        });

        //Ejecutar creación de relaciones
        await propuestaCreada.$add(
            'sub_servicios',
            subservicios.map((s) => s.nombre),
        );

        //Retorno
        const propuestaRetorno = (await PropuestasDeServicios.findOne({
            where: {
                id: propuestaCreada.id,
            },
            include: [
                {
                    model: Empresas,
                    as: 'empresa',
                    attributes: ['rut'],
                },
                {
                    model: SubServicios,
                    as: 'sub_servicios',
                    attributes: ['nombre', 'pago_neto'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: GruposDeServicios,
                            as: 'grupoDeServicio',
                            attributes: ['nombre'],
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
        })) as RetornoPropuestaDeServicio;

        return propuestaRetorno;
    }

    async actualizar(
        propuesta: ActualizarPropuestasDeServiciosDto,
    ): Promise<RetornoPropuestaDeServicio> {
        // Validar que exista la propuesta
        const propuestaExistente = await PropuestasDeServicios.findOne({
            where: { id: propuesta.id },
            include: [
                {
                    model: SubServicios,
                    as: 'sub_servicios',
                    attributes: ['nombre', 'pago_neto'],
                },
            ],
        });

        if (!propuestaExistente) {
            throw new NotFoundException([
                `Propuesta con id ${propuesta.id} no encontrada`,
            ]);
        }

        if (propuestaExistente.estado === ESTADOS.OPCION_2) {
            throw new ConflictException([
                `Propuesta con id ${propuesta.id} está eliminada`,
            ]);
        }

        // Validar empresa
        const empresa = await Empresas.findOne({
            where: { rut: propuesta.rut_receptor },
        });

        if (!empresa) {
            throw new NotFoundException([
                `Empresa con rut ${propuesta.rut_receptor} no encontrada`,
            ]);
        }

        // Obtener y validar subservicios
        const subservicios = await SubServicios.findAll({
            where: {
                nombre: {
                    [Op.in]: propuesta.sub_servicios,
                },
            },
            attributes: ['nombre', 'pago_neto'],
            include: [
                {
                    model: GruposDeServicios,
                    as: 'grupoDeServicio',
                    attributes: ['nombre'],
                },
            ],
        });

        if (subservicios.length !== propuesta.sub_servicios.length) {
            const encontrados = subservicios.map((s) => s.nombre);
            const noExistentes = propuesta.sub_servicios.filter(
                (nombre) => !encontrados.includes(nombre),
            );
            throw new NotFoundException([
                `Los siguientes subservicios no existen: ${noExistentes.join(', ')}`,
            ]);
        }

        // Calcular nuevo pago total
        const pagoTotal = subservicios.reduce(
            (sum, sub) => sum + sub.pago_neto,
            0,
        );

        // Actualizar propuesta
        await PropuestasDeServicios.update(
            {
                año: propuesta.año,
                pago: pagoTotal,
                fecha: propuesta.fecha,
                rut_receptor: propuesta.rut_receptor,
                adjudicado: propuesta.adjudicado,
            },
            {
                where: { id: propuesta.id },
            },
        );

        // Actualizar relaciones con subservicios
        await propuestaExistente.$set(
            'sub_servicios',
            subservicios.map((s) => s.nombre),
        );

        // Retornar propuesta actualizada
        return this.obtenerPorId({ id: propuesta.id });
    }

    async eliminar(
        clavePrimaria: EliminarPropuestasDeServiciosDto,
    ): Promise<RetornoPropuestaDeServicio> {
        const propuesta = await PropuestasDeServicios.findOne({
            where: { id: clavePrimaria.id },
        });

        if (!propuesta) {
            throw new NotFoundException([
                `Propuesta con id ${clavePrimaria.id} no encontrada`,
            ]);
        }

        if (propuesta.estado === ESTADOS.OPCION_2) {
            throw new ConflictException([
                `Propuesta con id ${clavePrimaria.id} ya está eliminada`,
            ]);
        }

        try {
            await PropuestasDeServicios.update(
                { estado: ESTADOS.OPCION_2 },
                { where: { id: clavePrimaria.id } },
            );
        } catch (error) {
            await PropuestasDeServicios.sequelize.query(
                'UPDATE propuestas_de_servicios SET estado = :estado WHERE id = :id',
                {
                    replacements: {
                        estado: ESTADOS.OPCION_2,
                        id: clavePrimaria.id,
                    },
                    type: QueryTypes.UPDATE,
                },
            );
        }

        // Retornar la propuesta eliminada con todos sus datos
        const propuestaEliminadaRetorno = (await PropuestasDeServicios.findOne({
            where: { id: clavePrimaria.id },
            attributes: ['id', 'año', 'pago', 'fecha', 'estado', 'adjudicado'],
            include: [
                {
                    model: Empresas,
                    as: 'empresa',
                    attributes: ['rut'],
                },
                {
                    model: SubServicios,
                    as: 'sub_servicios',
                    attributes: ['nombre', 'pago_neto'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: GruposDeServicios,
                            as: 'grupoDeServicio',
                            attributes: ['nombre'],
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
        })) as RetornoPropuestaDeServicio;

        return propuestaEliminadaRetorno;
    }

    async obtenerTodos(): Promise<any> {
        const propuestasRetorno = (await PropuestasDeServicios.findAll({
            where: { estado: ESTADOS.OPCION_1 },
            attributes: ['id', 'año', 'pago', 'fecha', 'estado', 'adjudicado'],
            include: [
                {
                    model: Empresas,
                    as: 'empresa',
                    attributes: ['rut'],
                },
                {
                    model: SubServicios,
                    as: 'sub_servicios',
                    attributes: ['nombre', 'pago_neto'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: GruposDeServicios,
                            as: 'grupoDeServicio',
                            attributes: ['nombre'],
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
        })) as PropuestasDeServicios[];

        if (propuestasRetorno.length === 0) {
            throw new NotFoundException(['No hay propuestas de servicios']);
        }

        return propuestasRetorno;
    }

    async obtenerTodosEliminados(): Promise<any> {
        const propuestasRetorno = (await PropuestasDeServicios.findAll({
            where: { estado: ESTADOS.OPCION_2 },
            attributes: ['id', 'año', 'pago', 'fecha', 'estado', 'adjudicado'],
            include: [
                {
                    model: Empresas,
                    as: 'empresa',
                    attributes: ['rut'],
                },
                {
                    model: SubServicios,
                    as: 'sub_servicios',
                    attributes: ['nombre', 'pago_neto'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: GruposDeServicios,
                            as: 'grupoDeServicio',
                            attributes: ['nombre'],
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
        })) as PropuestasDeServicios[];

        if (propuestasRetorno.length === 0) {
            throw new NotFoundException([
                'No hay propuestas de servicios eliminadas',
            ]);
        }

        return propuestasRetorno;
    }

    async obtenerPorId(
        clavePrimaria: ObtenerPorIdPropuestasDeServiciosDto,
    ): Promise<RetornoPropuestaDeServicio> {
        const propuestaRetorno = (await PropuestasDeServicios.findOne({
            where: { id: clavePrimaria.id },
            attributes: ['id', 'año', 'pago', 'fecha', 'estado', 'adjudicado'],
            include: [
                {
                    model: Empresas,
                    as: 'empresa',
                    attributes: ['rut'],
                },
                {
                    model: SubServicios,
                    as: 'sub_servicios',
                    attributes: ['nombre', 'pago_neto'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: GruposDeServicios,
                            as: 'grupoDeServicio',
                            attributes: ['nombre'],
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
        })) as RetornoPropuestaDeServicio;

        if (!propuestaRetorno) {
            throw new NotFoundException([
                `Propuesta con id ${clavePrimaria.id} no encontrada`,
            ]);
        }

        return propuestaRetorno;
    }
}
