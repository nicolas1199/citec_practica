import { Controller, Get, Param } from '@nestjs/common';
import { BaseControllersSimple } from '../../common/base/base-controllers-simple.class';
import { GrupoDeServiciosService } from '../services/grupo-de-servicios.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiRespuestaError, Tipo } from '../../common/utils/decorators';
import { TIPOS_DE_USUARIO } from '../../common/constants/tipos-usuarios.constants';
import { ObtenerPorIdGrupoDeServiciosDto } from '../dtos/grupo-de-servicios.dto';

@ApiTags('Grupos de Servicios')
@Controller('grupo-de-servicios')
export class GrupoDeServiciosController extends BaseControllersSimple {
    constructor(
        private readonly grupoDeServiciosService: GrupoDeServiciosService,
    ) {
        super();
    }

    @ApiOperation({ summary: 'Obtener todos los grupos de servicios' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-todos')
    obtenerTodos() {
        return this.grupoDeServiciosService.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener grupo de servicios por su nombre' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-por-id/:nombre')
    obtenerPorId(@Param() nombre: ObtenerPorIdGrupoDeServiciosDto) {
        return this.grupoDeServiciosService.obtenerPorId(nombre);
    }
}
