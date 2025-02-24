import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
} from '@nestjs/common';
import { BaseControllersSimple } from '../../common/base/base-controllers-simple.class';
import { EnsayosService } from '../services/ensayo.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiRespuestaError, Tipo } from '../../common/utils/decorators';
import { TIPOS_DE_USUARIO } from '../../common/constants/tipos-usuarios.constants';
import {
    CrearEnsayoDto,
    ActualizarEnsayoDto,
    ObtenerPorIdEnsayoDto,
    RetornoEnsayoDto,
} from '../dtos/ensayo.dto';
import { ErrorRespuestaDto } from 'src/common/dtos/error-respuesta.dto';
console.log('EnsayosController cargado');

@ApiTags('Ensayos')
@Controller('ensayos')

export class EnsayosController {
    constructor(private ensayosService: EnsayosService) {console.log('EnsayosController cargado');}
    
    @ApiOperation({ summary: 'Obtener todos los ensayos' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @ApiResponse({
        status: 404,
        description: 'No encontrado',
        type: ErrorRespuestaDto,
    })
    @Get('obtener-todos')
    obtenerTodos(): Promise<RetornoEnsayoDto[]> {
        return this.ensayosService.obtenerTodos();
    }

    @ApiOperation({ summary: 'Obtener ensayo por ID' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Get('obtener-por-id/:id')
    obtenerPorId(@Param() params: ObtenerPorIdEnsayoDto) {
        return this.ensayosService.obtenerPorId(params);
    }

    @ApiOperation({ summary: 'Crear un nuevo ensayo' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Post('crear')
    crear(@Body() ensayo: CrearEnsayoDto) {
        return this.ensayosService.crear(ensayo);
    }

    @ApiOperation({ summary: 'Actualizar un ensayo existente' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Put('actualizar')
    actualizar(@Body() ensayo: ActualizarEnsayoDto) {
        return this.ensayosService.actualizar(ensayo);
    }

    @ApiOperation({ summary: 'Eliminar un ensayo' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Delete('eliminar/:id')
    eliminar(@Param('id') id: number) {
        return this.ensayosService.eliminar({ id });
    }
}