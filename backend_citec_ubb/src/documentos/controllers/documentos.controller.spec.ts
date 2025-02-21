import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DocumentosModule } from '../documentos.module';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import Documentos from 'src/database/models/documentos.model';
import { AreasDocumentos } from 'src/database/models/area-documento.model';
import { AREAS_DE_DOCUMENTO } from 'src/common/constants/area-documentos.constants';
import { ActualizarDocumentoDto, CrearDocumentoDto } from '../dto/documento.dto';
import { VALIDEZ_DE_DOCUMENTO } from 'src/common/constants/validez-de-documento.constants';
import ValidezDocumentos from 'src/database/models/validez-documento.model';

describe('DocumentosController', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                SequelizeModule.forRoot({
                    dialect: 'sqlite',
                    storage: ':memory:',
                    models: [
                        Documentos,
                        AreasDocumentos,
                    ],
                    autoLoadModels: true,
                    synchronize: true
                }),
                SequelizeModule.forFeature([
                    Documentos,
                    AreasDocumentos,
                ]),
                DocumentosModule
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
        const areasModel = app.get(getModelToken(AreasDocumentos));
        const areas = Object.values(AREAS_DE_DOCUMENTO);
        for (const area of areas) {
            await areasModel.create({
                nombre: area,
            });
        }
        const validezModel = app.get(getModelToken(ValidezDocumentos));
        const validez = Object.values(VALIDEZ_DE_DOCUMENTO);
        for (const val of validez) {
            await validezModel.create({
                nombre: val,
            });
        }
    });

    const ruta = '/documentos'

    describe('Areas', () => {
        it('Deben existir al menos 2 areas', async () => {
            const areasModel = app.get(getModelToken(AreasDocumentos));
            const count = await areasModel.count();
            expect(count).toBeGreaterThanOrEqual(2);
        });
    })
    describe('Validez', () => {
        it('Deben existir al menos 3 estados de validez', async () => {
            const validezModel = app.get(getModelToken(ValidezDocumentos));
            const count = await validezModel.count();
            expect(count).toBeGreaterThanOrEqual(3);
        });
    })

    describe('crear', () => {
        const crearDocumento: CrearDocumentoDto = {
            nombre: 'AUX',
            cliente: 'TEST',
            ejecutor: 'CITEC UBB',
            direccion: 'CONCEPCION',
            area_documento: AREAS_DE_DOCUMENTO.OPCION_1,
            fecha_inicio: new Date(2025, 1, 1, 12),
            fecha_finalizacion: new Date(2025, 1, 1, 12),
            validez_documento: VALIDEZ_DE_DOCUMENTO.OPCION_3
        }
        it('Crear documento correctamente', async () => {
            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(CrearDocumentoDto);

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
                nombre: crearDocumento.nombre,
                cliente: crearDocumento.cliente,
                ejecutor: crearDocumento.ejecutor,
                area_documento: crearDocumento.area_documento,
                fecha_inicio: crearDocumento.fecha_inicio,
                fecha_finalizacion: crearDocumento.fecha_finalizacion,

            });
            expect(res.body).toHaveProperty('updatedAt');
            expect(res.body).toHaveProperty('createdAt');
        })
        it('fallar si existen campos adicionales o estan mal escritos', async () => {
            // Probar cada campo faltante
            const camposAProbar = [
                {
                    ...crearDocumento,
                    nombr: crearDocumento.nombre,
                    nombre: undefined,
                }, // Error en nombre
                {
                    ...crearDocumento,
                    client: crearDocumento.cliente,
                    cliente: undefined,
                }, // Error en cliente
                {
                    ...crearDocumento,
                    ejecuto: crearDocumento.ejecutor,
                    ejecutor: undefined,
                }, // Error en ejecutor
                {
                    ...crearDocumento,
                    area_document: crearDocumento.area_documento,
                    area_documento: undefined,
                }, // Error en area_documento
                {
                    ...crearDocumento,
                    fecha_inici: crearDocumento.fecha_inicio,
                    fecha_inicio: undefined,
                }, // Error en fecha_inicio
                {
                    ...crearDocumento,
                    fecha_finalizacio: crearDocumento.fecha_finalizacion,
                    fecha_finalizacion: undefined,
                }, // Error en fecha_finalizacion
                {
                    ...crearDocumento,
                    validez_document: crearDocumento.validez_documento,
                    validez_documento: undefined,
                }, // Error en la validez

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
        })

        it('fallar si el nombre ya existe', async () => {
            const crearDocumentoAntes = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearDocumento);

            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearDocumento);

            expect(res.status).toBe(409);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(409);
            expect(res.body.error).toBe('Conflict');
        });

        it('fallar si los tipos de datos no son válidos', async () => {
            const casosInvalidos = [
                { ...crearDocumento, nombre: true }, // Error intencionado: booleano en lugar de string
                { ...crearDocumento, ejecutor: true }, // Error intencionado: booleano en lugar de string
                { ...crearDocumento, cliente: 123 }, // Error intencionado: número en lugar de string
                { ...crearDocumento, direccion: 123 }, // Error intencionado: número en lugar de string
                { ...crearDocumento, fecha_inicio: true }, // Error intencionado: booleano o numero en lugar de string
                { ...crearDocumento, fecha_finalizacion: true }, // Error intencionado: booleano o numero en lugar de string
                { ...crearDocumento, area_documento: 'area_invalida' }, // Error intencionado: string inválido
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
        it('verificar transformación de datos: nombre, cliente, ejecutor, direccion y area en mayusculas', async () => {
            const datosPrueba = {
                ...crearDocumento,
                nombre: 'aUx',
                ejecutor: 'CITec Ubb',
                cliente: 'AnoNimo',
                direccion: 'ConcEpcioN',
                area_documento: 'aa',
            }
            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(datosPrueba);
            expect(res.status).toBe(201);
            expect(res.body.nombre).toBe('AUX');
            expect(res.body.ejecutor).toBe('CITEC UBB');
            expect(res.body.cliente).toBe('ANONIMO');
            expect(res.body.direccion).toBe('CONCEPCION');
            expect(res.body.nombre_tipos).toBe('AA');
        })

    })

    describe('actualizar', () => {
        const crearDocumento: CrearDocumentoDto = {
            nombre: 'AUX',
            cliente: 'TEST',
            ejecutor: 'CITEC UBB',
            direccion: 'CONCEPCION',
            area_documento: AREAS_DE_DOCUMENTO.OPCION_1,
            fecha_inicio: new Date(2025, 1, 1, 12),
            fecha_finalizacion: new Date(2025, 1, 1, 12),
            validez_documento: VALIDEZ_DE_DOCUMENTO.OPCION_3
        }
        const crearDocumento2: CrearDocumentoDto = {
            nombre: 'AUX2',
            cliente: 'TEST',
            ejecutor: 'CITEC UBB',
            direccion: 'CONCEPCION2',
            area_documento: AREAS_DE_DOCUMENTO.OPCION_2,
            fecha_inicio: new Date(2025, 1, 5, 12),
            fecha_finalizacion: new Date(2025, 1, 12, 12),
            validez_documento: VALIDEZ_DE_DOCUMENTO.OPCION_2
        }
        const actualizarDocumento: ActualizarDocumentoDto = {
            cliente: 'TEST',
            ejecutor: 'CITEC UBB',

            nombre: 'AUX',
            nuevo_nombre: 'AUX2',

            direccion: 'CONCEPCION',
            nueva_direccion: 'CONCEPCION2',

            area_documento: AREAS_DE_DOCUMENTO.OPCION_1,
            nueva_area_documento: AREAS_DE_DOCUMENTO.OPCION_2,

            fecha_inicio: new Date(2025, 1, 1, 12),
            nueva_fecha_inicio: new Date(2025, 1, 5, 12),

            fecha_finalizacion: new Date(2025, 1, 1, 12),
            nueva_fecha_finalizacion: new Date(2025, 1, 12, 12),
            numero: 0,

            nueva_validez_documento: '',
            validez_documento: ''
        }
        it('actualizar documento correctamente', async () => {
            const crearUsuario = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearDocumento);

            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send(actualizarDocumento);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                nombre: actualizarDocumento.nombre,
                direccion: actualizarDocumento.nueva_direccion,
                area_documento: actualizarDocumento.nueva_area_documento,
                fecha_inicio: actualizarDocumento.nueva_fecha_inicio,
                fecha_finalizacion: actualizarDocumento.nueva_fecha_finalizacion,
            });
            expect(res.body).toHaveProperty('createdAt');
            expect(res.body).toHaveProperty('updatedAt');
        });
        it('fallar si el documento que intenta actualizar no existe', async () => {
            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send(actualizarDocumento);

            expect(res.status).toBe(404);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(404);
            expect(res.body.error).toBe('Not Found');
        });
        it('fallar si existen campos adicionales o estan mal escritos', async () => {
            // Probar cada campo faltante
            const camposAProbar = [
                {
                    ...actualizarDocumento,
                    nombr: actualizarDocumento.nombre,
                    nombre: undefined,
                }, // Error en nombre
                {
                    ...actualizarDocumento,
                    nombre_n: actualizarDocumento.nuevo_nombre,
                    nuevo_nombre: undefined,
                }, // Error en el nuevo nombre
                {
                    ...actualizarDocumento,
                    direccio: actualizarDocumento.direccion,
                    direccion: undefined,
                }, // Error en la direccion
                {
                    ...actualizarDocumento,
                    direccion_n: actualizarDocumento.nueva_direccion,
                    nueva_direccion: undefined,
                }, // Error en el nueva direccion
                {
                    ...actualizarDocumento,
                    area_document: actualizarDocumento.area_documento,
                    area_documento: undefined,
                }, // Error en area_documento
                {
                    ...actualizarDocumento,
                    area_documento_n: actualizarDocumento.nueva_area_documento,
                    nueva_area_documento: undefined,
                }, // Error en nueva area
                {
                    ...actualizarDocumento,
                    fecha_inici: actualizarDocumento.fecha_inicio,
                    fecha_inicio: undefined,
                }, // Error en fecha de inicio
                {
                    ...actualizarDocumento,
                    fecha_inicio_n: actualizarDocumento.nueva_fecha_inicio,
                    nueva_fecha_inicio: undefined,
                }, // Error en nueva fecha de inicio
                {
                    ...actualizarDocumento,
                    fecha_finalizacio: actualizarDocumento.fecha_finalizacion,
                    fecha_finalizacion: undefined,
                }, // Error en fecha de finalizacion
                {
                    ...actualizarDocumento,
                    fecha_finalizacion_n: actualizarDocumento.nueva_fecha_finalizacion,
                    nueva_fecha_finalizacion: undefined,
                }, // Error en nueva_fecha_finalizacion

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
    })

    afterAll(async () => {
        await app.close();
    });
});
