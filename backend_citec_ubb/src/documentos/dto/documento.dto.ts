import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { toCapitalizeCase } from 'src/common/utils/capitalize';

export class CreateDocumentoDto {

    @IsNumber({},{message: 'Numero correlativo'})
    @IsNotEmpty({message: 'El numero esta vacio'})
    @ApiProperty({
        description: 'Este es el numero de documento',
        default: 1101,
    })
    readonly numero: number;

    @Length(1, 70, {
        message: 'Longitud del email debe ser entre 1 y 70 caracteres',
    })
    @IsEmail({}, {
        message: 'El email debe ser un email valido'
    })
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

    
}
export class obtenerDocumentoPorIdDto extends PickType(CreateDocumentoDto,['numero']){}

export class UpdateDocumentoDto {
    constructor(parameters) {
        
    }
}
export class EliminarDocumentoDto extends PickType(CreateDocumentoDto,['numero']){}