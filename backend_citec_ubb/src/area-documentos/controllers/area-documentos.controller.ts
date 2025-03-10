import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiRespuestaError, Public } from '../../common/utils/decorators';
import { ObtenerPorIdAreasDto } from '../dtos/area-documentos.dto';
import { BaseControllersSimple } from '../../common/base/base-controllers-simple.class';
import { AreasDocumentosService } from '../services/areas-documentos.service';

@ApiTags('Areas de Documentos')
@Controller('area-documentos')
export class AreasDocumentosController extends BaseControllersSimple {
    constructor(private readonly tiposServicio: AreasDocumentosService) {
        super();
    }

    @ApiOperation({ summary: 'Obtener todas las áreas de documentos' })
    @ApiRespuestaError()
    @Public() // Hacemos este endpoint público para que el frontend pueda acceder sin autenticación
    @Get('obtener-todos')
    obtenerTodos() {
        return this.tiposServicio.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener un área de documento por su código' })
    @ApiRespuestaError()
    @Public() // Hacemos este endpoint público
    @Get('obtener-por-id/:nombre')
    obtenerPorId(@Param() nombre: ObtenerPorIdAreasDto) {
        return this.tiposServicio.obtenerPorId(nombre);
    }
}
