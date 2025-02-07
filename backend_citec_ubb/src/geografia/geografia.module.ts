import { Module } from '@nestjs/common';
import { ComunasController } from './controllers/comunas.controller';
import { ProvinciasService } from './services/provincias.service';
import { ProvinciasController } from './controllers/provincias.controller';
import { RegionesController } from './controllers/regiones.controller';
import { ComunasService } from './services/comunas.service';
import { RegionesService } from './services/regiones.service';

@Module({
    imports: [],
    controllers: [ComunasController, RegionesController, ProvinciasController],
    providers: [ComunasService, RegionesService, ProvinciasService],
})
export class GeografiaModule {}
