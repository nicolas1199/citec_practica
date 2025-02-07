import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import { EmpresasModule } from '../empresas.module';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { Empresas } from '../../database/models/empresas.model';
import { TIPOS_DE_USUARIO } from '../../common/constants/tipos-usuarios.constants';
import {
    ActualizarEmpresasDto,
    CrearEmpresasDto,
    ObtenerPorIdEmpresasDto,
    RetornoEmpresasDto,
} from '../dtos/empresas.dto';
import { ESTADOS } from '../../common/constants/estados.constants';
import { Comunas } from '../../database/models/comunas.model';
import { Giros } from '../../database/models/giros.model';
import { Contactos } from '../../database/models/contactos.model';
import { Provincias } from '../../database/models/provincias.model';
import { Regiones } from '../../database/models/regiones.model';
import { PropuestasDeServicios } from '../../database/models/propuestas-de-servicios.model';
import { GirosEmpresas } from '../../database/models/giros-empresas.model';
import { Categorias } from '../../database/models/categorias.model';
import { PropuestaDeServicioSubServicios } from '../../database/models/propuesta-de-servicio-sub-servicios.model';
import { GruposDeServicios } from '../../database/models/grupos-de-servicios.model';
import { SubServicios } from '../../database/models/sub-servicios.model';
import { GrupoDeServicioSubServicios } from '../../database/models/grupo-de-servicio-sub-servicios.model';

