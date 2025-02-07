import { Controller, Get, Param } from '@nestjs/common';
import { BaseControllersSimple } from '../../common/base/base-controllers-simple.class';
import { GirosService } from '../services/giros.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiRespuestaError, Tipo } from '../../common/utils/decorators';
import { TIPOS_DE_USUARIO } from '../../common/constants/tipos-usuarios.constants';
import { ObtenerPorIdGirosDto } from '../dtos/giros.dto';

@ApiTags('Giros')
@Controller('giros')
export class GirosController extends BaseControllersSimple {
    constructor(private readonly girosService: GirosService) {
        super();
    }

    @ApiOperation({ summary: 'Obtener a todos los giros' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-todos')
    obtenerTodos() {
        return this.girosService.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener a los giros por su id' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-por-id/:codigo')
    obtenerPorId(@Param() codigo: ObtenerPorIdGirosDto) {
        return this.girosService.obtenerPorId(codigo);
    }
}
