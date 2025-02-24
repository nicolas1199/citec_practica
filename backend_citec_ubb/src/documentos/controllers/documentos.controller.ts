import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { DocumentosService } from '../services/documentos.service';
import {
    CrearDocumentoDto,
    EliminarDocumentoDto,
    obtenerDocumentoPorIdDto,
    UpdateDocumentoDto,
} from '../dto/documento.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiRespuestaError, AreaDocumento } from 'src/common/utils/decorators';
import { AREAS_DE_DOCUMENTO } from 'src/common/constants/area-documentos.constants';

@Controller('documentos')
export class DocumentosController {
    constructor(private readonly documentosService: DocumentosService) {}

    @ApiOperation({ summary: 'Crear documentos' })
    @ApiRespuestaError()
    @AreaDocumento(AREAS_DE_DOCUMENTO.OPCION_1, AREAS_DE_DOCUMENTO.OPCION_2)
    @Post('crear')
    create(@Body() createDocumentoDto: CrearDocumentoDto) {
        return this.documentosService.crear(createDocumentoDto);
    }

    @Get()
    findAll() {
        return this.documentosService.obtenerTodos();
    }

    @Get(':numero')
    findOne(@Param('numero') numero: obtenerDocumentoPorIdDto) {
        return this.documentosService.obtenerPorId(numero);
    }

    @Patch(':numero')
    update(@Body() updateDocumentoDto: UpdateDocumentoDto) {
        return this.documentosService.actualizar(updateDocumentoDto);
    }

    @Delete(':numero')
    remove(@Param('numero') numero: EliminarDocumentoDto) {
        return this.documentosService.eliminar(numero);
    }
}
