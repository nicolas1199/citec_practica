import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GirosRetornoDto {
    @ApiProperty({ description: 'Código del giro', example: 11101 })
    @Expose()
    readonly codigo: number;

    @ApiProperty({
        description: 'Nombre del giro',
        example: 'CULTIVO DE TRIGO',
    })
    @Expose()
    readonly nombre: string;

    @ApiProperty({ description: 'Afecto a IVA', example: 'SI' })
    @Expose()
    readonly afecto_iva: string;

    @ApiProperty({
        description: 'Nombre de las categorías',
        example: 'AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA',
    })
    @Expose()
    readonly nombre_categorias: string;
}
