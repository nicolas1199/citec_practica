import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentosService } from '../services/documentos.service';
import { CreateDocumentoDto, UpdateDocumentoDto } from '../dto/documento.dto';

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

  /*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentosService.obtenerPorId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentoDto: UpdateDocumentoDto) {
    return this.documentosService.actualizar(+id, updateDocumentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentosService.eliminar(+id);
  }*/
}
