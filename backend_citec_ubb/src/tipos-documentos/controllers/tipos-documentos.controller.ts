import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiRespuestaError, TipoDocumento } from '../../common/utils/decorators';
import { ObtenerPorIdTiposDto } from '../dtos/tipos-documentos.dto';
import { BaseControllersSimple } from '../../common/base/base-controllers-simple.class';
import { TiposDocumentosService } from '../services/tipos-documentos.service';
import { TIPOS_DE_DOCUMENTO } from 'src/common/constants/tipos-documentos.constants';

@ApiTags('Tipos de Documentos')
@Controller('tipos')
export class TiposDocumentosController extends BaseControllersSimple {
    constructor(private readonly tiposServicio: TiposDocumentosService) {
        super();
    }

    @ApiOperation({ summary: 'Obtener a todos los tipos de documento' })
    @ApiRespuestaError()
    @TipoDocumento(TIPOS_DE_DOCUMENTO.OPCION_1, TIPOS_DE_DOCUMENTO.OPCION_2)
    @Get('obtener-todos')
    obtenerTodos() {
        return this.tiposServicio.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener a un documento por su tipo' })
    @ApiRespuestaError()
    @TipoDocumento(TIPOS_DE_DOCUMENTO.OPCION_1, TIPOS_DE_DOCUMENTO.OPCION_2)
    @Get('obtener-por-id/:nombre')
    obtenerPorId(@Param() nombre: ObtenerPorIdTiposDto) {
        return this.tiposServicio.obtenerPorId(nombre);
    }
}
