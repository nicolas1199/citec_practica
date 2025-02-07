import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';
import { ConfigService } from '@nestjs/config'; // Importa el ConfigService
import { IniciarSesionDto } from '../../../usuarios/dtos/usuarios.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usuariosService: UsuariosService,
        private configService: ConfigService, // Inyecta el ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('config.jwt.secret'), // Obtén la clave secreta desde el configService
        });
    }

    async validate(payload: IniciarSesionDto) {
        return this.usuariosService.obtenerPorId(payload); // Devuelve el usuario asociado al payload
    }
}
