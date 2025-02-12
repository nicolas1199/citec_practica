import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentosService } from '../services/documentos.service';
import { CreateDocumentoDto, EliminarDocumentoDto, obtenerDocumentoPorIdDto, UpdateDocumentoDto } from '../dto/documento.dto';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post()
  create(@Body() createDocumentoDto: CreateDocumentoDto) {
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
