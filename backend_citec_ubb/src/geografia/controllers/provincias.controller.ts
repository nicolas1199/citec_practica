import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiRespuestaError } from '../../common/utils/decorators';
import { BaseControllersSimple } from '../../common/base/base-controllers-simple.class';
import { ProvinciasService } from '../services/provincias.service';
import { ObtenerPorIdProvinciasDto } from '../dtos/provincias.dto';

@ApiTags('Provincias')
@Controller('provincias')
export class ProvinciasController extends BaseControllersSimple {
    constructor(private readonly provinciasService: ProvinciasService) {
        super();
    }

    @ApiOperation({ summary: 'Obtener a todos las regiones' })
    @ApiRespuestaError()
    @Get('obtener-todos')
    obtenerTodos() {
        return this.provinciasService.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener una region segun su clave primaria' })
    @ApiRespuestaError()
    @Get('obtener-por-id/:id')
    obtenerPorId(@Param() clavePrimaria: ObtenerPorIdProvinciasDto) {
        return this.provinciasService.obtenerPorId(clavePrimaria);
    }
}
