import { Module } from '@nestjs/common';
import { DocumentosService } from './services/documentos.service';
import { DocumentosController } from './controllers/documentos.controller';
import { AreasDocumentosService } from '../area-documentos/services/areas-documentos.service';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    controllers: [DocumentosController],
    providers: [DocumentosService, AreasDocumentosService],
    exports: [DocumentosService],
})
export class DocumentosModule {}
