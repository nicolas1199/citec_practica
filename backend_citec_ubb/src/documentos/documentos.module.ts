import { Module } from '@nestjs/common';
import { DocumentosService } from './services/documentos.service';
import { DocumentosController } from './controllers/documentos.controller';

@Module({
  controllers: [DocumentosController],
  providers: [DocumentosService],
})
export class DocumentosModule {}
