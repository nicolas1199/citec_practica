import { OmitType, PickType } from '@nestjs/swagger';
import { Usuarios } from 'src/database/models/usuarios.model';

export class AutenticacionUsuariosRespuestaDto extends PickType(Usuarios, [
    'email',
    'nombre',
    'apellido',
    'contraseña',
    'estado',
    'nombre_tipos',
    'createdAt',
    'updatedAt',
]) {
    token: string;
}
