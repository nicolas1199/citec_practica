import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Delete,
    Param,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseControllers } from '../../common/base/base-controllers.class';
import { ApiRespuestaError, Tipo } from '../../common/utils/decorators';
import { TIPOS_DE_USUARIO } from '../../common/constants/tipos-usuarios.constants';
import { OrdenesDeTrabajosService } from '../services/ordenes-de-trabajos.service';
import { CrearOrdenesDeTrabajoDto } from '../dtos/ordenes-de-trabajo.dto';

@ApiTags('Ordenes de trabajos')
@Controller('ordenes-de-trabajos')
export class OrdenesDeTrabajosController {
    constructor(private ordenesDeTrabajoServicios: OrdenesDeTrabajosService) {}

    @ApiOperation({ summary: 'Crear orden de trabajo' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Post('crear')
    crear(@Body() ordenDeTrabajo: CrearOrdenesDeTrabajoDto) {
        return this.ordenesDeTrabajoServicios.crear(ordenDeTrabajo);
    }

    // @ApiOperation({ summary: 'Obtener a todas las empresas' })
    // @ApiRespuestaError()
    // @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    // @Get('obtener-todos')
    // obtenerTodos() {
    //     return this.ordenesDeTrabajoServicios.obtenerTodos();
    // }

    // @ApiOperation({ summary: 'Obtener a todos los usuarios eliminados' })
    // @ApiRespuestaError()
    // @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    // @Get('obtener-todos-eliminados')
    // obtenerTodosEliminados() {
    //     return this.ordenesDeTrabajoServicios.obtenerTodosEliminados();
    // }

    // @ApiOperation({ summary: 'Obtener a usuarios segun su clave primaria' })
    // @ApiRespuestaError()
    // @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    // @Get('obtener-por-id/:rut')
    // obtenerPorId(@Param() rut: ObtenerPorIdEmpresasDto) {
    //     return this.ordenesDeTrabajoServicios.obtenerPorId(rut);
    // }

    // @ApiOperation({ summary: 'Actualizar empresas' })
    // @ApiRespuestaError()
    // @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    // @Put('actualizar')
    // actualizar(@Body() empresa: ActualizarEmpresasDto) {
    //     return this.ordenesDeTrabajoServicios.actualizar(empresa);
    // }

    // @ApiOperation({ summary: 'Eliminar empresa' })
    // @ApiRespuestaError()
    // @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    // @Delete('eliminar/:rut')
    // eliminar(@Param() clavePrimaria: EliminarEmpresasDto) {
    //     return this.ordenesDeTrabajoServicios.eliminar(clavePrimaria);
    // }
}
