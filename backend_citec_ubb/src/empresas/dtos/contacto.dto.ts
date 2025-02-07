import {
    IsString,
    IsNotEmpty,
    IsEmail,
    Length,
    Matches,
    IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import { toCapitalizeCase } from '../../common/utils/capitalize';

import { telefonoRegex } from '../../common/utils/regex';

export class ContactoDto {
    @Length(1, 70, {
        message: 'La longitud del email debe ser entre 1 y 70 caracteres',
    })
    @IsEmail({}, { message: 'El email debe ser un email valido' })
    @IsString({ message: 'El email debe ser texto' })
    @IsNotEmpty({ message: 'El email esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toLowerCase();
    })
    @ApiProperty({ description: 'Este es el email del contacto' })
    readonly email: string;

    @Length(1, 50, {
        message: 'La longitud del nombre debe ser entre 1 y 50 caracteres',
    })
    @IsString({ message: 'El nombre debe ser texto' })
    @IsNotEmpty({ message: 'El nombre esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return toCapitalizeCase(value);
    })
    @ApiProperty({ description: 'Este es el nombre del contacto' })
    readonly nombre: string;

    @Length(1, 50, {
        message: 'La longitud del cargo debe ser entre 1 y 50 caracteres',
    })
    @IsString({ message: 'El cargo debe ser texto' })
    @IsNotEmpty({ message: 'El cargo esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return toCapitalizeCase(value);
    })
    @ApiProperty({ description: 'Este es el cargo del contacto' })
    readonly cargo: string;
}
