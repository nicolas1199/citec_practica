import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TIPOS_DE_USUARIO_KEY } from '../../../common/utils/decorators';
import { TiposDeUsuario } from '../../../common/constants/tipos-usuarios.constants';
import { JwtService } from '@nestjs/jwt';
import { Usuarios } from '../../../database/models/usuarios.model';
import { ESTADOS } from '../../../common/constants/estados.constants';

@Injectable()
export class TiposGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<
            TiposDeUsuario[]
        >(TIPOS_DE_USUARIO_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            throw new ForbiddenException('Acceso denegado');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new ForbiddenException('Acceso denegado');
        }

        try {
            const usuarioToken: Usuarios = this.jwtService.verify(token);

            const usuario = await Usuarios.findOne({
                where: { email: usuarioToken.email },
            });

            if (!usuario) {
                throw new ForbiddenException('Acceso denegado');
            }

            if (usuario.estado !== ESTADOS.OPCION_1) {
                throw new ForbiddenException('Acceso denegado');
            }
            // console.log(usuario.nombre_tipos);

            return requiredRoles.includes(
                usuario.nombre_tipos as TiposDeUsuario,
            );
        } catch (error) {
            throw new ForbiddenException('Acceso denegado');
        }
    }
}
