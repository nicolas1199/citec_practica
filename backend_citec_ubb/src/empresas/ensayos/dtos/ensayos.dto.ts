import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Length,
} from 'class-validator';
import { ApiProperty, PickType, OmitType } from '@nestjs/swagger';

export class ActualizarEnsayoDto {
    @IsNumber({}, { message: 'El id del ensayo debe ser un número' })
    @IsNotEmpty({ message: 'El id del ensayo está vacío' })
    @ApiProperty({ description: 'Este es el id del ensayo' })
    readonly id: number;

    @IsString({ message: 'El nombre del ensayo debe ser texto' })
    @IsNotEmpty({ message: 'El nombre del ensayo está vacío' })
    @Length(3, 100, { message: 'El nombre del ensayo debe tener entre 3 y 100 caracteres' })
    @ApiProperty({ description: 'Este es el nombre del ensayo' })
    readonly nombre_ensayo: string;  // <-- Corregido

    @IsNumber({}, { message: 'El id del servicio debe ser un número' })
    @IsNotEmpty({ message: 'El id del servicio está vacío' })
    @ApiProperty({ description: 'Este es el id del servicio asociado al ensayo' })
    readonly tipo_servicio_id: number;  // <-- Corregido
}

export class CrearEnsayoDto extends OmitType(
    ActualizarEnsayoDto,
    ['id'],
) {}

export class ObtenerPorIdEnsayoDto extends PickType(
    ActualizarEnsayoDto,
    ['id'],
) {}

export class EliminarEnsayoDto extends PickType(
    ActualizarEnsayoDto,
    ['id'],
) {}

export class RetornoEnsayo extends ActualizarEnsayoDto {}
