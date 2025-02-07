import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    ActualizarEmpresasDto,
    CrearEmpresasDto,
    EliminarEmpresasDto,
    ObtenerPorIdEmpresasDto,
    RetornoEmpresasDto,
} from '../dtos/empresas.dto';
import { Empresas } from '../../database/models/empresas.model';
import { Comunas } from '../../database/models/comunas.model';
import { Giros } from '../../database/models/giros.model';
import { Contactos } from '../../database/models/contactos.model';
import { ESTADOS } from '../../common/constants/estados.constants';

import { QueryTypes } from 'sequelize';
import { BaseServices } from '../../common/base/base-services.class';

@Injectable()
export class EmpresasService extends BaseServices {
    async crear(empresa: CrearEmpresasDto): Promise<RetornoEmpresasDto> {
        // Ejecutar validaciones en paralelo
        const [empresaExistente, comuna, giros] = await Promise.all([
            Empresas.findOne({
                where: { rut: empresa.rut },
                attributes: ['rut'],
            }),
            Comunas.findOne({
                where: { id: empresa.id_comunas },
                attributes: ['id'],
            }),
            Giros.findAll({
                where: { codigo: empresa.giros },
                attributes: ['codigo'],
            }),
        ]);

        if (empresaExistente) {
            throw new ConflictException(['La empresa ya existe']);
        }

        if (!comuna) {
            throw new NotFoundException(['La comuna no existe']);
        }

        // Validar que los giros existan en la base de datos
        const girosNoExistentes = empresa.giros.filter(
            (giro) => !giros.some((g) => g.codigo === giro),
        );

        if (girosNoExistentes.length > 0) {
            throw new NotFoundException([
                `Los siguientes códigos de giros no existen: ${girosNoExistentes.join(', ')}`,
            ]);
        }

        // Validar que no haya giros duplicados
        const girosUnicos = new Set(empresa.giros);
        if (girosUnicos.size !== empresa.giros.length) {
            throw new ConflictException(['No pueden existir giros duplicados']);
        }

        // Validar contactos antes de crear la empresa
        if (empresa.contactos?.length > 0) {
            const emailSet = new Set(empresa.contactos.map((c) => c.email));
            if (emailSet.size !== empresa.contactos.length) {
                throw new ConflictException([
                    'Existen emails duplicados entre los contactos',
                ]);
            }

            const emailsExistentes = await Contactos.findAll({
                where: {
                    email: Array.from(emailSet),
                },
                attributes: ['email'],
            });

            if (emailsExistentes.length > 0) {
                throw new ConflictException([
                    `Ya existen contactos con los siguientes emails: ${emailsExistentes.map((c) => c.email).join(', ')}`,
                ]);
            }
        }

        // Crear empresa y asociaciones en una transacción
        const empresaCreada = await Empresas.create({
            rut: empresa.rut,
            razon_social: empresa.razon_social,
            nombre_de_fantasia: empresa.nombre_de_fantasia,
            email_factura: empresa.email_factura,
            direccion: empresa.direccion,
            estado: ESTADOS.OPCION_1,
            id_comunas: empresa.id_comunas,
            telefono: empresa.telefono,
        });

        // Ejecutar creación de relaciones en paralelo
        await Promise.all([
            empresaCreada.$add('giros', empresa.giros),
            empresa.contactos?.length > 0
                ? Contactos.bulkCreate(
                      empresa.contactos.map((contacto) => ({
                          ...contacto,
                          rut_empresas: empresaCreada.rut,
                      })),
                  )
                : Promise.resolve(),
        ]);

        // Obtener la empresa con las relaciones incluídas
        const empresaRetorno = (await Empresas.findOne({
            where: { rut: empresaCreada.rut },
            attributes: {
                exclude: ['id_comunas'],
            },
            include: [
                {
                    model: Comunas,
                    as: 'comuna',
                    attributes: ['id', 'nombre'],
                },
                {
                    model: Giros,
                    as: 'giros',
                    attributes: [
                        'codigo',
                        'nombre',
                        'afecto_iva',
                        'nombre_categorias',
                    ],
                    through: { attributes: [] },
                },
                {
                    model: Contactos,
                    as: 'contactos',
                    attributes: ['email', 'nombre', 'cargo'],
                },
            ],
        })) as RetornoEmpresasDto;

        return empresaRetorno;
    }

