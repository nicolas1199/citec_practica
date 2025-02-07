import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiRespuestaError, Tipo } from '../../common/utils/decorators';
import { TIPOS_DE_USUARIO } from '../../common/constants/tipos-usuarios.constants';
import { ObtenerPorIdTiposDto } from '../dtos/tipos.dto';
import { BaseControllersSimple } from '../../common/base/base-controllers-simple.class';
import { TiposService } from '../services/tipos.service';

@ApiTags('Tipos de usuario')
@Controller('tipos')
export class TiposController extends BaseControllersSimple {
    constructor(private readonly tiposServicio: TiposService) {
        super();
    }

    @ApiOperation({ summary: 'Obtener a todos los tipos de usuario' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-todos')
    obtenerTodos() {
        return this.tiposServicio.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener a un usuario por su nombre' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-por-id/:nombre')
    obtenerPorId(@Param() nombre: ObtenerPorIdTiposDto) {
        return this.tiposServicio.obtenerPorId(nombre);
    }
}
