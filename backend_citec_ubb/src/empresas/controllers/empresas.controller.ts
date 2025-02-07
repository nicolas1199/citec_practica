import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Delete,
    Param,
} from '@nestjs/common';
import { EmpresasService } from '../services/empresas.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseControllers } from '../../common/base/base-controllers.class';
import { ApiRespuestaError, Tipo } from '../../common/utils/decorators';
import { TIPOS_DE_USUARIO } from '../../common/constants/tipos-usuarios.constants';
import {
    ActualizarEmpresasDto,
    CrearEmpresasDto,
    EliminarEmpresasDto,
    ObtenerPorIdEmpresasDto,
} from '../dtos/empresas.dto';

@ApiTags('Empresas')
@Controller('empresas')
export class EmpresasController extends BaseControllers {
    constructor(private empresasServicio: EmpresasService) {
        super();
    }

    @ApiOperation({ summary: 'Crear empresas' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Post('crear')
    crear(@Body() empresa: CrearEmpresasDto) {
        return this.empresasServicio.crear(empresa);
    }

    @ApiOperation({ summary: 'Obtener a todas las empresas' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-todos')
    obtenerTodos() {
        return this.empresasServicio.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener a todos los usuarios eliminados' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-todos-eliminados')
    obtenerTodosEliminados() {
        return this.empresasServicio.obtenerTodosEliminados();
    }

    @ApiOperation({ summary: 'Obtener a usuarios segun su clave primaria' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-por-id/:rut')
    obtenerPorId(@Param() rut: ObtenerPorIdEmpresasDto) {
        return this.empresasServicio.obtenerPorId(rut);
    }

    @ApiOperation({ summary: 'Actualizar empresas' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Put('actualizar')
    actualizar(@Body() empresa: ActualizarEmpresasDto) {
        return this.empresasServicio.actualizar(empresa);
    }

    @ApiOperation({ summary: 'Eliminar empresa' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Delete('eliminar/:rut')
    eliminar(@Param() clavePrimaria: EliminarEmpresasDto) {
        return this.empresasServicio.eliminar(clavePrimaria);
    }
}
