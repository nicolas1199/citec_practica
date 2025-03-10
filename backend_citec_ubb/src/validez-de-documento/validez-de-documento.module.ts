import { Module } from '@nestjs/common';
import { ValidezDeDocumentoService } from './services/validez-de-documento.service';
import { ValidezDeDocumentoController } from './controllers/validez-de-documento.controller';

@Module({
    controllers: [ValidezDeDocumentoController],
    providers: [ValidezDeDocumentoService],
})
export class ValidezDeDocumentoModule {}
