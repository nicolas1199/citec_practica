import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class TiposDocumentosDto {
    @IsString({ message: 'El nombre debe ser texto' })
    @IsNotEmpty({ message: 'El nombre esta vacio' })
    @ApiProperty({
        description: 'Nombre del tipo de documento',
        example: 'AA',
    })
    readonly nombre: string;
}

export class ObtenerPorIdTiposDto extends PickType(TiposDocumentosDto, ['nombre']) {}
