import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AutenticacionService } from '../services/autenticacion.service';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { IniciarSesionDto } from '../../usuarios/dtos/usuarios.dto';
import { Public } from '../../common/utils/decorators';
import { AutenticacionUsuariosRespuestaDto } from '../dto/autenticacion-respuesta.dto';

@Controller('autenticacion')
export class AutenticacionController {
    constructor(
        private autenticacionService: AutenticacionService,
        private usuarioServicio: UsuariosService,
    ) {}

    //Inicio de sesion del usuario
    @Public()
    @HttpCode(200)
    @Post('iniciar-sesion')
    async iniciarSesion(
        @Body() iniciarSesion: IniciarSesionDto,
    ): Promise<AutenticacionUsuariosRespuestaDto> {
        const usuario = (
            await this.usuarioServicio.iniciarSesion(iniciarSesion)
        ).dataValues;

        const token = await this.autenticacionService.generateToken(usuario);

        const autenticacion: AutenticacionUsuariosRespuestaDto = {
            ...usuario,
            token,
        };

        return autenticacion;
    }
}
