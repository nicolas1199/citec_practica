import { NestFactory, Reflector } from '@nestjs/core';
import {
    ForbiddenException,
    ValidationPipe,
    BadRequestException,
    ValidationError,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { JwtAuthGuard } from './auth/guards/jwt/jwt.guard'; // Asegúrate de importar el guard
import { JwtService } from '@nestjs/jwt';
import { LogsMiddleware } from './common/middlewares/logs.middleware';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory: (errors: ValidationError[]) => {
                const messages = errors.flatMap((err) => {
                    const constraints = Object.values(err.constraints || {});
                    const customMessages = constraints.map((constraint) => {
                        if (constraint.includes('should not exist')) {
                            return `La propiedad '${err.property}' no debería existir`;
                        }
                        return constraint.replace(
                            'property',
                            `La propiedad '${err.property}'`,
                        );
                    });
                    return customMessages;
                });
                return new BadRequestException(messages);
            },
            transform: true,
        }),
    );

    app.useGlobalGuards(
        new JwtAuthGuard(app.get(JwtService), app.get(Reflector)),
    );

    /**
     * Indicar el prefijo de la API
     * Todas las rutas comienzan con /api/:clave
     * Y tienen clave de acceso
     */
    app.setGlobalPrefix('api');

    /**
     * Manejo de problemas de CORS
     */
    app.enableCors({
        origin: (origin, callback) => {
            const whitelist = [process.env.FRONTEND_URL];
            console.log(`Origen: ${origin}`);
            if (!origin) {
                callback(null, true);
                return;
            }
            if (!whitelist.includes(origin)) {
                callback(
                    new ForbiddenException('No permitido por CORS'),
                    false,
                );
                return;
            }

            callback(null, true);
        },
        methods: 'GET,PUT,POST,DELETE',
        credentials: true,
    });

    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', true); // Configurar trust proxy

    /**
     * Middleware para log de las peticiones
     * Loggea la ip, la ruta y la fecha y hora de la peticion
     * Formateada en español
     */
    if (process.env.NODE_ENV !== 'render') {
        app.use(new LogsMiddleware().use);
    }

    /**
     * Titulo de la API
     * Descripcion de la API
     */
    const titulo = '(REST API) Documentacion backend para proyecto Citec UBB';
    const descripcion =
        'Se usan las siguientes tecnologias:\n' +
        '- NestJS\n\n' +
        '- TypeScript\n\n' +
        '- NodeJS\n\n' +
        '- Sequelize ORM (Mysql)';
    const config = new DocumentBuilder()
        .setTitle(titulo)
        .setDescription(descripcion)
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http', // Define el tipo de autenticación
                scheme: 'bearer', // Especifica que es un token Bearer
                bearerFormat: 'JWT', // Define el formato como JWT
                description: 'Ingresa el token JWT', // Descripción del campo
            },
            'bearer', // Este es el nombre del esquema de seguridad
        )
        .addSecurityRequirements('bearer')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(process.env.PORT || 4000);
}
bootstrap();
