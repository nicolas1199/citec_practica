import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import Usuarios from '../../../database/models/usuarios.model';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<boolean>(
            'isPublic',
            context.getHandler(),
        );
        if (isPublic) {
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
            /**
             * Verify desencripta el token y devuelve el payload
             */

            const usuarioToken: Usuarios = this.jwtService.verify(token);

            //request.usuario = usuarioToken;
            return true;
        } catch (error) {
            throw new ForbiddenException('Acceso denegado');
        }
    }
}
