import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ObtenerPorIdSubServiciosDto {
    @IsString({ message: 'El nombre debe ser texto' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @ApiProperty({ description: 'Nombre del subservicio' })
    readonly nombre: string;
}

export class RetornoSubServiciosDto {
    @ApiProperty({ description: 'Nombre del subservicio' })
    readonly nombre: string;

    @ApiProperty({ description: 'Pago neto del subservicio' })
    readonly pago_neto: number;
}
