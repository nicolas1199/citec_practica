import { Module } from '@nestjs/common';
import { OrdenesDeTrabajosController } from './controllers/ordenes-de-trabajos.controller';
import { OrdenesDeTrabajosService } from './services/ordenes-de-trabajos.service';

@Module({
    controllers: [OrdenesDeTrabajosController],
    providers: [OrdenesDeTrabajosService],
})
export class OrdenesDeTrabajosModule {}
