import {
  Controller,
  Get,
  Param
} from '@nestjs/common';
import { ValidezDeDocumentoService } from '../services/validez-de-documento.service';
import { BaseControllersSimple } from 'src/common/base/base-controllers-simple.class';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiRespuestaError, ValidezDocumento } from 'src/common/utils/decorators';
import { VALIDEZ_DE_DOCUMENTO } from 'src/common/constants/validez-de-documento.constants';
import { ObtenerPorIdValidezDto } from '../dto/create-validez-de-documento.dto';

@ApiTags('Estados de Validez')
@Controller('validez-de-documento')
export class ValidezDeDocumentoController extends BaseControllersSimple {
  constructor(private readonly validez: ValidezDeDocumentoService) {
    super();
  }

  @ApiOperation({ summary: 'Obtener a todos los tipos de validez' })
  @ApiRespuestaError()
  @ValidezDocumento(VALIDEZ_DE_DOCUMENTO.OPCION_1, VALIDEZ_DE_DOCUMENTO.OPCION_3)
  @Get('obtener-todos')
  obtenerTodos() {
    return this.validez.obtenerTodos();
  }
  @ApiOperation({ summary: 'Obtener a un documento por su validez' })
  @ApiRespuestaError()
  @ValidezDocumento(VALIDEZ_DE_DOCUMENTO.OPCION_1, VALIDEZ_DE_DOCUMENTO.OPCION_3)
  @Get('obtener-por-id/:nombre')
  obtenerPorId(@Param() nombre: ObtenerPorIdValidezDto) {
    return this.validez.obtenerPorId(nombre);
  }

}
