import { Module } from '@nestjs/common';
import { GirosController } from './controllers/giros.controller';
import { GirosService } from './services/giros.service';

@Module({
    controllers: [GirosController],
    providers: [GirosService],
})
export class GirosModule {}
