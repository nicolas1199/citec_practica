import { Controller, Get, Param } from '@nestjs/common';
import { BaseControllersSimple } from '../../common/base/base-controllers-simple.class';
import { SubServiciosService } from '../services/sub-servicios.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiRespuestaError, Tipo } from '../../common/utils/decorators';
import { TIPOS_DE_USUARIO } from '../../common/constants/tipos-usuarios.constants';
import { ObtenerPorIdSubServiciosDto } from '../dtos/sub-servicios.dto';

@ApiTags('Sub Servicios')
@Controller('sub-servicios')
export class SubServiciosController extends BaseControllersSimple {
    constructor(private readonly subServiciosService: SubServiciosService) {
        super();
    }

    @ApiOperation({ summary: 'Obtener todos los subservicios' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-todos')
    obtenerTodos() {
        return this.subServiciosService.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener subservicio por su nombre' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-por-id/:nombre')
    obtenerPorId(@Param() nombre: ObtenerPorIdSubServiciosDto) {
        return this.subServiciosService.obtenerPorId(nombre);
    }
}
