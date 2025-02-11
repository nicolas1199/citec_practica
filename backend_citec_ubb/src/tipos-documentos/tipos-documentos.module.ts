import { Module } from '@nestjs/common';
import {TiposDocumentosController } from './controllers/tipos-documentos.controller';
import { TiposDocumentosService} from './services/tipos-documentos.service';

@Module({
    controllers: [TiposDocumentosController],
    providers: [TiposDocumentosService],
})
export class TiposModule {}
