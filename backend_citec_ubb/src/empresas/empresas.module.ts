import { Module } from '@nestjs/common';
import { EmpresasService } from './services/empresas.service';
import { EmpresasController } from './controllers/empresas.controller';

@Module({
    providers: [EmpresasService],
    controllers: [EmpresasController],
})
export class EmpresasModule {}
