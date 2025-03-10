import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Res,
    StreamableFile,
    Header,
    Query,
} from '@nestjs/common';
import { DocumentosService } from '../services/documentos.service';
import {
    CrearDocumentoDto,
    EliminarDocumentoDto,
    obtenerDocumentoPorIdDto,
    ActualizarDocumentoDto,
} from '../dto/documento.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    ApiRespuestaError,
    AreaDocumento,
    Public,
    ValidezDocumento,
} from 'src/common/utils/decorators';
import { AREAS_DE_DOCUMENTO } from 'src/common/constants/area-documentos.constants';
import { BaseControllers } from 'src/common/base/base-controllers.class';
import { VALIDEZ_DE_DOCUMENTO } from 'src/common/constants/validez-de-documento.constants';
import { GenerarPdfDto } from '../dto/generar-pdf.dto';
import type { Response } from 'express';

@ApiTags('Documentos')
@Controller('documentos')
export class DocumentosController extends BaseControllers {
    constructor(private readonly documentosService: DocumentosService) {
        super();
    }

    @ApiOperation({ summary: 'Crear documentos' })
    @ApiRespuestaError()
    @AreaDocumento(AREAS_DE_DOCUMENTO.OPCION_1, AREAS_DE_DOCUMENTO.OPCION_2)
    @ValidezDocumento(
        VALIDEZ_DE_DOCUMENTO.OPCION_1,
        VALIDEZ_DE_DOCUMENTO.OPCION_3,
    )
    @Post('crear')
    crear(@Body() createDocumentoDto: CrearDocumentoDto) {
        return this.documentosService.crear(createDocumentoDto);
    }

    @ApiOperation({ summary: 'Obtener a todos los documentos' })
    @ApiRespuestaError()
    @AreaDocumento(AREAS_DE_DOCUMENTO.OPCION_1, AREAS_DE_DOCUMENTO.OPCION_2)
    @ValidezDocumento(
        VALIDEZ_DE_DOCUMENTO.OPCION_1,
        VALIDEZ_DE_DOCUMENTO.OPCION_3,
    )
    @Get('obtener-todos')
    obtenerTodos() {
        return this.documentosService.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener a documentos segun su clave primaria' })
    @ApiRespuestaError()
    @AreaDocumento(AREAS_DE_DOCUMENTO.OPCION_1, AREAS_DE_DOCUMENTO.OPCION_2)
    @ValidezDocumento(
        VALIDEZ_DE_DOCUMENTO.OPCION_1,
        VALIDEZ_DE_DOCUMENTO.OPCION_3,
    )
    @Get('obtener-por-id/:numero')
    obtenerPorId(@Param() numero: obtenerDocumentoPorIdDto) {
        return this.documentosService.obtenerPorId(numero);
    }

    @ApiOperation({ summary: 'Actualizar documento' })
    @ApiRespuestaError()
    @AreaDocumento(AREAS_DE_DOCUMENTO.OPCION_1, AREAS_DE_DOCUMENTO.OPCION_2)
    @ValidezDocumento(
        VALIDEZ_DE_DOCUMENTO.OPCION_1,
        VALIDEZ_DE_DOCUMENTO.OPCION_3,
    )
    @Patch('actualizar')
    actualizar(@Body() numero: ActualizarDocumentoDto) {
        return this.documentosService.actualizar(numero);
    }
    @ApiOperation({ summary: 'Eliminar Documento' })
    @ApiRespuestaError()
    @AreaDocumento(AREAS_DE_DOCUMENTO.OPCION_1, AREAS_DE_DOCUMENTO.OPCION_2)
    @ValidezDocumento(
        VALIDEZ_DE_DOCUMENTO.OPCION_1,
        VALIDEZ_DE_DOCUMENTO.OPCION_3,
    )
    @Delete('eliminar/:numero')
    eliminar(@Param('numero') numero: EliminarDocumentoDto) {
        return this.documentosService.eliminar(numero);
    }

    @ApiOperation({ summary: 'Generar documento PDF' })
    @ApiRespuestaError()
    @Post('generar-pdf')
    async generarPdf(@Body() generarPdfDto: GenerarPdfDto) {
        return this.documentosService.generarPdf(generarPdfDto);
    }

    @ApiOperation({ summary: 'Descargar documento PDF' })
    @ApiRespuestaError()
    @Public() // Marcar el endpoint como público
    @Get('descargar-pdf/:fileName')
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename="informe.pdf"')
    async descargarPdf(
        @Param('fileName') fileName: string,
        @Query('token') token: string, // Recibir el token como parámetro de consulta
        @Res({ passthrough: true }) res: Response,
    ): Promise<StreamableFile> {
        // No necesitamos verificar el token aquí porque es un endpoint público
        // Pero podríamos hacerlo si quisiéramos agregar una verificación adicional

        const buffer = await this.documentosService.obtenerPdf(fileName);

        // Configurar cabeceras para la descarga
        res.set({
            'Content-Disposition': `attachment; filename="${fileName}"`,
        });

        return new StreamableFile(buffer);
    }
}
