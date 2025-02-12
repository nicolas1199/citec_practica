import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseControllers } from 'src/common/base/base-controllers.class';
import { EncargadosEmpresasService } from '../services/encargadosEmpresas.service';
import { ApiRespuestaError } from 'src/common/utils/decorators';
import {
    ActualizarEncargadosEmpresasDTO,
    EliminarEncargadosEmpresasDTO,
    ObtenerPorIdEncargadosEmpresasDTO,
    CrearEncargadosEmpresasDTO,
} from '../dtos/encargadosEmpresas.dto';

@ApiTags('EncargadosEmpresas')
@Controller('encargados-empresas')
export class EncargadosEmpresasController extends BaseControllers {
    constructor(
        private readonly encargadosEmpresasService: EncargadosEmpresasService,
    ) {
        super();
    }

    @ApiOperation({ summary: 'Obtener a todos los encargados de empresas' })
    @ApiRespuestaError()
    @Get('obtener-todos')
    obtenerTodos() {
        return this.encargadosEmpresasService.obtenerTodos();
    }

    @ApiOperation({
        summary: 'Obtener un encargado de empresa segun su clave primaria',
    })
    @ApiRespuestaError()
    @Get('obtener-por-id/:id')
    obtenerPorId(@Param() clavePrimaria: ObtenerPorIdEncargadosEmpresasDTO) {
        return this.encargadosEmpresasService.obtenerPorId(clavePrimaria);
    }

    @ApiOperation({ summary: 'Crear un encargado de empresa' })
    @ApiRespuestaError()
    @Post('crear')
    crear(@Body() encargadoEmpresa: CrearEncargadosEmpresasDTO) {
        return this.encargadosEmpresasService.crear(encargadoEmpresa);
    }

    @ApiOperation({ summary: 'Actualizar un encargado de empresa' })
    @ApiRespuestaError()
    @Put('actualizar')
    actualizar(@Body() encargadoEmpresa: ActualizarEncargadosEmpresasDTO) {
        return this.encargadosEmpresasService.actualizar(encargadoEmpresa);
    }

    @ApiOperation({ summary: 'Eliminar un encargado de empresa' })
    @ApiRespuestaError()
    @Delete('eliminar/:id')
    eliminar(@Param() id: EliminarEncargadosEmpresasDTO) {
        return this.encargadosEmpresasService.eliminar(id);
    }
}
