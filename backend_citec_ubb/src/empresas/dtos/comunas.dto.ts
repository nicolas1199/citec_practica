import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ComunasRetornoDto {
    @ApiProperty({ description: 'ID de la comuna', example: 1101 })
    @Expose()
    readonly id: number;

    @ApiProperty({ description: 'Nombre de la comuna', example: 'Iquique' })
    @Expose()
    readonly nombre: string;
}
