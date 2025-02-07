import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsuariosModule } from '../usuarios.module';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { Usuarios } from '../../database/models/usuarios.model';
import { Tipos } from '../../database/models/tipos.model';
import { TIPOS_DE_USUARIO } from '../../common/constants/tipos-usuarios.constants';
import {
    ActualizarUsuariosDto,
    CrearUsuariosDto,
    ObtenerPorIdUsuariosDto,
} from '../dtos/usuarios.dto';
import { ESTADOS } from '../../common/constants/estados.constants';

describe('UsuariosController', () => {
    let app: INestApplication;

    const token = process.env.TOKEN_AUTORIZACION;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                SequelizeModule.forRoot({
                    dialect: 'sqlite',
                    storage: ':memory:',
                    models: [Usuarios, Tipos], // Registra el modelo
                    logging: false,
                    autoLoadModels: true,
                    synchronize: true,
                }),
                SequelizeModule.forFeature([Usuarios, Tipos]), // Importante: registramos los modelo
                UsuariosModule,
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
        const tiposModel = app.get(getModelToken(Tipos));
        const tipos = Object.values(TIPOS_DE_USUARIO);
        for (const tipo of tipos) {
            await tiposModel.create({
                nombre: tipo,
            });
        }
    });

    const ruta = '/usuarios';

    describe('crear', () => {
        const crearUsuarioDto: CrearUsuariosDto = {
            email: 'test@test.com',
            nombre: 'Test',
            apellido: 'Test',
            contraseña: '123456',
            nombre_tipos: TIPOS_DE_USUARIO.OPCION_1,
        };

        it('crear usuario correctamente', async () => {
            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearUsuarioDto);

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
                email: crearUsuarioDto.email,
                nombre: crearUsuarioDto.nombre,
                apellido: crearUsuarioDto.apellido,
                nombre_tipos: crearUsuarioDto.nombre_tipos,
            });
            expect(res.body).toHaveProperty('createdAt');
            expect(res.body).toHaveProperty('updatedAt');

            // Verificar que la contraseña sea un hash
            expect(res.body.contraseña).not.toBe(crearUsuarioDto.contraseña);
            expect(res.body.contraseña).toMatch(/^\$2[ayb]\$.{56}$/); // Patrón de hash bcrypt
        });

        it('fallar si existen campos adicionales o estan mal escritos', async () => {
            // Probar cada campo faltante
            const camposAProbar = [
                {
                    ...crearUsuarioDto,
                    emai: crearUsuarioDto.email,
                    email: undefined,
                }, // Error en email
                {
                    ...crearUsuarioDto,
                    nombr: crearUsuarioDto.nombre,
                    nombre: undefined,
                }, // Error en nombre
                {
                    ...crearUsuarioDto,
                    apellid: crearUsuarioDto.apellido,
                    apellido: undefined,
                }, // Error en apellido
                {
                    ...crearUsuarioDto,
                    contraseñ: crearUsuarioDto.contraseña,
                    contraseña: undefined,
                }, // Error en contraseña
                {
                    ...crearUsuarioDto,
                    nombre_tipo: crearUsuarioDto.nombre_tipos,
                    nombre_tipos: undefined,
                }, // Error en nombre_tipos
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

        it('fallar si el email ya existe', async () => {
            const crearUsuarioAntes = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearUsuarioDto);

            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearUsuarioDto);

            expect(res.status).toBe(409);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(409);
            expect(res.body.error).toBe('Conflict');
        });

        it('fallar si los tipos de datos no son válidos', async () => {
            const casosInvalidos = [
                { ...crearUsuarioDto, email: 123 }, // Error intencionado: número en lugar de string
                { ...crearUsuarioDto, nombre: true }, // Error intencionado: booleano en lugar de string
                { ...crearUsuarioDto, apellido: 123 }, // Error intencionado: número en lugar de string
                { ...crearUsuarioDto, contraseña: true }, // Error intencionado: booleano en lugar de string
                { ...crearUsuarioDto, nombre_tipos: 'tipo_invalido' }, // Error intencionado: string inválido
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

        it('verificar transformación de datos: email en minúsculas, nombre/apellido capitalize, nombre_tipos en mayúsculas', async () => {
            const datosPrueba = {
                ...crearUsuarioDto,
                email: 'USUARIO@TEST.COM',
                nombre: 'jUaN',
                apellido: 'pEREz',
                nombre_tipos: 'administrador',
            };

            const res = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(datosPrueba);
            expect(res.status).toBe(201);
            expect(res.body.email).toBe('usuario@test.com');
            expect(res.body.nombre).toBe('Juan');
            expect(res.body.apellido).toBe('Perez');
            expect(res.body.nombre_tipos).toBe('ADMINISTRADOR');
        });
    });

    describe('actualizar', () => {
        const crearUsuarioDto: CrearUsuariosDto = {
            email: 'test@test.com',
            nombre: 'Test',
            apellido: 'Test',
            contraseña: '123456',
            nombre_tipos: TIPOS_DE_USUARIO.OPCION_1,
        };

        const crearUsuario2Dto: CrearUsuariosDto = {
            email: 'test2@test.com',
            nombre: 'Test2',
            apellido: 'Test2',
            contraseña: '123456',
            nombre_tipos: TIPOS_DE_USUARIO.OPCION_1,
        };

        const actualizarUsuarioDto: ActualizarUsuariosDto = {
            email: 'test@test.com',
            nuevo_email: 'test2@test.com',
            nombre: 'Test',
            apellido: 'Test',
            contraseña: '123456',
            nombre_tipos: TIPOS_DE_USUARIO.OPCION_1,
        };

        it('actualizar usuario correctamente', async () => {
            const crearUsuario = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearUsuarioDto);

            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send(actualizarUsuarioDto);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                email: actualizarUsuarioDto.nuevo_email,
                nombre: actualizarUsuarioDto.nombre,
                apellido: actualizarUsuarioDto.apellido,
                nombre_tipos: actualizarUsuarioDto.nombre_tipos,
            });
            expect(res.body).toHaveProperty('createdAt');
            expect(res.body).toHaveProperty('updatedAt');

            // Verificar que la contraseña sea un hash
            expect(res.body.contraseña).not.toBe(
                actualizarUsuarioDto.contraseña,
            );
            expect(res.body.contraseña).toMatch(/^\$2[ayb]\$.{56}$/); // Patrón de hash bcrypt
        });

        it('fallar si el email que intenta actualizar no existe', async () => {
            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send(actualizarUsuarioDto);

            expect(res.status).toBe(404);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(404);
            expect(res.body.error).toBe('Not Found');
        });

        it('fallar si existen campos adicionales o estan mal escritos', async () => {
            // Probar cada campo faltante
            const camposAProbar = [
                {
                    ...actualizarUsuarioDto,
                    emai: actualizarUsuarioDto.email,
                    email: undefined,
                }, // Error en email
                {
                    ...actualizarUsuarioDto,
                    email_n: actualizarUsuarioDto.nuevo_email,
                    nuevo_email: undefined,
                }, // Error en el nuevo email
                {
                    ...actualizarUsuarioDto,
                    nombr: actualizarUsuarioDto.nombre,
                    nombre: undefined,
                }, // Error en nombre
                {
                    ...actualizarUsuarioDto,
                    apellid: actualizarUsuarioDto.apellido,
                    apellido: undefined,
                }, // Error en apellido
                {
                    ...actualizarUsuarioDto,
                    contraseñ: actualizarUsuarioDto.contraseña,
                    contraseña: undefined,
                }, // Error en contraseña
                {
                    ...actualizarUsuarioDto,
                    nombre_tipo: actualizarUsuarioDto.nombre_tipos,
                    nombre_tipos: undefined,
                }, // Error en nombre_tipos
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

        it('fallar si el nuevo_email ya lo tiene otro usuario', async () => {
            const crearUsuario1 = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearUsuarioDto);
            const crearUsuario2 = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearUsuario2Dto);

            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send(actualizarUsuarioDto);

            expect(res.status).toBe(409);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(409);
            expect(res.body.error).toBe('Conflict');
        });

        it('fallar si los tipos de datos no son válidos', async () => {
            const casosInvalidos = [
                {
                    ...actualizarUsuarioDto,
                    email: 123, // Error intencionado: número en lugar de string
                },
                {
                    ...actualizarUsuarioDto,
                    nuevo_email: 123, // Error intencionado: número en lugar de string
                },
                {
                    ...actualizarUsuarioDto,
                    nombre: true, // Error intencionado: booleano en lugar de string
                },
                {
                    ...actualizarUsuarioDto,
                    apellido: 123, // Error intencionado: número en lugar de string
                },
                {
                    ...actualizarUsuarioDto,
                    contraseña: true, // Error intencionado: booleano en lugar de string
                },
                {
                    ...actualizarUsuarioDto,
                    nombre_tipos: 'tipo_invalido', // Error intencionado: string inválido
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

        it('verificar transformación de datos: email/nuevo_email en minúsculas, nombre/apellido capitalize, nombre_tipos en mayúsculas', async () => {
            const crearUsuario = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearUsuarioDto);
            const datosPrueba: any = {
                ...actualizarUsuarioDto,
                email: 'TEST@TEST.COM',
                nuevo_email: 'TEST2@TEST.COM',
                nombre: 'jUaN',
                apellido: 'pEREz',
                nombre_tipos: 'administrador',
            };

            const res = await request(app.getHttpServer())
                .put(`${ruta}/actualizar`)
                .send(datosPrueba);
            expect(res.status).toBe(200);
            expect(res.body.email).toBe('test2@test.com');
            expect(res.body.nombre).toBe('Juan');
            expect(res.body.apellido).toBe('Perez');
            expect(res.body.nombre_tipos).toBe('ADMINISTRADOR');
        });
    });

    describe('obtener-por-id', () => {
        const crearUsuarioDto: CrearUsuariosDto = {
            email: 'test@test.com',
            nombre: 'Test',
            apellido: 'Test',
            contraseña: '123456',
            nombre_tipos: TIPOS_DE_USUARIO.OPCION_1,
        };

        const obtenerPorIdUsuarioDto: ObtenerPorIdUsuariosDto = {
            email: 'test@test.com',
        };

        const usuario = {
            email: 'test@test.com',
            nombre: 'Test',
            apellido: 'Test',
            contraseña: expect.any(String),
            estado: ESTADOS.OPCION_1,
            nombre_tipos: TIPOS_DE_USUARIO.OPCION_1,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        };

        it('obtener usuario por id correctamente', async () => {
            const crearUsuario = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearUsuarioDto);
            const res = await request(app.getHttpServer()).get(
                `${ruta}/obtener-por-id/${obtenerPorIdUsuarioDto.email}`,
            );

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(usuario);

            expect(res.body).toHaveProperty('email');
            expect(res.body).toHaveProperty('nombre');
            expect(res.body).toHaveProperty('apellido');
            expect(res.body).toHaveProperty('contraseña');
            expect(res.body).toHaveProperty('estado');
            expect(res.body).toHaveProperty('nombre_tipos');
            expect(res.body).toHaveProperty('createdAt');
            expect(res.body).toHaveProperty('updatedAt');
        });

        it('fallar si el id (email) no es valido', async () => {
            const res = await request(app.getHttpServer()).get(
                `${ruta}/obtener-por-id/123`,
            );

            expect(res.status).toBe(400);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(400);
            expect(res.body.error).toBe('Bad Request');
        });

        it('fallar si el id (email) no existe', async () => {
            const res = await request(app.getHttpServer()).get(
                `${ruta}/obtener-por-id/a@gmail.com`,
            );

            expect(res.status).toBe(404);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(404);
            expect(res.body.error).toBe('Not Found');
        });
    });

    describe('obtener-todos', () => {
        const crearUsuarioDto: CrearUsuariosDto = {
            email: 'test@test.com',
            nombre: 'Test',
            apellido: 'Test',
            contraseña: '123456',
            nombre_tipos: TIPOS_DE_USUARIO.OPCION_1,
        };

        const usuario = {
            email: 'test@test.com',
            nombre: 'Test',
            apellido: 'Test',
            contraseña: expect.any(String),
            estado: ESTADOS.OPCION_1,
            nombre_tipos: TIPOS_DE_USUARIO.OPCION_1,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        };

        it('obtener todos los usuarios activos', async () => {
            const crearUsuario = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearUsuarioDto);
            const res = await request(app.getHttpServer()).get(
                `${ruta}/obtener-todos`,
            );

            expect(res.status).toBe(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toMatchObject(usuario);
            expect(res.body[0]).toHaveProperty('email');
            expect(res.body[0]).toHaveProperty('nombre');
            expect(res.body[0]).toHaveProperty('apellido');
            expect(res.body[0]).toHaveProperty('contraseña');
            expect(res.body[0]).toHaveProperty('estado');
            expect(res.body[0]).toHaveProperty('nombre_tipos');
            expect(res.body[0]).toHaveProperty('createdAt');
            expect(res.body[0]).toHaveProperty('updatedAt');

            expect(res.body[0].estado).toBe(ESTADOS.OPCION_1);
        });
    });

    describe('obtener-todos-eliminados', () => {
        const crearUsuarioDto: CrearUsuariosDto = {
            email: 'test@test.com',
            nombre: 'Test',
            apellido: 'Test',
            contraseña: '123456',
            nombre_tipos: TIPOS_DE_USUARIO.OPCION_1,
        };

        const usuario = {
            email: 'test@test.com',
            nombre: 'Test',
            apellido: 'Test',
            contraseña: expect.any(String),
            estado: ESTADOS.OPCION_2,
            nombre_tipos: TIPOS_DE_USUARIO.OPCION_1,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        };

        it('obtener todos los usuarios eliminados', async () => {
            const crearUsuario = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearUsuarioDto);
            const eliminarUsuario = await request(app.getHttpServer()).delete(
                `${ruta}/eliminar/${crearUsuario.body.email}`,
            );

            const res = await request(app.getHttpServer()).get(
                `${ruta}/obtener-todos-eliminados`,
            );

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toMatchObject(usuario);
            expect(res.body[0]).toHaveProperty('email');
            expect(res.body[0]).toHaveProperty('nombre');
            expect(res.body[0]).toHaveProperty('apellido');
            expect(res.body[0]).toHaveProperty('contraseña');
            expect(res.body[0]).toHaveProperty('estado');
            expect(res.body[0]).toHaveProperty('nombre_tipos');
            expect(res.body[0]).toHaveProperty('createdAt');
            expect(res.body[0]).toHaveProperty('updatedAt');

            expect(res.body[0].estado).toBe(ESTADOS.OPCION_2);
        });
    });

    describe('eliminar', () => {
        const crearUsuarioDto: CrearUsuariosDto = {
            email: 'test@test.com',
            nombre: 'Test',
            apellido: 'Test',
            contraseña: '123456',
            nombre_tipos: TIPOS_DE_USUARIO.OPCION_1,
        };

        it('eliminar usuario correctamente', async () => {
            const crearUsuario = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearUsuarioDto);

            const res = await request(app.getHttpServer()).delete(
                `${ruta}/eliminar/${crearUsuario.body.email}`,
            );

            expect(res.status).toBe(200);
            expect(res.body.email).toBe(crearUsuarioDto.email);
            expect(res.body.nombre).toBe(crearUsuarioDto.nombre);
            expect(res.body.apellido).toBe(crearUsuarioDto.apellido);
            expect(res.body.nombre_tipos).toBe(crearUsuarioDto.nombre_tipos);
            expect(res.body.estado).toBe(ESTADOS.OPCION_2);
        });

        it('fallar si el email no es valido', async () => {
            const crearUsuario = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearUsuarioDto);

            const res = await request(app.getHttpServer()).delete(
                `${ruta}/eliminar/123`,
            );

            expect(res.status).toBe(400);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(400);
            expect(res.body.error).toBe('Bad Request');
        });

        it('fallar si el email no existe', async () => {
            const crearUsuario = await request(app.getHttpServer())
                .post(`${ruta}/crear`)
                .send(crearUsuarioDto);

            const res = await request(app.getHttpServer()).delete(
                `${ruta}/eliminar/a@gmail.com`,
            );

            expect(res.status).toBe(404);
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.statusCode).toBe(404);
            expect(res.body.error).toBe('Not Found');
        });
    });

    // describe('iniciar-sesion', () => {

    //     const crearUsuarioDto: CrearUsuariosDto = {
    //         email: 'test@test.com',
    //         nombre: 'Test',
    //         apellido: 'Test',
    //         contraseña: '123456',
    //         nombre_tipos: TIPOS_DE_USUARIO.OPCION_1,
    //     };

    //     const iniciarSesionDto: IniciarSesionDto = {
    //         email: 'test@test.com',
    //         contraseña: '123456',
    //     };

    //     it('iniciar sesion correctamente', async () => {
    //         const crearUsuario = await request(app.getHttpServer()).post(`${ruta}/crear`).send(crearUsuarioDto);

    //         const res = await request(app.getHttpServer()).post(`${ruta}/iniciar-sesion`).send(iniciarSesionDto);

    //         expect(res.status).toBe(200);
    //         expect(res.body.email).toBe(crearUsuarioDto.email);
    //         expect(res.body.nombre).toBe(crearUsuarioDto.nombre);
    //         expect(res.body.apellido).toBe(crearUsuarioDto.apellido);
    //         expect(res.body.nombre_tipos).toBe(crearUsuarioDto.nombre_tipos);
    //         expect(res.body.estado).toBe(ESTADOS.OPCION_1);
    //         expect(res.body.token).toBeDefined();

    //     });
    // });

    afterAll(async () => {
        await app.close();
    });
});
