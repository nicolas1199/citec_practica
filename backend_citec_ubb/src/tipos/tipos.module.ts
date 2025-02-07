import { Module } from '@nestjs/common';
import { TiposController } from './controllers/tipos.controller';
import { TiposService } from './services/tipos.service';

@Module({
    controllers: [TiposController],
    providers: [TiposService],
})
export class TiposModule {}