describe('EmpresasController', () => {
    let app: INestApplication;

    const token = process.env.TOKEN_AUTORIZACION;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                SequelizeModule.forRoot({
                    dialect: 'sqlite',
                    logging: false,
                    storage: ':memory:',
                    models: [
                        Regiones,
                        Provincias,
                        Comunas,
                        Categorias,
                        Giros,
                        Empresas,
                        GruposDeServicios,
                        SubServicios,
                        PropuestasDeServicios,
                        PropuestaDeServicioSubServicios,
                        GrupoDeServicioSubServicios,
                        GirosEmpresas,
                        Contactos,
                    ], // Registra el modelo
                    autoLoadModels: true,
                    synchronize: true,
                }),
                SequelizeModule.forFeature([
                    Regiones,
                    Provincias,
                    Comunas,
                    Categorias,
                    Giros,
                    Empresas,
                    GruposDeServicios,
                    SubServicios,
                    PropuestasDeServicios,
                    PropuestaDeServicioSubServicios,
                    GrupoDeServicioSubServicios,
                    GirosEmpresas,
                    Contactos,
                ]),
                EmpresasModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );

        await app.init();

        /**
         * Crear datos necesarios antes de las pruebas
         */
        const regionesModel = app.get(getModelToken(Regiones));
        const provinciasModel = app.get(getModelToken(Provincias));
        const comunasModel = app.get(getModelToken(Comunas));
        const girosModel = app.get(getModelToken(Giros));
        const categoriasModel = app.get(getModelToken(Categorias));

        // Cargar datos desde archivos CSV
        const regiones = fs.readFileSync(
            `${__dirname}/../../database/seeders/archives/regiones.csv`,
            'utf-8',
        );

        const provincias = fs.readFileSync(
            `${__dirname}/../../database/seeders/archives/provincias.csv`,
            'utf-8',
        );
        const comunas = fs.readFileSync(
            `${__dirname}/../../database/seeders/archives/comunas.csv`,
            'utf-8',
        );
        const giros = fs.readFileSync(
            `${__dirname}/../../database/seeders/archives/giros.csv`,
            'utf-8',
        );

        const categorias = fs.readFileSync(
            `${__dirname}/../../database/seeders/archives/categorias.csv`,
            'utf-8',
        );

        // Insertar regiones
        const regionesData = parse(regiones, {
            columns: true,
            skip_empty_lines: true,
        });
        await regionesModel.bulkCreate(regionesData);

        // Insertar provincias
        const provinciasData = parse(provincias, {
            columns: true,
            skip_empty_lines: true,
        });
        await provinciasModel.bulkCreate(provinciasData);

        // Insertar comunas
        const comunasData = parse(comunas, {
            columns: true,
            skip_empty_lines: true,
        });
        await comunasModel.bulkCreate(comunasData);

        // Insertar categorias
        const categoriasData = parse(categorias, {
            columns: true,
            skip_empty_lines: true,
        });
        await categoriasModel.bulkCreate(categoriasData);

        // Insertar giros
        const girosData = parse(giros, {
            columns: true,
            skip_empty_lines: true,
        });

        await girosModel.bulkCreate(girosData);
    });

    const ruta = '/empresas';

    describe('Geografia', () => {
        it('Deberian existir 16 regiones', async () => {
            const regionesModel = app.get(getModelToken(Regiones));
            const count = await regionesModel.count();
            expect(count).toBe(16);
        });
        it('Deberian existir 56 provincias', async () => {
            const provinciasModel = app.get(getModelToken(Provincias));
            const count = await provinciasModel.count();
            expect(count).toBe(56);
        });
        it('Deberian existir 346 comunas', async () => {
            const comunasModel = app.get(getModelToken(Comunas));
            const count = await comunasModel.count();
            expect(count).toBe(346);
        });
    });

    describe('Categorias', () => {
        it('Deberian existir 21 categorias', async () => {
            const categoriasModel = app.get(getModelToken(Categorias));
            const count = await categoriasModel.count();
            expect(count).toBe(21);
        });
    });

    describe('Giros', () => {
        it('Deberian existir 674 giros', async () => {
            const girosModel = app.get(getModelToken(Giros));
            const count = await girosModel.count();
            expect(count).toBe(674);
        });
    });

    describe('crear', () => {
        const crearEmpresaDto: CrearEmpresasDto = {
            rut: '11.111.111-1',
            razon_social: 'EMPRESA TEST',
            nombre_de_fantasia: 'EMPRESA TEST',
            email_factura: 'test@test.com',
            direccion: 'Calle Ohiggins N°12',
            id_comunas: 1101,
            telefono: '+56912345678',
            contactos: [
                {
                    email: 'contacto@test.com',
                    nombre: 'Contacto Test',
                    cargo: 'Gerente',
                },
            ],
            giros: [11101],
        };

        const empresaRetorno: RetornoEmpresasDto = {
            rut: '11.111.111-1',
            razon_social: 'EMPRESA TEST',
            nombre_de_fantasia: 'EMPRESA TEST',
            email_factura: 'test@test.com',
            direccion: 'Calle Ohiggins N°12',
            comuna: {
                id: 1101,
                nombre: 'Iquique',
            },
            telefono: '+56912345678',
            estado: ESTADOS.OPCION_1,
            giros: [
                {
                    codigo: 11101,
                    nombre: 'CULTIVO DE TRIGO',
                    afecto_iva: 'SI',
                    nombre_categorias:
                        'AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA',
                },
            ],
            contactos: [
                {
                    email: 'contacto@test.com',
                    nombre: 'Contacto Test',
                    cargo: 'Gerente',
                },
            ],
        };

        it('crear empresas correctamente', async () => {
            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresaDto);

            expect(res.status).toBe(201);

            expect(res.body).toMatchObject(empresaRetorno);
            expect(res.body).toHaveProperty('createdAt');
            expect(res.body).toHaveProperty('updatedAt');
        });

        it('fallar si existen campos adicionales o estan mal escritos', async () => {
            // Probar cada campo faltante
            const camposAProbar = [
                {
                    ...crearEmpresaDto,
                    ru: crearEmpresaDto.rut,
                    rut: undefined,
                }, // Error en rut
                {
                    ...crearEmpresaDto,
                    razon_socia: crearEmpresaDto.razon_social,
                    razon_social: undefined,
                }, // Error en razon_social
                {
                    ...crearEmpresaDto,
                    nombre_de_fantasi: crearEmpresaDto.nombre_de_fantasia,
                    nombre_de_fantasia: undefined,
                }, // Error en nombre_de_fantasia
                {
                    ...crearEmpresaDto,
                    email_factur: crearEmpresaDto.email_factura,
                    email_factura: undefined,
                }, // Error en email_factura
                {
                    ...crearEmpresaDto,
                    direccio: crearEmpresaDto.direccion,
                    direccion: undefined,
                }, // Error en direccion
                {
                    ...crearEmpresaDto,
                    id_comun: crearEmpresaDto.id_comunas,
                    id_comuna: undefined,
                }, // Error en id_comuna
                {
                    ...crearEmpresaDto,
                    telefon: crearEmpresaDto.telefono,
                    telefono: undefined,
                }, // Error en telefono
                {
                    ...crearEmpresaDto,
                    giro: crearEmpresaDto.giros,
                    giros: undefined,
                }, // Error en giros
            ];

            for (const casoError of camposAProbar) {
                const res = await request(app.getHttpServer())
                    .post(`${ruta}/crear`)
                    .send(casoError);
                expect(res.status).toBe(400);
                expect(Array.isArray(res.body.message)).toBe(true);
                expect(res.body.statusCode).toBe(400);
                expect(res.body.error).toBe('Bad Request');
            }
        });

        it('fallar si el rut ya existe', async () => {
            const crearEmpresaAntes = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresaDto);

            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresaDto);

            expect(res.status).toBe(409);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(409);
            expect(res.body.error).toBe('Conflict');
        });

        it('fallar si los tipos de datos no son válidos', async () => {
            const casosInvalidos = [
                { ...crearEmpresaDto, rut: 123 }, // Error intencionado: número en lugar de string
                { ...crearEmpresaDto, razon_social: true }, // Error intencionado: booleano en lugar de string
                { ...crearEmpresaDto, nombre_de_fantasia: 123 }, // Error intencionado: número en lugar de string
                { ...crearEmpresaDto, email_factura: true }, // Error intencionado: booleano en lugar de string
                { ...crearEmpresaDto, direccion: 123 }, // Error intencionado: número en lugar de string
                { ...crearEmpresaDto, telefono: true }, // Error intencionado: booleano en lugar de string
                { ...crearEmpresaDto, id_comunas: 'abc' }, // Error intencionado: string en lugar de número
                { ...crearEmpresaDto, giros: '11101' }, // Error intencionado: string en lugar de array
                {
                    ...crearEmpresaDto,
                    contactos: [
                        { email: 1, nombre: true, cargo: undefined },
                        { email: 2, nombre: 'test', cargo: 'Gerente' },
                    ],
                }, // Error intencionado
            ];

            for (const caso of casosInvalidos) {
                const res = await request(app.getHttpServer())
                    .post(`${ruta}/crear`)
                    .send(caso);
                expect(res.status).toBe(400);
                expect(Array.isArray(res.body.message)).toBe(true);
                expect(res.body.statusCode).toBe(400);
                expect(res.body.error).toBe('Bad Request');
            }
        });

        it('fallar si la comuna no existe', async () => {
            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send({ ...crearEmpresaDto, id_comunas: 110001 });

            expect(res.status).toBe(404);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(404);
            expect(res.body.error).toBe('Not Found');
        });

        it('fallar si alguno de los giros no existe', async () => {
            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send({ ...crearEmpresaDto, giros: [1110001] });

            expect(res.status).toBe(404);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(404);
            expect(res.body.error).toBe('Not Found');
        });

        it('fallar si alguno de los giros esta duplicado', async () => {
            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send({ ...crearEmpresaDto, giros: [11101, 11101] });

            expect(res.status).toBe(409);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(409);
            expect(res.body.error).toBe('Conflict');
        });

        it('fallar si alguno de los contactos tiene el email duplicado', async () => {
            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send({
                    ...crearEmpresaDto,
                    contactos: [
                        {
                            email: 'contacto@test.com',
                            nombre: 'Contacto Test',
                            cargo: 'Gerente',
                        },
                        {
                            email: 'contacto@test.com',
                            nombre: 'Contacto Test 2',
                            cargo: 'Gerente 2',
                        },
                    ],
                });

            expect(res.status).toBe(409);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(409);
            expect(res.body.error).toBe('Conflict');
        });

        it('Aceptar opcional el campo contactos', async () => {
            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send({ ...crearEmpresaDto, contactos: undefined });

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
                ...empresaRetorno,
                contactos: [],
            });
        });

        it('verificar transformación de datos:  email_factura/email en minúsculas direccion/email/nombre/cargo capitalize razon_social/nombre_de_fantasia en mayúsculas', async () => {
            const datosPrueba = {
                ...crearEmpresaDto,
                razon_social: 'empresa test',
                nombre_de_fantasia: 'empresa test',
                email_factura: 'TEST@TEST.COM',
                direccion: 'CALLE OHIGGINS N°12',
                contactos: [
                    {
                        email: 'contacto@test.com',
                        nombre: 'CONTACTO TEST',
                        cargo: 'GERENTE 1',
                    },
                    {
                        email: 'contacto2@test.com',
                        nombre: 'CoNtACtO 2 TeSt',
                        cargo: 'gerente 2',
                    },
                ],
            };

            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(datosPrueba);
            expect(res.status).toBe(201);
            expect(res.body.razon_social).toBe('EMPRESA TEST');
            expect(res.body.nombre_de_fantasia).toBe('EMPRESA TEST');
            expect(res.body.email_factura).toBe('test@test.com');
            expect(res.body.direccion).toBe('Calle Ohiggins N°12');
            expect(res.body.contactos).toContainEqual({
                email: 'contacto@test.com',
                nombre: 'Contacto Test',
                cargo: 'Gerente 1',
            });
            expect(res.body.contactos).toContainEqual({
                email: 'contacto2@test.com',
                nombre: 'Contacto 2 Test',
                cargo: 'Gerente 2',
            });
        });
    });

    describe('actualizar', () => {
        const crearEmpresa1Dto: CrearEmpresasDto = {
            rut: '11.111.111-1',
            razon_social: 'EMPRESA TEST 1',
            nombre_de_fantasia: 'EMPRESA TEST 1',
            email_factura: 'test1@test.com',
            direccion: 'Calle Test 1',
            id_comunas: 1101,
            telefono: '+56912345678',
            contactos: [
                {
                    email: 'contacto1@test.com',
                    nombre: 'Contacto Test 1',
                    cargo: 'Gerente 1',
                },
            ],
            giros: [11101],
        };

        const crearEmpresa2Dto: CrearEmpresasDto = {
            rut: '11.111.111-2',
            razon_social: 'EMPRESA TEST 2',
            nombre_de_fantasia: 'EMPRESA TEST 2',
            email_factura: 'test1@test.com',
            direccion: 'Calle Test 2',
            id_comunas: 1101,
            telefono: '+56912345678',
            contactos: [
                {
                    email: 'contacto2@test.com',
                    nombre: 'Contacto Test 2',
                    cargo: 'Gerente 2',
                },
            ],
            giros: [11101, 11102],
        };

        const actualizarEmpresaDto: ActualizarEmpresasDto = {
            rut: '11.111.111-1',
            nuevo_rut: '11.111.111-2',
            razon_social: 'EMPRESA TEST 2',
            nombre_de_fantasia: 'EMPRESA TEST 2',
            email_factura: 'test2@test.com',
            direccion: 'Calle Test 2',
            id_comunas: 1101,
            telefono: '+56912345678',
            contactos: [
                {
                    email: 'contacto2@test.com',
                    nombre: 'Contacto Test 2',
                    cargo: 'Gerente 2',
                },
            ],
            giros: [11101, 11102],
        };

        const empresaRetorno: RetornoEmpresasDto = {
            rut: '11.111.111-2',
            razon_social: 'EMPRESA TEST 2',
            nombre_de_fantasia: 'EMPRESA TEST 2',
            email_factura: 'test2@test.com',
            direccion: 'Calle Test 2',
            comuna: {
                id: 1101,
                nombre: 'Iquique',
            },
            telefono: '+56912345678',
            estado: ESTADOS.OPCION_1,
            giros: [
                {
                    codigo: 11101,
                    nombre: 'CULTIVO DE TRIGO',
                    afecto_iva: 'SI',
                    nombre_categorias:
                        'AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA',
                },
                {
                    codigo: 11102,
                    nombre: 'CULTIVO DE MAÍZ',
                    afecto_iva: 'SI',
                    nombre_categorias:
                        'AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA',
                },
            ],
            contactos: [
                {
                    email: 'contacto2@test.com',
                    nombre: 'Contacto Test 2',
                    cargo: 'Gerente 2',
                },
            ],
        };

        it('actualizar empresa correctamente', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresa1Dto);

            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send(actualizarEmpresaDto);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(empresaRetorno);
            expect(res.body).toHaveProperty('createdAt');
            expect(res.body).toHaveProperty('updatedAt');
        });

        it('fallar si el rut que intenta actualizar no existe', async () => {
            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send(actualizarEmpresaDto);

            expect(res.status).toBe(404);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(404);
            expect(res.body.error).toBe('Not Found');
        });

        it('fallar si existen campos adicionales o estan mal escritos', async () => {
            const camposAProbar = [
                {
                    ...actualizarEmpresaDto,
                    ru: actualizarEmpresaDto.rut,
                    rut: undefined,
                }, // Error en rut
                {
                    ...actualizarEmpresaDto,
                    nuevo_ru: actualizarEmpresaDto.nuevo_rut,
                    nuevo_rut: undefined,
                }, // Error en nuevo_rut
                {
                    ...actualizarEmpresaDto,
                    razon_socia: actualizarEmpresaDto.razon_social,
                    razon_social: undefined,
                }, // Error en razon_social
                {
                    ...actualizarEmpresaDto,
                    nombre_de_fantasi: actualizarEmpresaDto.nombre_de_fantasia,
                    nombre_de_fantasia: undefined,
                }, // Error en nombre_de_fantasia
                {
                    ...actualizarEmpresaDto,
                    email_factur: actualizarEmpresaDto.email_factura,
                    email_factura: undefined,
                }, // Error en email_factura
                {
                    ...actualizarEmpresaDto,
                    direccio: actualizarEmpresaDto.direccion,
                    direccion: undefined,
                }, // Error en direccion
                {
                    ...actualizarEmpresaDto,
                    contacto: [
                        { email: 1, nombre: true, cargo: undefined },
                        { email: 2, nombre: 'test', cargo: 'Gerente' },
                    ],
                    contactos: undefined,
                }, // Error intencionado
                {
                    ...actualizarEmpresaDto,
                    giro: [Date.now(), undefined, true, 'sad'],
                    giros: undefined,
                },
            ];

            for (const casoError of camposAProbar) {
                const res = await request(app.getHttpServer())
                    .put(`${ruta}/actualizar`)
                    .send(casoError);
                expect(res.status).toBe(400);
                expect(Array.isArray(res.body.message)).toBe(true);
                expect(res.body.statusCode).toBe(400);
                expect(res.body.error).toBe('Bad Request');
            }
        });

        it('fallar si el nuevo_rut ya lo tiene otra empresa', async () => {
            const crearEmpresa1 = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresa1Dto);
            const crearEmpresa2 = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresa2Dto);

            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send(actualizarEmpresaDto);

            expect(res.status).toBe(409);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(409);
            expect(res.body.error).toBe('Conflict');
        });

        it('fallar si los tipos de datos no son válidos', async () => {
            const casosInvalidos = [
                {
                    ...actualizarEmpresaDto,
                    rut: 123,
                },
                {
                    ...actualizarEmpresaDto,
                    nuevo_rut: 123,
                },
                {
                    ...actualizarEmpresaDto,
                    razon_social: true,
                },
                {
                    ...actualizarEmpresaDto,
                    nombre_de_fantasia: 123,
                },
                {
                    ...actualizarEmpresaDto,
                    email_factura: true,
                },
                {
                    ...actualizarEmpresaDto,
                    direccion: 123,
                },
                {
                    ...actualizarEmpresaDto,
                    contactos: 'no es un array',
                },
            ];

            for (const caso of casosInvalidos) {
                const res = await request(app.getHttpServer())
                    .put(`${ruta}/actualizar`)
                    .send(caso);
                expect(res.status).toBe(400);
                expect(Array.isArray(res.body.message)).toBe(true);
                expect(res.body.statusCode).toBe(400);
                expect(res.body.error).toBe('Bad Request');
            }
        });

        it('fallar si la comuna no existe', async () => {
            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send({ ...actualizarEmpresaDto, id_comunas: 110001 });

            expect(res.status).toBe(404);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(404);
            expect(res.body.error).toBe('Not Found');
        });

        it('fallar si alguno de los giros no existe', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresa1Dto);
            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send({ ...actualizarEmpresaDto, giros: [1110001] });
            expect(res.status).toBe(404);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(404);
            expect(res.body.error).toBe('Not Found');
        });

        it('fallar si alguno de los giros esta duplicado', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresa1Dto);
            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send({ ...actualizarEmpresaDto, giros: [11101, 11101] });
            expect(res.status).toBe(409);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(409);
            expect(res.body.error).toBe('Conflict');
        });

        it('fallar si alguno de los contactos tiene el email duplicado', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresa1Dto);
            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send({
                    ...actualizarEmpresaDto,
                    contactos: [
                        {
                            email: 'contacto@test.com',
                            nombre: 'Contacto Test',
                            cargo: 'Gerente',
                        },
                        {
                            email: 'contacto@test.com',
                            nombre: 'Contacto Test 2',
                            cargo: 'Gerente 2',
                        },
                    ],
                });
            expect(res.status).toBe(409);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(409);
            expect(res.body.error).toBe('Conflict');
        });

        it('Aceptar opcional el campo contactos', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresa1Dto);
            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send({ ...actualizarEmpresaDto, contactos: undefined });

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                ...empresaRetorno,
                contactos: [
                    {
                        email: 'contacto1@test.com',
                        nombre: 'Contacto Test 1',
                        cargo: 'Gerente 1',
                    },
                ],
            });
        });

        it('fallar si la empresa está eliminada', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresa1Dto);
            const eliminarEmpresa = await request(app.getHttpServer()).delete(
                `${ruta}/eliminar/${crearEmpresa.body.rut}`,
            );
            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send(actualizarEmpresaDto);

            expect(res.status).toBe(409);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(409);
            expect(res.body.error).toBe('Conflict');
        });

        it('verificar transformación de datos: email_factura en minúsculas, direccion capitalize, razon_social/nombre_de_fantasia en mayúsculas', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresa1Dto);

            const datosPrueba = {
                ...actualizarEmpresaDto,
                razon_social: 'empresa test actualizada',
                nombre_de_fantasia: 'empresa test actualizada',
                email_factura: 'TEST@TEST.COM',
                direccion: 'CALLE TEST 789',
                contactos: [
                    {
                        email: 'CONTACTO@TEST.COM',
                        nombre: 'CONTACTO TEST',
                        cargo: 'GERENTE',
                    },
                ],
            };

            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send(datosPrueba);
            expect(res.status).toBe(200);
            expect(res.body.razon_social).toBe('EMPRESA TEST ACTUALIZADA');
            expect(res.body.nombre_de_fantasia).toBe(
                'EMPRESA TEST ACTUALIZADA',
            );
            expect(res.body.email_factura).toBe('test@test.com');
            expect(res.body.direccion).toBe('Calle Test 789');
            expect(res.body.contactos[0]).toMatchObject({
                email: 'contacto@test.com',
                nombre: 'Contacto Test',
                cargo: 'Gerente',
            });
        });
    });

    describe('obtener-por-id', () => {
        const crearEmpresaDto: CrearEmpresasDto = {
            rut: '11.111.111-1',
            razon_social: 'EMPRESA TEST',
            nombre_de_fantasia: 'EMPRESA TEST',
            email_factura: 'test@test.com',
            direccion: 'Calle Test',
            id_comunas: 1101,
            telefono: '+56912345678',
            contactos: [
                {
                    email: 'contacto@test.com',
                    nombre: 'Contacto Test',
                    cargo: 'Gerente',
                },
            ],
            giros: [11101],
        };

        const obtenerPorIdEmpresaDto: ObtenerPorIdEmpresasDto = {
            rut: '11.111.111-1',
        };

        const empresaRetorno: RetornoEmpresasDto = {
            rut: '11.111.111-1',
            razon_social: 'EMPRESA TEST',
            nombre_de_fantasia: 'EMPRESA TEST',
            email_factura: 'test@test.com',
            direccion: 'Calle Test',
            comuna: {
                id: 1101,
                nombre: 'Iquique',
            },
            telefono: '+56912345678',
            estado: ESTADOS.OPCION_1,
            giros: [
                {
                    codigo: 11101,
                    nombre: 'CULTIVO DE TRIGO',
                    afecto_iva: 'SI',
                    nombre_categorias:
                        'AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA',
                },
            ],
            contactos: [
                {
                    email: 'contacto@test.com',
                    nombre: 'Contacto Test',
                    cargo: 'Gerente',
                },
            ],
        };

        it('obtener empresa por id correctamente', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresaDto);
            const res = await request(app.getHttpServer()).get(
                `${ruta}/obtener-por-id/${obtenerPorIdEmpresaDto.rut}`,
            );

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(empresaRetorno);

            expect(res.body).toHaveProperty('rut');
            expect(res.body).toHaveProperty('razon_social');
            expect(res.body).toHaveProperty('nombre_de_fantasia');
            expect(res.body).toHaveProperty('email_factura');
            expect(res.body).toHaveProperty('direccion');
            expect(res.body).toHaveProperty('comuna');
            expect(res.body).toHaveProperty('telefono');
            expect(res.body).toHaveProperty('estado');
            expect(res.body).toHaveProperty('giros');
            expect(res.body).toHaveProperty('contactos');
        });

        it('fallar si el id (rut) no es valido', async () => {
            const res = await request(app.getHttpServer()).get(
                `${ruta}/obtener-por-id/123`,
            );

            expect(res.status).toBe(400);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(400);
            expect(res.body.error).toBe('Bad Request');
        });

        it('fallar si el id (rut) no existe', async () => {
            const res = await request(app.getHttpServer()).get(
                `${ruta}/obtener-por-id/11.111.111-2`,
            );

            expect(res.status).toBe(404);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(404);
            expect(res.body.error).toBe('Not Found');
        });

        it('fallar si la empresa está eliminada', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresaDto);
            const eliminarEmpresa = await request(app.getHttpServer()).delete(
                `${ruta}/eliminar/${crearEmpresa.body.rut}`,
            );
            const res = await request(app.getHttpServer()).get(
                `${ruta}/obtener-por-id/${crearEmpresa.body.rut}`,
            );
            expect(res.status).toBe(409);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(409);
            expect(res.body.error).toBe('Conflict');
        });
    });

    describe('obtener-todos', () => {
        const crearEmpresaDto: CrearEmpresasDto = {
            rut: '11.111.111-1',
            razon_social: 'EMPRESA TEST',
            nombre_de_fantasia: 'EMPRESA TEST',
            email_factura: 'test@test.com',
            direccion: 'Calle Ohiggins N°12',
            id_comunas: 1101,
            telefono: '+56912345678',
            contactos: [
                {
                    email: 'contacto@test.com',
                    nombre: 'Contacto Test',
                    cargo: 'Gerente',
                },
            ],
            giros: [11101],
        };

        const empresaRetorno: RetornoEmpresasDto = {
            rut: '11.111.111-1',
            razon_social: 'EMPRESA TEST',
            nombre_de_fantasia: 'EMPRESA TEST',
            email_factura: 'test@test.com',
            direccion: 'Calle Ohiggins N°12',
            comuna: {
                id: 1101,
                nombre: 'Iquique',
            },
            telefono: '+56912345678',
            estado: ESTADOS.OPCION_1,
            giros: [
                {
                    codigo: 11101,
                    nombre: 'CULTIVO DE TRIGO',
                    afecto_iva: 'SI',
                    nombre_categorias:
                        'AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA',
                },
            ],
            contactos: [
                {
                    email: 'contacto@test.com',
                    nombre: 'Contacto Test',
                    cargo: 'Gerente',
                },
            ],
        };

        it('obtener todas las empresas activas', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresaDto);
            const res = await request(app.getHttpServer()).get(
                `${ruta}/obtener-todos`,
            );

            expect(res.status).toBe(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toMatchObject(empresaRetorno);
            expect(res.body[0]).toHaveProperty('rut');
            expect(res.body[0]).toHaveProperty('razon_social');
            expect(res.body[0]).toHaveProperty('nombre_de_fantasia');
            expect(res.body[0]).toHaveProperty('email_factura');
            expect(res.body[0]).toHaveProperty('direccion');
            expect(res.body[0]).toHaveProperty('comuna');
            expect(res.body[0]).toHaveProperty('telefono');
            expect(res.body[0]).toHaveProperty('estado');
            expect(res.body[0]).toHaveProperty('giros');
            expect(res.body[0]).toHaveProperty('contactos');

            expect(res.body[0].estado).toBe(ESTADOS.OPCION_1);
        });

        it('fallar si no hay empresas activas', async () => {
            const res = await request(app.getHttpServer()).get(
                `${ruta}/obtener-todos`,
            );
            expect(res.status).toBe(404);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(404);
            expect(res.body.error).toBe('Not Found');
        });
    });

    describe('obtener-todos-eliminados', () => {
        const crearEmpresaDto: CrearEmpresasDto = {
            rut: '11.111.111-1',
            razon_social: 'EMPRESA TEST',
            nombre_de_fantasia: 'EMPRESA TEST',
            email_factura: 'test@test.com',
            direccion: 'Calle Ohiggins N°12',
            id_comunas: 1101,
            telefono: '+56912345678',
            contactos: [
                {
                    email: 'contacto@test.com',
                    nombre: 'Contacto Test',
                    cargo: 'Gerente',
                },
            ],
            giros: [11101],
        };

        const empresaRetorno: RetornoEmpresasDto = {
            rut: '11.111.111-1',
            razon_social: 'EMPRESA TEST',
            nombre_de_fantasia: 'EMPRESA TEST',
            email_factura: 'test@test.com',
            direccion: 'Calle Ohiggins N°12',
            comuna: {
                id: 1101,
                nombre: 'Iquique',
            },
            telefono: '+56912345678',
            estado: ESTADOS.OPCION_2,
            giros: [
                {
                    codigo: 11101,
                    nombre: 'CULTIVO DE TRIGO',
                    afecto_iva: 'SI',
                    nombre_categorias:
                        'AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA',
                },
            ],
            contactos: [
                {
                    email: 'contacto@test.com',
                    nombre: 'Contacto Test',
                    cargo: 'Gerente',
                },
            ],
        };

        it('obtener todas las empresas eliminadas', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresaDto);
            const eliminarEmpresa = await request(app.getHttpServer()).delete(
                `${ruta}/eliminar/${crearEmpresa.body.rut}`,
            );
            const res = await request(app.getHttpServer()).get(
                `${ruta}/obtener-todos-eliminados`,
            );

            expect(res.status).toBe(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toMatchObject(empresaRetorno);
            expect(res.body[0]).toHaveProperty('rut');
            expect(res.body[0]).toHaveProperty('razon_social');
            expect(res.body[0]).toHaveProperty('nombre_de_fantasia');
            expect(res.body[0]).toHaveProperty('email_factura');
            expect(res.body[0]).toHaveProperty('direccion');
            expect(res.body[0]).toHaveProperty('comuna');
            expect(res.body[0]).toHaveProperty('telefono');
            expect(res.body[0]).toHaveProperty('estado');
            expect(res.body[0]).toHaveProperty('giros');
            expect(res.body[0]).toHaveProperty('contactos');

            expect(res.body[0].estado).toBe(ESTADOS.OPCION_2);
        });

        it('fallar si no hay empresas eliminadas', async () => {
            const res = await request(app.getHttpServer()).get(
                `${ruta}/obtener-todos-eliminados`,
            );
            expect(res.status).toBe(404);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(404);
            expect(res.body.error).toBe('Not Found');
        });
    });

    describe('eliminar', () => {
        const crearEmpresaDto: CrearEmpresasDto = {
            rut: '11.111.111-1',
            razon_social: 'EMPRESA TEST',
            nombre_de_fantasia: 'EMPRESA TEST',
            email_factura: 'test@test.com',
            direccion: 'Calle Test',
            id_comunas: 1101,
            telefono: '+56912345678',
            contactos: [
                {
                    email: 'contacto@test.com',
                    nombre: 'Contacto Test',
                    cargo: 'Gerente',
                },
            ],
            giros: [11101],
        };

        it('eliminar empresa correctamente', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresaDto);

            const res = await request(app.getHttpServer()).delete(
                `${ruta}/eliminar/${crearEmpresa.body.rut}`,
            );

            expect(res.status).toBe(200);
            expect(res.body.rut).toBe(crearEmpresaDto.rut);
            expect(res.body.razon_social).toBe(crearEmpresaDto.razon_social);
            expect(res.body.nombre_de_fantasia).toBe(
                crearEmpresaDto.nombre_de_fantasia,
            );
            expect(res.body.email_factura).toBe(crearEmpresaDto.email_factura);
            expect(res.body.estado).toBe(ESTADOS.OPCION_2);
        });

        it('fallar si el rut no es valido', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresaDto);

            const res = await request(app.getHttpServer()).delete(
                `${ruta}/eliminar/123`,
            );

            expect(res.status).toBe(400);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(400);
            expect(res.body.error).toBe('Bad Request');
        });

        it('fallar si el rut no existe', async () => {
            const crearEmpresa = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearEmpresaDto);

            const res = await request(app.getHttpServer()).delete(
                `${ruta}/eliminar/11.111.111-2`,
            );

            expect(res.status).toBe(404);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(404);
            expect(res.body.error).toBe('Not Found');
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
