import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class TiposDto {
    @IsString({ message: 'El nombre debe ser texto' })
    @IsNotEmpty({ message: 'El nombre esta vacio' })
    @ApiProperty({
        description: 'Nombre del tipo de usuario',
        example: 'ADMINISTRADOR',
    })
    readonly nombre: string;
}

export class ObtenerPorIdTiposDto extends PickType(TiposDto, ['nombre']) {}
