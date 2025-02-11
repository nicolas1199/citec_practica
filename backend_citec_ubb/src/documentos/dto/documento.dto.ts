import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsIn, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { IsAfter, IsBefore } from 'sequelize-typescript';
import { TIPOS_DE_DOCUMENTO } from 'src/common/constants/tipos-documentos.constants';
import { toCapitalizeCase } from 'src/common/utils/capitalize';

export class CreateDocumentoDto {

    @ApiProperty({
        description: 'Este es el nombre del informe',
        default: 'MASA DE UN FOTON',
    })
    @Length(1, 50, {
        message: 'La longitud del nombre del proyecto debe ser entre 1 y 50 caracteres',
    })
    @IsString({ message: 'El nombre del proyecto debe ser texto' })
    @IsNotEmpty({ message: 'El nombre del proyecto esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return toCapitalizeCase(value);
    })
    readonly nombre: string;

    @Length(1, 80, {
        message: 'La longitud del ejecutor debe ser entre 1 y 80 caracteres'
    })
    @IsString({
        message: 'El nombre del ejecutor debe ser un nombre valido'
    })
    @IsNotEmpty({message: 'El nombre del ejecutor esta vacio'})
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return toCapitalizeCase(value);
    })
    readonly ejecutor: string

    @ApiProperty({
        description: 'Este es el nombre del cliente',
        default: 'MASA DE UN FOTON',
    })
    @Length(1, 50, {
        message: 'La longitud del nombre del cliente debe ser entre 1 y 50 caracteres',
    })
    @IsString({ message: 'El nombre del cliente debe ser texto' })
    @IsNotEmpty({ message: 'El nombre del cliente esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return toCapitalizeCase(value);
    })
    readonly cliente: string;
    
    @Length(1, 100, {
        message: 'La longitud la direccion debe ser entre 1 y 100 caracteres'
    })
    @IsString({
        message: 'El nombre la direccion debe ser un nombre valido'
    })
    @IsNotEmpty({message: 'El nombre la direccion esta vacio'})
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return toCapitalizeCase(value);
    })
    readonly dirreccion: string

    @IsIn(Object.values(TIPOS_DE_DOCUMENTO),{
        message: 'El nombre del tipo debe ser uno de los valores permitidos'
    })
    @Length(1,50,{
        message: 'La longitud del nombre del tipo debe ser entre 1 y 50 caracteres',
    })
    @IsString({ message: 'El nombre del tipo debe ser texto' })
    @IsNotEmpty({ message: 'El nombre del tipo esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toUpperCase();
    })
    @ApiProperty({
        description: 'Este es el codigo de area',
        default: 'ADMINISTRADOR',
    })
    readonly tipo: string

    @Length(1,20,{
        message: 'La longitud debe ser entre 1 y 20 caracteres'
    })
    @IsDate({
        message: 'El formato de fecha es aaaa-mm-dd hh:mm:ss'
    })
    @IsNotEmpty({
        message:'La fecha de inicio esta vacia'
    })
    @ApiProperty({
        description: 'Esta es la fecha de inicio del proyecto',
        default:'2025-12-31 12:00:00'
    })
    readonly fecha_inicio: Date
}
export class obtenerDocumentoPorIdDto {
    @IsNumber({}, { message: 'Numero correlativo' })
    @IsNotEmpty({ message: 'El numero esta vacio' })
    @ApiProperty({
        description: 'Este es el numero de documento',
        default: 1101,
    })
    readonly numero: number;
}

export class UpdateDocumentoDto {

}
export class EliminarDocumentoDto extends PickType(obtenerDocumentoPorIdDto, ['numero']) { }