    async obtenerTodos(): Promise<RetornoEmpresasDto[]> {
        const empresasRetorno = (await Empresas.findAll({
            where: { estado: ESTADOS.OPCION_1 },
            attributes: { exclude: ['id_comunas'] },
            include: [
                {
                    model: Comunas,
                    as: 'comuna',
                    attributes: ['id', 'nombre'],
                },
                {
                    model: Giros,
                    as: 'giros',
                    attributes: [
                        'codigo',
                        'nombre',
                        'afecto_iva',
                        'nombre_categorias',
                    ],
                    through: { attributes: [] },
                },
                {
                    model: Contactos,
                    as: 'contactos',
                    attributes: ['email', 'nombre', 'cargo'],
                },
            ],
        })) as RetornoEmpresasDto[];

        if (empresasRetorno.length === 0) {
            throw new NotFoundException([`No hay empresas activas`]);
        }

        return empresasRetorno;
    }

    async obtenerTodosEliminados(): Promise<RetornoEmpresasDto[]> {
        const empresasRetorno = (await Empresas.findAll({
            where: { estado: ESTADOS.OPCION_2 },
            attributes: { exclude: ['id_comunas'] },
            include: [
                {
                    model: Comunas,
                    as: 'comuna',
                    attributes: ['id', 'nombre'],
                },
                {
                    model: Giros,
                    as: 'giros',
                    attributes: [
                        'codigo',
                        'nombre',
                        'afecto_iva',
                        'nombre_categorias',
                    ],
                    through: { attributes: [] },
                },
                {
                    model: Contactos,
                    as: 'contactos',
                    attributes: ['email', 'nombre', 'cargo'],
                },
            ],
        })) as RetornoEmpresasDto[];

        if (empresasRetorno.length === 0) {
            throw new NotFoundException([`No hay empresas eliminadas`]);
        }

        return empresasRetorno;
    }

    async obtenerPorId(
        clavePrimaria: ObtenerPorIdEmpresasDto,
    ): Promise<RetornoEmpresasDto> {
        const empresa = (await Empresas.findOne({
            where: { rut: clavePrimaria.rut },
            attributes: { exclude: ['id_comunas'] },
            include: [
                {
                    model: Comunas,
                    as: 'comuna',
                    attributes: ['id', 'nombre'],
                },
                {
                    model: Giros,
                    as: 'giros',
                    attributes: [
                        'codigo',
                        'nombre',
                        'afecto_iva',
                        'nombre_categorias',
                    ],
                    through: { attributes: [] },
                },
                {
                    model: Contactos,
                    as: 'contactos',
                    attributes: ['email', 'nombre', 'cargo'],
                },
            ],
        })) as RetornoEmpresasDto;

        if (!empresa) {
            throw new NotFoundException([
                `Empresa con el rut ${clavePrimaria.rut} no encontrada`,
            ]);
        }

        if (empresa.estado === ESTADOS.OPCION_2) {
            throw new ConflictException([
                `Empresa con el rut ${empresa.rut} está eliminada`,
            ]);
        }

        return empresa;
    }

