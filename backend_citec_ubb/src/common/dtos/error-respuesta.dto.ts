import { ApiProperty } from '@nestjs/swagger';

export class ErrorRespuestaDto {
    @ApiProperty({
        example: ['Descripcion del error'],
    })
    readonly message: string[];

    @ApiProperty({
        example:
            'Bad Request | Forbidden | Conflict | Not Found | Internal Server Error',
    })
    readonly error: string;

    @ApiProperty({
        example: '400 | 403 | 404 | 409 | 500',
    })
    readonly statusCode: number;
}
