import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ValidezDeDocumentoDto {
    @IsString({ message: 'El nombre debe ser texto' })
    @IsNotEmpty({ message: 'El nombre esta vacio' })
    @ApiProperty({
        description: 'Nombre del tipo de usuario',
        example: 'VALIDO',
    })
    readonly nombre: string;
}

export class ObtenerPorIdValidezDto extends PickType(ValidezDeDocumentoDto, [
    'nombre',
]) {}
