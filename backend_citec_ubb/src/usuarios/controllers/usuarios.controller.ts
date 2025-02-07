import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    ActualizarUsuariosDto,
    CrearUsuariosDto,
    EliminarUsuariosDto,
    ObtenerPorIdUsuariosDto,
} from '../dtos/usuarios.dto';
import { Usuarios } from '../../database/models/usuarios.model';

import { UsuariosService } from '../services/usuarios.service';
import { ApiRespuestaError, Tipo } from '../../common/utils/decorators';
import { BaseControllers } from '../../common/base/base-controllers.class';
import { TIPOS_DE_USUARIO } from '../../common/constants/tipos-usuarios.constants';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController extends BaseControllers {
    constructor(private usuariosServicio: UsuariosService) {
        super();
    }

    @ApiOperation({ summary: 'Crear usuarios' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Post('crear')
    crear(@Body() usuario: CrearUsuariosDto) {
        return this.usuariosServicio.crear(usuario);
    }

    @ApiOperation({ summary: 'Obtener a todos los usuarios' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-todos')
    obtenerTodos() {
        return this.usuariosServicio.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener a todos los usuarios eliminados' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-todos-eliminados')
    obtenerTodosEliminados() {
        return this.usuariosServicio.obtenerTodosEliminados();
    }

    @ApiOperation({ summary: 'Obtener a usuarios segun su clave primaria' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-por-id/:email')
    obtenerPorId(@Param() email: ObtenerPorIdUsuariosDto) {
        return this.usuariosServicio.obtenerPorId(email);
    }

    @ApiOperation({ summary: 'Actualizar usuarios' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Put('actualizar')
    actualizar(@Body() usuario: ActualizarUsuariosDto) {
        return this.usuariosServicio.actualizar(usuario);
    }

    @ApiOperation({ summary: 'Eliminar usuario' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Delete('eliminar/:email')
    eliminar(@Param() email: EliminarUsuariosDto) {
        return this.usuariosServicio.eliminar(email);
    }
}
