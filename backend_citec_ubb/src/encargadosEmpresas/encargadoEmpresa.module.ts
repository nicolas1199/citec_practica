import { Module } from '@nestjs/common';
import { EncargadosEmpresasController } from './controllers/encargadosEmpresas.controller';
import { EncargadosEmpresasService } from './services/encargadosEmpresas.service';

@Module({
    controllers: [EncargadosEmpresasController],
    providers: [EncargadosEmpresasService],
})
export class EncargadoEmpresaModule {}
