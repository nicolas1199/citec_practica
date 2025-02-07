import {
    IsString,
    IsNotEmpty,
    Length,
    IsIn,
    Matches,
    IsNumber,
    ArrayMinSize,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { ApiProperty, PickType, OmitType } from '@nestjs/swagger';
import {
    ADJUDICADO,
    Adjudicado,
} from '../../common/constants/adjudicados.constants';
import { ESTADOS, Estados } from '../../common/constants/estados.constants';
import { Transform, Type } from 'class-transformer';
import { toCapitalizeCase } from '../../common/utils/capitalize';
import {
    TIPOS_DE_PAGO,
    TiposDePago,
} from 'src/common/constants/tipos-de-pagos.constants';

export class ActualizarOrdenesDeTrabajoDto {
    // @IsNumber({}, { message: 'El id de la orden de trabajo debe ser un número' })
    // @IsNotEmpty({ message: 'El id de la orden de trabajo está vacio' })
    // @ApiProperty({ description: 'Este es el id de la orden de trabajo' })
    // readonly id: number;

    // @IsNumber({}, { message: 'El año de la orden de trabajo debe ser un número' })
    // @IsNotEmpty({ message: 'El año de la orden de trabajo está vacio' })
    // @ApiProperty({ description: 'Este es el año de la orden de trabajo' })
    // readonly año: number;

    @IsNotEmpty({
        message: 'La fecha de solicitud de la orden de trabajo está vacia',
    })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'La fecha de solicitud debe tener el formato YYYY-MM-DD',
    })
    @ApiProperty({
        description: 'Esta es la fecha de solicitud de la orden de trabajo',
    })
    readonly fecha_solicitud: Date;

    @Length(1, 30, {
        message:
            'La longitud del nombre del solicitante de la orden de trabajo debe ser entre 1 y 30 caracteres',
    })
    @IsString({
        message:
            'El nombre del solicitante de la orden de trabajo debe ser texto',
    })
    @IsNotEmpty({ message: 'El rut de la orden de trabajo está vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return toCapitalizeCase(value);
    })
    @ApiProperty({
        description: 'Este es el nombre del solicitante de la orden de trabajo',
    })
    readonly nombre_solicitante: string;

    @IsNotEmpty({ message: 'La fecha de la orden de trabajo está vacia' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'La fecha debe tener el formato YYYY-MM-DD',
    })
    @ApiProperty({ description: 'Esta es la fecha de la orden de trabajo' })
    readonly fecha_entrega: Date;

    @Length(1, 300, {
        message:
            'La longitud de la observacion debe ser entre 1 y 300 caracteres',
    })
    @IsString({ message: 'La observacion debe ser texto' })
    @IsNotEmpty({ message: 'La observacion está vacia' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toLowerCase();
    })
    @ApiProperty({
        description: 'Este es la observacion de la orden de trabajo',
    })
    readonly observacion: string;

    @Length(1, 150, {
        message:
            'La longitud de la direccion debe ser entre 1 y 150 caracteres',
    })
    @IsString({ message: 'La direccion debe ser texto' })
    @IsNotEmpty({ message: 'La direccion está vacia' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return toCapitalizeCase(value);
    })
    @ApiProperty({ description: 'Este es la direccion de la orden de trabajo' })
    readonly direccion: string;

    @IsNumber({}, { message: 'El id de la comuna debe ser un número' })
    @IsNotEmpty({ message: 'El id de la comuna está vacia' })
    @ApiProperty({
        description: 'Este es el id de la comuna de la orden de trabajo',
    })
    readonly id_comunas: number;

    @IsNumber(
        {},
        { message: 'El id de la propuesta de servicio debe ser un número' },
    )
    @IsNotEmpty({ message: 'El id de la propuesta de servicio está vacia' })
    @ApiProperty({
        description: 'Este es el id de la comuna de la orden de trabajo',
    })
    readonly id_propuesta_de_servicio: number;

    @IsArray()
    @ArrayMinSize(1, { message: 'Debe incluir al menos un archivo' })
    @ValidateNested({ each: true })
    @ApiProperty({
        description: 'Archivos adjuntos de pagos (PDF o imágenes)',
        type: 'array',
        items: {
            type: 'string',
            format: 'binary',
        },
    })
    @Matches(/\.(pdf|jpg|jpeg|png)$/i, {
        each: true,
        message: 'Los archivos deben ser PDF o imágenes (jpg, jpeg, png)',
    })
    readonly imagen: Buffer[];

    @IsNumber(
        {},
        { message: 'El numero de la orden de trabajo debe ser un número' },
    )
    @IsNotEmpty({ message: 'El numero de la orden de trabajo está vacia' })
    @ApiProperty({
        description: 'Este es el numero de la comuna de la orden de trabajo',
    })
    readonly numero: number;

    @IsIn(Object.values(TIPOS_DE_PAGO), {
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
    readonly tipo: TiposDePago;
}

export class CrearOrdenesDeTrabajoDto extends ActualizarOrdenesDeTrabajoDto {}

export class ObtenerPorIdOrdenesDeTrabajoDto {
    @IsNumber(
        {},
        { message: 'El id de la orden de trabajo debe ser un número' },
    )
    @IsNotEmpty({ message: 'El id de la orden de trabajo está vacio' })
    @ApiProperty({ description: 'Este es el id de la orden de trabajo' })
    readonly id: number;
}

export class EliminarOrdenesDeTrabajoDto extends PickType(
    ObtenerPorIdOrdenesDeTrabajoDto,
    ['id'],
) {}

// export class RetornoPropuestaDeServicio extends OmitType(ActualizarPropuestasDeServiciosDto, []) {

//     @ApiProperty({
//         description: 'Este es el estado de la propuesta de servicio',
//         enum: ESTADOS
//     })
//     readonly estado: Estados;

//     @ApiProperty({
//         description: 'Este es el rut de la empresa',
//         type: () => RetornoEmpresasDto
//     })
//     @ValidateNested()
//     @Type(() => RetornoEmpresasDto)
//     readonly empresa: RetornoEmpresasDto;

// }
