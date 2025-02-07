import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ObtenerPorIdGrupoDeServiciosDto {
    @IsString({ message: 'El nombre debe ser texto' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @ApiProperty({ description: 'Nombre del grupo de servicios' })
    readonly nombre: string;
}

export class RetornoGrupoDeServiciosDto {
    @ApiProperty({ description: 'Nombre del grupo de servicios' })
    readonly nombre: string;
}
