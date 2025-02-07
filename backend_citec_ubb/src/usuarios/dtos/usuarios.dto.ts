import {
    IsString,
    IsNotEmpty,
    IsEmail,
    Length,
    IsIn,
    Matches,
    IsAlphanumeric,
} from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { toCapitalizeCase } from '../../common/utils/capitalize';
import {
    TIPOS_DE_USUARIO,
    TiposDeUsuario,
} from '../../common/constants/tipos-usuarios.constants';

export class IniciarSesionDto {
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
    @ApiProperty({ description: 'Este es el email del usuario' })
    readonly email: string;

    @Length(1, 250, {
        message:
            'La longitud de la contraseña debe ser entre 1 y 250 caracteres',
    })
    @IsString({ message: 'La contraseña debe ser alfanumerica' })
    @IsNotEmpty({ message: 'La contraseña está vacia' })
    @ApiProperty({ description: 'Esta es la contraseña del usuario' })
    readonly contraseña: string;
}

export class CrearUsuariosDto {
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
    @ApiProperty({ description: 'Este es el email del usuario' })
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
    @ApiProperty({
        description: 'Este es el nombre del usuario',
        default: 'Juan',
    })
    readonly nombre: string;

    @Length(1, 50, {
        message: 'La longitud del apellido debe ser entre 1 y 50 caracteres',
    })
    @IsString({ message: 'El apellido debe ser texto' })
    @IsNotEmpty({ message: 'El apellido esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return toCapitalizeCase(value);
    })
    @ApiProperty({ description: 'Este es el apellido', default: 'Perez' })
    readonly apellido: string;

    @Length(1, 250, {
        message:
            'La longitud de la contraseña debe ser entre 1 y 250 caracteres',
    })
    @IsString({ message: 'La contraseña debe ser alfanumerica' })
    @IsNotEmpty({ message: 'La contraseña esta vacia' })
    @ApiProperty({
        description: 'Esta es la contraseña del usuario',
        default: '$_i;3%z2hpNJM!C4X',
    })
    readonly contraseña: string;

    @IsIn(Object.values(TIPOS_DE_USUARIO), {
        message: 'El nombre del tipo debe ser uno de los valores permitidos',
    })
    @Length(1, 30, {
        message:
            'La longitud del nombre del tipo debe ser entre 1 y 30 caracteres',
    })
    @IsString({ message: 'El nombre del tipo debe ser texto' })
    @IsNotEmpty({ message: 'El nombre del tipo esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toUpperCase();
    })
    @ApiProperty({
        description: 'Este es el tipo de usuario',
        default: 'ADMINISTRADOR',
    })
    readonly nombre_tipos: TiposDeUsuario;
}

export class ObtenerPorIdUsuariosDto extends PickType(CrearUsuariosDto, [
    'email',
]) {}

export class ActualizarUsuariosDto extends CrearUsuariosDto {
    @Length(1, 70, {
        message: 'La longitud del nuevo email debe ser entre 1 y 70 caracteres',
    })
    @IsEmail({}, { message: 'El nuevo email debe ser un email valido' })
    @IsString({ message: 'El nuevo email debe ser texto' })
    @IsNotEmpty({ message: 'El nuevo email está vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toLowerCase();
    })
    @ApiProperty({ description: 'Este es el nuevo email del usuario' })
    readonly nuevo_email: string;
}

export class EliminarUsuariosDto extends PickType(CrearUsuariosDto, [
    'email',
]) {}
