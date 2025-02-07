import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
} from '@nestjs/common';

import { PropuestasDeServiciosService } from '../services/propuestas-de-servicios.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiRespuestaError, Tipo } from '../../common/utils/decorators';
import { TIPOS_DE_USUARIO } from '../../common/constants/tipos-usuarios.constants';

import {
    ActualizarPropuestasDeServiciosDto,
    CrearPropuestasDeServiciosDto,
    EliminarPropuestasDeServiciosDto,
    ObtenerPorIdPropuestasDeServiciosDto,
    RetornoPropuestaDeServicio,
} from '../dtos/propuestas-de-servicios.dto';

import { ErrorRespuestaDto } from '../../common/dtos/error-respuesta.dto';
import PropuestasDeServicios from '../../database/models/propuestas-de-servicios.model';

@ApiTags('Propuestas de Servicios')
@Controller('propuestas-de-servicios')
export class PropuestasDeServiciosController {
    constructor(
        private propuestasDeServiciosService: PropuestasDeServiciosService,
    ) {}

    @ApiOperation({ summary: 'Obtener a todas las propuestas de servicios' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @ApiResponse({
        status: 404,
        description: 'No encontrado',
        type: ErrorRespuestaDto,
    })
    @Get('obtener-todos')
    obtenerTodos(): Promise<RetornoPropuestaDeServicio[]> {
        return this.propuestasDeServiciosService.obtenerTodos();
    }

    @ApiOperation({
        summary: 'Obtener todas las propuestas de servicios eliminadas',
    })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @ApiResponse({
        status: 404,
        description: 'No encontrado',
        type: ErrorRespuestaDto,
    })
    @Get('obtener-todos-eliminados')
    obtenerTodosEliminados(): Promise<RetornoPropuestaDeServicio[]> {
        return this.propuestasDeServiciosService.obtenerTodosEliminados();
    }

    @ApiOperation({ summary: 'Obtener propuesta de servicios por id' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-por-id/:id')
    obtenerPorId(@Param('id') id: number) {
        return this.propuestasDeServiciosService.obtenerPorId({ id });
    }

    @ApiOperation({ summary: 'Crear propuestas de servicios' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Post('crear')
    crear(@Body() propuesta: CrearPropuestasDeServiciosDto) {
        return this.propuestasDeServiciosService.crear(propuesta);
    }

    @ApiOperation({ summary: 'Actualizar propuesta de servicios' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Put('actualizar')
    actualizar(@Body() propuesta: ActualizarPropuestasDeServiciosDto) {
        return this.propuestasDeServiciosService.actualizar(propuesta);
    }

    @ApiOperation({ summary: 'Eliminar propuesta de servicios' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Delete('eliminar/:id')
    eliminar(@Param('id') id: number) {
        return this.propuestasDeServiciosService.eliminar({ id });
    }
}
