import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class GirosRetornoDto {
    @IsNumber({}, { message: 'El codigo del giro debe ser un número' })
    @IsNotEmpty({ message: 'El codigo del giro está vacio' })
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({ description: 'Código del giro', example: 11101 })
    readonly codigo: number;

    @ApiProperty({
        description: 'Nombre del giro',
        example: 'CULTIVO DE TRIGO',
    })
    readonly nombre: string;

    @ApiProperty({ description: 'Afecto a IVA', example: 'SI' })
    readonly afecto_iva: string;

    @ApiProperty({
        description: 'Nombre de las categorías',
        example: 'AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA',
    })
    readonly nombre_categorias: string;
}

export class ObtenerPorIdGirosDto extends PickType(GirosRetornoDto, [
    'codigo',
]) {}
