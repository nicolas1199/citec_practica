import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseControllersSimple } from '../../common/base/base-controllers-simple.class';
import { ComunasService } from '../services/comunas.service';
import { ApiRespuestaError } from 'src/common/utils/decorators';
import { ObtenerPorIdComunasDto } from '../dtos/comunas.dto';

@ApiTags('Comunas')
@Controller('comunas')
export class ComunasController extends BaseControllersSimple {
    constructor(private readonly comunasService: ComunasService) {
        super();
    }

    @ApiOperation({ summary: 'Obtener a todos las comunas' })
    @ApiRespuestaError()
    @Get('obtener-todos')
    obtenerTodos() {
        return this.comunasService.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener una comuna segun su clave primaria' })
    @ApiRespuestaError()
    @Get('obtener-por-id/:id')
    obtenerPorId(@Param() clavePrimaria: ObtenerPorIdComunasDto) {
        return this.comunasService.obtenerPorId(clavePrimaria);
    }
}
