import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentosService } from '../services/documentos.service';
import {
  CrearDocumentoDto,
  EliminarDocumentoDto,
  obtenerDocumentoPorIdDto,
  ActualizarDocumentoDto
} from '../dto/documento.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiRespuestaError,
  AreaDocumento,
  ValidezDocumento
} from 'src/common/utils/decorators';
import { AREAS_DE_DOCUMENTO } from 'src/common/constants/area-documentos.constants';
import { BaseControllers } from 'src/common/base/base-controllers.class';
import { VALIDEZ_DE_DOCUMENTO } from 'src/common/constants/validez-de-documento.constants';

@ApiTags('Documentos')
@Controller('documentos')
export class DocumentosController extends BaseControllers {
  constructor(private readonly documentosService: DocumentosService) { super() }

  @ApiOperation({ summary: 'Crear documentos' })
  @ApiRespuestaError()
  @AreaDocumento(AREAS_DE_DOCUMENTO.OPCION_1, AREAS_DE_DOCUMENTO.OPCION_2)
  @ValidezDocumento(VALIDEZ_DE_DOCUMENTO.OPCION_1, VALIDEZ_DE_DOCUMENTO.OPCION_3)
  @Post('crear')
  crear(@Body() createDocumentoDto: CrearDocumentoDto) {
    return this.documentosService.crear(createDocumentoDto);
  }

  @ApiOperation({ summary: 'Obtener a todos los documentos' })
  @ApiRespuestaError()
  @AreaDocumento(AREAS_DE_DOCUMENTO.OPCION_1, AREAS_DE_DOCUMENTO.OPCION_2)
  @ValidezDocumento(VALIDEZ_DE_DOCUMENTO.OPCION_1, VALIDEZ_DE_DOCUMENTO.OPCION_3)
  @Get('obtener-todos')
  obtenerTodos() {
    return this.documentosService.obtenerTodos();
  }

  @ApiOperation({ summary: 'Obtener a documentos segun su clave primaria' })
  @ApiRespuestaError()
  @AreaDocumento(AREAS_DE_DOCUMENTO.OPCION_1, AREAS_DE_DOCUMENTO.OPCION_2)
  @ValidezDocumento(VALIDEZ_DE_DOCUMENTO.OPCION_1, VALIDEZ_DE_DOCUMENTO.OPCION_3)
  @Get('obtener-por-numero/:numero')
  obtenerPorId(@Param() numero: obtenerDocumentoPorIdDto) {
    return this.documentosService.obtenerPorId(numero);
  }

  @ApiOperation({ summary: 'Actualizar documento' })
  @ApiRespuestaError()
  @AreaDocumento(AREAS_DE_DOCUMENTO.OPCION_1, AREAS_DE_DOCUMENTO.OPCION_2)
  @ValidezDocumento(VALIDEZ_DE_DOCUMENTO.OPCION_1, VALIDEZ_DE_DOCUMENTO.OPCION_3)
  @Patch('actualizar')
  actualizar(@Body() numero: ActualizarDocumentoDto) {
    return this.documentosService.actualizar(numero);
  }

  @ApiOperation({ summary: 'Eliminar Documento' })
  @ApiRespuestaError()
  @AreaDocumento(AREAS_DE_DOCUMENTO.OPCION_1, AREAS_DE_DOCUMENTO.OPCION_2)
  @ValidezDocumento(VALIDEZ_DE_DOCUMENTO.OPCION_1, VALIDEZ_DE_DOCUMENTO.OPCION_3)
  @Delete('eliminar/:numero')
  eliminar(@Param('numero') numero: EliminarDocumentoDto) {
    return this.documentosService.eliminar(numero);
  }

  @ApiOperation({ summary: 'Obtener a todos los documenros no validos' })
  @ApiRespuestaError()
  @ValidezDocumento(VALIDEZ_DE_DOCUMENTO.OPCION_1, VALIDEZ_DE_DOCUMENTO.OPCION_3)
  @Get('obtener-todos-eliminados')
  obtenerTodosEliminados() {
    return this.documentosService.obtenerTodosEliminados();
  }
}
