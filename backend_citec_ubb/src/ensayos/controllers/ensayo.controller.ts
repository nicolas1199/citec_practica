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

@ApiTags('Ensayos')
@Controller('ensayos')

export class EnsayosController {
    constructor(private ensayosService: EnsayosService) {}
    
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
    obtenerPorId(@Param('id') id: string) {

    // Convertir el id de string a número
    const idNumber = Number(id);
    

    if (isNaN(idNumber)) {
        console.error("❌ Error: El ID no es un número válido");
        throw new Error("ID inválido");
    }
    // Pasar el id convertido al servicio
    return this.ensayosService.obtenerPorId({ id: idNumber });
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
    @Put('editar/:id') 
    actualizar(@Param('id') id:number, @Body() ensayo: ActualizarEnsayoDto) {
    try {
        console.log('🔄 Actualizando ensayo con ID:', id);
        console.log('📝 Nuevos datos para el ensayo:', ensayo);
        
        return this.ensayosService.actualizar(id, ensayo);
    } catch (error) {
        console.error('❌ Error actualizando ensayo:', error);
        throw error;  // Lanzar el error para que sea manejado en un middleware de error global
    }
    }

    @ApiOperation({ summary: 'Eliminar un ensayo' })
    @ApiRespuestaError()
    @Tipo(TIPOS_DE_USUARIO.OPCION_1, TIPOS_DE_USUARIO.OPCION_3)
    @Delete('eliminar/:id')
    eliminar(@Param('id') id: number) {
        return this.ensayosService.eliminar({id});
    }
}