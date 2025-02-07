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
// Remove GruposDeServicios import
import SubServicios from 'src/database/models/sub-servicios.model';
import { RetornoEmpresasDto } from '../../empresas/dtos/empresas.dto';
import { rutRegex } from '../../common/utils/regex';

export class ActualizarPropuestasDeServiciosDto {
    @IsNumber(
        {},
        { message: 'El id de la propuesta de servicio debe ser un número' },
    )
    @IsNotEmpty({ message: 'El id de la propuesta de servicio está vacio' })
    @ApiProperty({ description: 'Este es el id de la propuesta de servicio' })
    readonly id: number;

    @IsNumber(
        {},
        { message: 'El año de la propuesta de servicio debe ser un número' },
    )
    @IsNotEmpty({ message: 'El año de la propuesta de servicio está vacio' })
    @ApiProperty({ description: 'Este es el año de la propuesta de servicio' })
    readonly año: number;

    @IsNumber(
        {},
        { message: 'El pago de la propuesta de servicio debe ser un número' },
    )
    @IsNotEmpty({ message: 'El pago de la propuesta de servicio está vacio' })
    @ApiProperty({ description: 'Este es el pago de la propuesta de servicio' })
    readonly pago: number;

    @IsNotEmpty({ message: 'La fecha de la propuesta de servicio está vacia' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'La fecha debe tener el formato YYYY-MM-DD',
    })
    @ApiProperty({
        description: 'Esta es la fecha de la propuesta de servicio',
    })
    readonly fecha: Date;

    @Length(1, 15, {
        message:
            'La longitud del rut de la propuesta de servicio debe ser entre 1 y 15 caracteres',
    })
    @Matches(rutRegex, { message: 'El rut debe ser un rut valido' })
    @IsString({ message: 'El rut de la propuesta de servicio debe ser texto' })
    @IsNotEmpty({ message: 'El rut de la propuesta de servicio está vacio' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        return value.toLowerCase();
    })
    @ApiProperty({ description: 'Este es el rut de la propuesta de servicio' })
    readonly rut_receptor: string;

    @IsIn(Object.values(ADJUDICADO), {
        message: 'El estado debe ser uno de los valores permitidos',
    })
    @Length(1, 2, {
        message: 'La longitud del adjudicado debe ser entre 1 y 2 caracteres',
    })
    @IsString({ message: 'El adjudicado debe ser texto' })
    @IsNotEmpty({ message: 'El adjudicado está vacio' })
    readonly adjudicado: Adjudicado;

    @IsArray()
    @IsString({ each: true })
    @ApiProperty({
        description: 'Nombres de los subservicios',
        example: ['SubServicio1', 'SubServicio2'],
    })
    readonly sub_servicios: string[];
}

export class CrearPropuestasDeServiciosDto extends OmitType(
    ActualizarPropuestasDeServiciosDto,
    ['id'],
) {}

export class ObtenerPorIdPropuestasDeServiciosDto extends PickType(
    ActualizarPropuestasDeServiciosDto,
    ['id'],
) {}

export class EliminarPropuestasDeServiciosDto extends PickType(
    ActualizarPropuestasDeServiciosDto,
    ['id'],
) {}

export class RetornoPropuestaDeServicio extends OmitType(
    ActualizarPropuestasDeServiciosDto,
    ['rut_receptor', 'sub_servicios'],
) {
    @ApiProperty({
        description: 'Este es el estado de la propuesta de servicio',
        enum: ESTADOS,
    })
    readonly estado: Estados;

    @ApiProperty({
        description: 'Este es el rut de la empresa',
        type: () => RetornoEmpresasDto,
    })
    @ValidateNested()
    @Type(() => RetornoEmpresasDto)
    readonly empresa: RetornoEmpresasDto;
}