    async actualizar(
        empresa: ActualizarEmpresasDto,
    ): Promise<RetornoEmpresasDto> {
        // Ejecutar consultas en paralelo para optimizar rendimiento
        const [
            empresaExistente,
            empresaExistenteNuevo,
            contactosExistentes,
            giros,
        ] = await Promise.all([
            Empresas.findOne({
                where: { rut: empresa.rut },
                attributes: ['rut', 'estado'], // Solo traer campos necesarios
            }),
            empresa.nuevo_rut !== empresa.rut
                ? Empresas.findOne({
                      where: { rut: empresa.nuevo_rut },
                      attributes: ['rut'],
                  })
                : null,
            Contactos.findAll({
                where: { rut_empresas: empresa.rut },
                attributes: ['email'], // Solo necesitamos saber si existen
            }),
            Giros.findAll({
                where: { codigo: empresa.giros },
                attributes: ['codigo'],
            }),
        ]);

        if (!empresaExistente) {
            throw new NotFoundException([
                `Empresa con el rut ${empresa.rut} no encontrada`,
            ]);
        }

        if (empresaExistente.estado === ESTADOS.OPCION_2) {
            throw new ConflictException([
                `Empresa con el rut ${empresaExistente.rut} está eliminada`,
            ]);
        }

        if (empresaExistenteNuevo) {
            throw new ConflictException([
                `Ya existe una empresa con el rut ${empresa.nuevo_rut}`,
            ]);
        }

        // Validar que los giros existan en la base de datos
        const girosNoExistentes = empresa.giros.filter(
            (giro) => !giros.some((g) => g.codigo === giro),
        );

        if (girosNoExistentes.length > 0) {
            throw new NotFoundException([
                `Los siguientes códigos de giros no existen: ${girosNoExistentes.join(', ')}`,
            ]);
        }

        // Validar que no haya giros duplicados
        const girosUnicos = new Set(empresa.giros);
        if (girosUnicos.size !== empresa.giros.length) {
            throw new ConflictException(['No pueden existir giros duplicados']);
        }

        // Verificar emails duplicados en los contactos
        if (empresa.contactos?.length > 0) {
            const emails = empresa.contactos.map((contacto) => contacto.email);
            const emailsUnicos = new Set(emails);

            if (emails.length !== emailsUnicos.size) {
                throw new ConflictException([
                    'No pueden existir contactos con el mismo email',
                ]);
            }
        }

        if (empresa.contactos?.length > 0) {
            await Promise.all([
                // Operaciones secuenciales de contactos
                (async () => {
                    if (contactosExistentes.length > 0) {
                        await Contactos.destroy({
                            where: { rut_empresas: empresa.rut },
                        });
                    }
                    await Contactos.bulkCreate(
                        empresa.contactos.map((contacto) => ({
                            email: contacto.email,
                            nombre: contacto.nombre,
                            cargo: contacto.cargo,
                            rut_empresas: empresa.rut,
                        })),
                    );
                })(),
                // Actualizar giros en paralelo
                empresaExistente.$set('giros', empresa.giros),
            ]);
        } else {
            await empresaExistente.$set('giros', empresa.giros);
        }

        try {
            await Empresas.update(
                {
                    rut: empresa.nuevo_rut,
                    razon_social: empresa.razon_social,
                    nombre_de_fantasia: empresa.nombre_de_fantasia,
                    email_factura: empresa.email_factura,
                    direccion: empresa.direccion,
                    id_comunas: empresa.id_comunas,
                    telefono: empresa.telefono,
                },
                { where: { rut: empresa.rut } },
            );
        } catch (error) {
            await Empresas.sequelize.query(
                'UPDATE empresas SET rut = :nuevo_rut, razon_social = :razon_social, nombre_de_fantasia = :nombre_de_fantasia, email_factura = :email_factura, direccion = :direccion, id_comunas = :id_comunas, telefono = :telefono WHERE rut = :rut',
                {
                    replacements: {
                        nuevo_rut: empresa.nuevo_rut,
                        razon_social: empresa.razon_social,
                        nombre_de_fantasia: empresa.nombre_de_fantasia,
                        email_factura: empresa.email_factura,
                        direccion: empresa.direccion,
                        id_comunas: empresa.id_comunas,
                        telefono: empresa.telefono,
                        rut: empresa.rut,
                    },
                    type: QueryTypes.UPDATE,
                },
            );
        }

        const empresaActualizadaRetorno = (await Empresas.findOne({
            where: { rut: empresa.nuevo_rut },
            attributes: { exclude: ['id_comunas'] },
            include: [
                {
                    model: Comunas,
                    as: 'comuna',
                    attributes: ['id', 'nombre'],
                },
                {
                    model: Giros,
                    as: 'giros',
                    attributes: [
                        'codigo',
                        'nombre',
                        'afecto_iva',
                        'nombre_categorias',
                    ],
                    through: { attributes: [] },
                },
                {
                    model: Contactos,
                    as: 'contactos',
                    attributes: ['email', 'nombre', 'cargo'],
                },
            ],
        })) as RetornoEmpresasDto;

        return empresaActualizadaRetorno;
    }

    async eliminar(
        clavePrimaria: EliminarEmpresasDto,
    ): Promise<RetornoEmpresasDto> {
        const empresa = await Empresas.findByPk(clavePrimaria.rut);

        if (!empresa) {
            throw new NotFoundException([
                `Empresa con rut ${clavePrimaria.rut} no encontrada`,
            ]);
        }

        try {
            await Empresas.update(
                { estado: ESTADOS.OPCION_2 },
                { where: { rut: clavePrimaria.rut } },
            );
        } catch (error) {
            await Empresas.sequelize.query(
                'UPDATE empresas SET estado = :estado WHERE rut = :rut',
                {
                    replacements: {
                        estado: ESTADOS.OPCION_2,
                        rut: clavePrimaria.rut,
                    },
                    type: QueryTypes.UPDATE,
                },
            );
        }

        const empresaEliminadaRetorno = (await Empresas.findOne({
            where: { rut: clavePrimaria.rut },
            attributes: { exclude: ['id_comunas'] },
            include: [
                {
                    model: Comunas,
                    as: 'comuna',
                    attributes: ['id', 'nombre'],
                },
                {
                    model: Giros,
                    as: 'giros',
                    attributes: [
                        'codigo',
                        'nombre',
                        'afecto_iva',
                        'nombre_categorias',
                    ],
                    through: { attributes: [] },
                },
                {
                    model: Contactos,
                    as: 'contactos',
                    attributes: ['email', 'nombre', 'cargo'],
                },
            ],
        })) as RetornoEmpresasDto;

        return empresaEliminadaRetorno;
    }
}
