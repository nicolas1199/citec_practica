import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiRespuestaError } from '../../common/utils/decorators';
import { BaseControllersSimple } from '../../common/base/base-controllers-simple.class';
import { RegionesService } from '../services/regiones.service';
import { ObtenerPorIdRegionesDto } from '../dtos/regiones.dto';

@ApiTags('Regiones')
@Controller('regiones')
export class RegionesController extends BaseControllersSimple {
    constructor(private readonly regionesService: RegionesService) {
        super();
    }

    @ApiOperation({ summary: 'Obtener a todos las regiones' })
    @ApiRespuestaError()
    @Get('obtener-todos')
    obtenerTodos() {
        return this.regionesService.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener una region segun su clave primaria' })
    @ApiRespuestaError()
    @Get('obtener-por-id/:id')
    obtenerPorId(@Param() clavePrimaria: ObtenerPorIdRegionesDto) {
        return this.regionesService.obtenerPorId(clavePrimaria);
    }
}
