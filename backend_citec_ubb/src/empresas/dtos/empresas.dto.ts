import {
    IsString,
    IsNotEmpty,
    IsEmail,
    Length,
    IsIn,
    Matches,
    IsNumber,
    IsOptional,
    ValidateNested,
    IsArray,
} from 'class-validator';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { ESTADOS, Estados } from '../../common/constants/estados.constants';
import { Transform, Type } from 'class-transformer';
import { toCapitalizeCase } from '../../common/utils/capitalize';
import { rutRegex, telefonoRegex } from '../../common/utils/regex';
import { ContactoDto } from './contacto.dto';
import { Contactos } from '../../database/models/contactos.model';
import { Giros } from '../../database/models/giros.model';
import { Comunas } from 'src/database/models/comunas.model';
import { ComunasRetornoDto } from './comunas.dto';
import { GirosRetornoDto } from './giros.dto';

export class ActualizarEmpresasDto {
    @Length(1, 15, {
        message: 'La longitud del rut debe ser entre 1 y 15 caracteres',
    })
    @Matches(rutRegex, { message: 'El rut debe ser un rut valido' })
    @IsString({ message: 'El rut debe ser texto' })
    @IsNotEmpty({ message: 'El rut esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toLowerCase();
    })
    @ApiProperty({
        description: 'Este es el rut de la empresa',
        default: '11.111.111-1',
    })
    readonly rut: string;

    @Length(1, 15, {
        message: 'La longitud del rut debe ser entre 1 y 15 caracteres',
    })
    @Matches(rutRegex, { message: 'El rut debe ser un rut valido' })
    @IsString({ message: 'El rut debe ser texto' })
    @IsNotEmpty({ message: 'El rut esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toLowerCase();
    })
    @ApiProperty({
        description: 'Este es el rut de la empresa',
        default: '11.111.111-2',
    })
    readonly nuevo_rut: string;

    @Length(1, 100, {
        message:
            'La longitud de la razon social debe ser entre 1 y 80 caracteres',
    })
    @IsString({ message: 'La razon social debe ser texto' })
    @IsNotEmpty({ message: 'La razon social esta vacia' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toUpperCase();
    })
    @ApiProperty({
        description: 'Este es el nombre de la empresa',
        default: 'INMOBILIARIA VALLE NOBLE S.A',
    })
    readonly razon_social: string;

    @Length(1, 100, {
        message:
            'La longitud de la nombre de fantasia debe ser entre 1 y 100 caracteres',
    })
    @IsString({ message: 'La nombre de fantasia debe ser texto' })
    @IsNotEmpty({ message: 'La nombre de fantasia esta vacia' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toUpperCase();
    })
    @ApiProperty({
        description: 'Este es el nombre de fantasia de la empresa',
        default: 'INMOBILIARIA VALLE NOBLE S.A',
    })
    readonly nombre_de_fantasia: string;

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
    @ApiProperty({
        description: 'Este es el email de la empresa',
        default: 'juan@gmail.com',
    })
    readonly email_factura: string;

    @Length(1, 150, {
        message:
            'La longitud de la direccion debe ser entre 1 y 150 caracteres',
    })
    @IsString({ message: 'La direccion debe ser texto' })
    @IsNotEmpty({ message: 'La direccion esta vacia' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return toCapitalizeCase(value);
    })
    @ApiProperty({
        description: 'Este es la direccion de la empresa',
        default: 'Calle Bulnes 1080 N°10',
    })
    readonly direccion: string;

    @IsNumber({}, { message: 'El id de la comuna debe ser un numero' })
    @IsNotEmpty({ message: 'El id de la comuna esta vacio' })
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({
        description: 'Este es el id de la comuna de la empresa',
        default: 1101,
    })
    readonly id_comunas: number;

    @Length(1, 20, {
        message: 'La longitud del telefono debe ser entre 1 y 20 caracteres',
    })
    @Matches(telefonoRegex, {
        message: 'El telefono debe ser un telefono valido',
    })
    @IsString({ message: 'El telefono debe ser texto' })
    @IsOptional()
    @ApiProperty({
        description: 'Este es el telefono de la empresa',
        default: '+56912345678',
    })
    readonly telefono: string;

    @ValidateNested({ each: true })
    @Type(() => ContactoDto)
    @IsOptional()
    @ApiProperty({
        description: 'Estos son los contactos de la empresa',
        type: [ContactoDto],
    })
    readonly contactos: ContactoDto[];

    @IsArray({ message: 'Los giros deben ser un array' })
    @IsNumber({}, { each: true, message: 'Los giros deben ser numeros' })
    @IsNotEmpty({ message: 'Los giros estan vacios' })
    @ApiProperty({
        description: 'Estos son los giros de la empresa',
        default: [11101, 11102, 11103],
    })
    readonly giros: number[];
}

export class CrearEmpresasDto extends OmitType(ActualizarEmpresasDto, [
    'nuevo_rut',
]) {}

export class ObtenerPorIdEmpresasDto extends PickType(ActualizarEmpresasDto, [
    'rut',
]) {}

export class EliminarEmpresasDto extends PickType(ActualizarEmpresasDto, [
    'rut',
]) {}

export class RetornoEmpresasDto extends OmitType(ActualizarEmpresasDto, [
    'nuevo_rut',
    'id_comunas',
    'giros',
]) {
    @ApiProperty({
        description: 'Este es el estado de la empresa',
        enum: ESTADOS,
    })
    readonly estado: Estados;

    @ApiProperty({
        description: 'Esta es la comuna de la empresa',
        type: () => ComunasRetornoDto,
    })
    @ValidateNested()
    @Type(() => ComunasRetornoDto)
    readonly comuna: ComunasRetornoDto;

    @ApiProperty({
        description: 'Estos son los giros de la empresa',
        type: () => [GirosRetornoDto],
    })
    @ValidateNested({ each: true })
    @Type(() => GirosRetornoDto)
    readonly giros: GirosRetornoDto[];
}
