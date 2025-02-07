import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ObtenerPorIdRegionesDto {
    @IsNumber({}, { message: 'El id debe ser un número' })
    @IsNotEmpty({ message: 'El id está vacío' })
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({ description: 'Este es el id de la region' })
    readonly id: number;
}
