import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class GenerarPdfDto {
    @ApiProperty({
        description: 'Contenido HTML del informe',
        example: '<p>Este es un informe de ejemplo</p>',
    })
    @IsObject()
    @IsNotEmpty({ message: 'El contenido del informe no puede estar vacío' })
    readonly contenido: Record<string, string>;

    @ApiProperty({
        description: 'Título del informe',
        example: 'Informe de Análisis Estructural',
    })
    @IsString()
    @IsNotEmpty({ message: 'El título del informe no puede estar vacío' })
    readonly titulo: string;

    @ApiProperty({
        description: 'Tipo de servicio',
        example: 'EC',
        required: false,
    })
    @IsString()
    @IsOptional()
    readonly tipoServicio?: string;

    @ApiProperty({
        description: 'ID del documento asociado (opcional)',
        example: 1101,
        required: false,
    })
    @IsOptional()
    readonly documentoId?: number;
}
