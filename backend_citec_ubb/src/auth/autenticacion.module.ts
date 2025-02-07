import { Module } from '@nestjs/common';
import { AutenticacionService } from './services/autenticacion.service';
import { JwtModule } from '@nestjs/jwt';
import { AutenticacionController } from './controllers/autenticacion.controller';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './guards/jwt/jwt.strategy';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('config.jwt.secret'), // Accede a JWT_SECRET desde la configuración
                signOptions: { expiresIn: '7d' },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AutenticacionService, UsuariosService, JwtStrategy],
    controllers: [AutenticacionController],
    exports: [JwtModule],
})
export class AutenticacionModule {}
