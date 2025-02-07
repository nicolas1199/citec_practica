import { SetMetadata, applyDecorators } from '@nestjs/common';
import { TiposDeUsuario } from '../constants/tipos-usuarios.constants';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorRespuestaDto } from '../dtos/error-respuesta.dto';
export const Public = () => SetMetadata('isPublic', true);

export const TIPOS_DE_USUARIO_KEY = 'tiposDeUsuario';
export const Tipo = (...tiposDeUsuario: TiposDeUsuario[]) =>
    SetMetadata(TIPOS_DE_USUARIO_KEY, tiposDeUsuario);

export function ApiRespuestaError() {
    return applyDecorators(
        ApiResponse({
            status: 400,
            description: 'Hay un error en la solicitud (Bad Request)',
            type: ErrorRespuestaDto,
        }),
        ApiResponse({
            status: 403,
            description: 'Acceso prohibido (Forbidden)',
            type: ErrorRespuestaDto,
        }),
        ApiResponse({
            status: 404,
            description: 'No encontrado (Not Found)',
            type: ErrorRespuestaDto,
        }),
        ApiResponse({
            status: 409,
            description: 'Conflicto, recurso ya existente (Conflict)',
            type: ErrorRespuestaDto,
        }),
        ApiResponse({
            status: 500,
            description: 'Error interno del servidor (Internal Server Error)',
            type: ErrorRespuestaDto,
        }),
    );
}
