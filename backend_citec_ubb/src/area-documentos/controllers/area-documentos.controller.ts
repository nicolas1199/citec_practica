import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    ApiRespuestaError,
    AreaDocumento,
} from '../../common/utils/decorators';
import { ObtenerPorIdAreasDto } from '../dtos/area-documentos.dto';
import { BaseControllersSimple } from '../../common/base/base-controllers-simple.class';
import { AreasDocumentosService } from '../services/areas-documentos.service';
import { AREAS_DE_DOCUMENTO } from 'src/common/constants/area-documentos.constants';

@ApiTags('Areas de Documentos')
@Controller('areas')
export class AreasDocumentosController extends BaseControllersSimple {
    constructor(private readonly tiposServicio: AreasDocumentosService) {
        super();
    }

    @ApiOperation({ summary: 'Obtener a todos los tipos de documento' })
    @ApiRespuestaError()
    @AreaDocumento(AREAS_DE_DOCUMENTO.OPCION_1, AREAS_DE_DOCUMENTO.OPCION_2)
    @Get('obtener-todos')
    obtenerTodos() {
        return this.tiposServicio.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener a un documento por su codigo de area' })
    @ApiRespuestaError()
    @AreaDocumento(AREAS_DE_DOCUMENTO.OPCION_1, AREAS_DE_DOCUMENTO.OPCION_2)
    @Get('obtener-por-id/:nombre')
    obtenerPorId(@Param() nombre: ObtenerPorIdAreasDto) {
        return this.tiposServicio.obtenerPorId(nombre);
    }
}
