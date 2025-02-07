import { Module } from '@nestjs/common';
import { SubServiciosController } from './controllers/sub-servicios.controller';
import { SubServiciosService } from './services/sub-servicios.service';

@Module({
    controllers: [SubServiciosController],
    providers: [SubServiciosService],
    exports: [SubServiciosService],
})
export class SubServiciosModule {}
