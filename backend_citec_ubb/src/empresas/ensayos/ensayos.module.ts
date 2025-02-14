import { Module } from '@nestjs/common';
import { EnsayosService } from './services/ensayos.service';
import { EnsayosController } from './controllers/ensayos.controller';

@Module({
    providers: [EnsayosService],
    controllers: [EnsayosController],
})
export class EnsayosModule {}
