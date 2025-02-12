import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CrearEncargadosEmpresasDTO {
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({
        description: 'Este es el id del encargado de la empresa',
        default: 1,
    })
    readonly id: number;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Este es el nombre del encargado de la empresa',
        default: 'Juan Perez',
    })
    readonly nombre: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Este es el rut de la empresa a la que pertenece',
        default: '11.111.111-1',
    })
    readonly rutEmpresa: string;
}

export class EncargadosEmpresasRetornoDto {
    @IsNotEmpty()
    @ApiProperty({
        description: 'Este es el nombre del encargado de la empresa',
        default: 'Juan Perez',
    })
    readonly nombre: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Este es el rut de la empresa a la que pertenece',
        default: '11.111.111-1',
    })
    readonly rutEmpresa: string;
}

export class ObtenerPorIdEncargadosEmpresasDTO {
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({
        description: 'Este es el id del encargado de la empresa',
        default: 1,
    })
    readonly id: number;
}

export class ActualizarEncargadosEmpresasDTO {
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({
        description: 'Este es el id del encargado de la empresa',
        default: 1,
    })
    readonly id: number;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Este es el nuevo nombre del encargado de la empresa',
        default: 'Juan Perez',
    })
    readonly nombre: string;
}

export class EliminarEncargadosEmpresasDTO {
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({
        description: 'Este es el id del encargado de la empresa a eliminar',
        default: 1,
    })
    readonly id: number;
}
