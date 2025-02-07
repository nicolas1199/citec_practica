import { Module } from '@nestjs/common';
import { GrupoDeServiciosController } from './controllers/grupo-de-servicios.controller';
import { GrupoDeServiciosService } from './services/grupo-de-servicios.service';

@Module({
    controllers: [GrupoDeServiciosController],
    providers: [GrupoDeServiciosService],
    exports: [GrupoDeServiciosService],
})
export class GrupoDeServiciosModule {}
