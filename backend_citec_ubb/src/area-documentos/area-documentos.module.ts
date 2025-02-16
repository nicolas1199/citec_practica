import { Module } from '@nestjs/common';
import { AreasDocumentosController } from './controllers/area-documentos.controller';
import { AreasDocumentosService } from './services/areas-documentos.service';

@Module({
    controllers: [AreasDocumentosController],
    providers: [AreasDocumentosService],
})
export class AreasModule {}
