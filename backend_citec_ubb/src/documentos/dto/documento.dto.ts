import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsString, Length, Matches } from 'class-validator';
import { AREAS_DE_DOCUMENTO } from 'src/common/constants/area-documentos.constants';
import { VALIDEZ_DE_DOCUMENTO } from 'src/common/constants/validez-de-documento.constants';

export class CrearDocumentoDto {

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
        return value.toUpperCase()
    })
    readonly nombre: string;

    @Length(1, 80, {
        message: 'La longitud del ejecutor debe ser entre 1 y 80 caracteres'
    })
    @IsString({
        message: 'El nombre del ejecutor debe ser un nombre valido'
    })
    @IsNotEmpty({ message: 'El nombre del ejecutor esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toUpperCase()
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
        return value.toUpperCase()
    })
    readonly cliente: string;

    @Length(1, 100, {
        message: 'La longitud la direccion debe ser entre 1 y 100 caracteres'
    })
    @IsString({
        message: 'El nombre la direccion debe ser un nombre valido'
    })
    @IsNotEmpty({ message: 'El nombre la direccion esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toUpperCase()
    })
    readonly direccion: string

    @IsIn(Object.values(AREAS_DE_DOCUMENTO), {
        message: 'El area debe ser uno de los valores permitidos'
    })
    @Length(1, 50, {
        message: 'La longitud del nombre del tipo debe ser entre 1 y 50 caracteres',
    })
    @IsString({ message: 'El codigo del area debe ser texto' })
    @IsNotEmpty({ message: 'El codigo del area esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toUpperCase();
    })
    @ApiProperty({
        description: 'Este es el codigo de area',
        default: 'AA',
    })
    readonly area_documento: string

    @IsNotEmpty({ message: 'La fecha de inicio esta vacia' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'La fecha de solicitud debe tener el formato YYYY-MM-DD',
    })
    @ApiProperty({ description: 'Esta es la fecha de inicio del proyecto', })
    readonly fecha_inicio: Date

    @IsNotEmpty({ message: 'La fecha de finalizacion esta vacia' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'La fecha de solicitud debe tener el formato YYYY-MM-DD',
    })
    @ApiProperty({ description: 'Esta es la fecha de finalizacion del proyecto' })
    readonly fecha_finalizacion: Date

    @IsIn(Object.values(VALIDEZ_DE_DOCUMENTO), {
        message: 'La validez debe ser uno de los valores permitidos'
    })
    @Length(1, 50, {
        message: 'La longitud del nombre del tipo debe ser entre 1 y 50 caracteres',
    })
    @IsString({ message: 'El estado de validez debe ser texto' })
    @IsNotEmpty({ message: 'El estado de validez esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toUpperCase();
    })
    @ApiProperty({
        description: 'Este es el codigo de area',
        default: 'AA',
    })
    readonly validez_documento: string

}
export class obtenerDocumentoPorIdDto {
    @IsNumber({}, { message: 'Numero del documento' })
    @IsNotEmpty({ message: 'El numero esta vacio' })
    @ApiProperty({
        description: 'Este es el numero de documento',
        default: 1101,
    })
    readonly numero: number;
}

export class ActualizarDocumentoDto extends CrearDocumentoDto {
    @IsNumber({}, { message: 'Numero del documento' })
    @IsNotEmpty({ message: 'El numero esta vacio' })
    @ApiProperty({
        description: 'Este es el numero de documento',
        default: 1101,
    })
    readonly numero: number;

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
        return value.toUpperCase()
    })
    readonly nuevo_nombre: string;
    @Length(1, 100, {
        message: 'La longitud la direccion debe ser entre 1 y 100 caracteres'
    })
    @IsString({
        message: 'El nombre la direccion debe ser un nombre valido'
    })
    @IsNotEmpty({ message: 'El nombre la direccion esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toUpperCase()
    })
    readonly nueva_direccion: string

    @IsIn(Object.values(AREAS_DE_DOCUMENTO), {
        message: 'El area debe ser uno de los valores permitidos'
    })
    @Length(1, 50, {
        message: 'La longitud del nombre del tipo debe ser entre 1 y 50 caracteres',
    })
    @IsString({ message: 'El codigo del area debe ser texto' })
    @IsNotEmpty({ message: 'El codigo del area esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toUpperCase();
    })
    @ApiProperty({
        description: 'Este es el codigo de area',
        default: 'AA',
    })
    readonly nueva_area_documento: string

    @IsNotEmpty({ message: 'La fecha de inicio esta vacia' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'La fecha de solicitud debe tener el formato YYYY-MM-DD',
    })
    @ApiProperty({ description: 'Esta es la fecha de inicio del proyecto', })
    readonly nueva_fecha_inicio: Date

    @IsNotEmpty({ message: 'La fecha de finalizacion esta vacia' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'La fecha de solicitud debe tener el formato YYYY-MM-DD',
    })
    @ApiProperty({ description: 'Esta es la fecha de finalizacion del proyecto' })
    readonly nueva_fecha_finalizacion: Date

    @IsIn(Object.values(VALIDEZ_DE_DOCUMENTO), {
        message: 'La validez debe ser uno de los valores permitidos'
    })
    @Length(1, 50, {
        message: 'La longitud del nombre del tipo debe ser entre 1 y 50 caracteres',
    })
    @IsString({ message: 'El estado de validez debe ser texto' })
    @IsNotEmpty({ message: 'El estado de validez esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toUpperCase();
    })
    @ApiProperty({
        description: 'Este es el codigo de area',
        default: 'AA',
    })
    readonly nueva_validez_documento: string
}
export class EliminarDocumentoDto extends PickType(obtenerDocumentoPorIdDto, ['numero']) {
    @IsIn(Object.values(VALIDEZ_DE_DOCUMENTO), {
        message: 'La validez debe ser uno de los valores permitidos'
    })
    @Length(1, 50, {
        message: 'La longitud del nombre del tipo debe ser entre 1 y 50 caracteres',
    })
    @IsString({ message: 'El estado de validez debe ser texto' })
    @IsNotEmpty({ message: 'El estado de validez esta vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toUpperCase();
    })
    @ApiProperty({
        description: 'Este es el codigo de area',
        default: 'AA',
    })
    readonly nueva_validez_documento: string
}