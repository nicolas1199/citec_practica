import { Module } from '@nestjs/common';
import { EnsayosController } from './controllers/ensayo.controller';
import { EnsayosService } from './services/ensayo.service';

@Module({
    controllers: [EnsayosController],
    providers: [EnsayosService],
    exports: [EnsayosService],
})
export class EnsayosModule {}
