export interface CrearUsuariosDto {
    readonly email: string;
    readonly nombre: string;
    readonly apellido: string;
    readonly contraseña: string;
    readonly nombre_tipos: string;
}

export interface ActualizarUsuarioDto {
    readonly email: string;
    readonly nombre: string;
    readonly apellido: string;
    readonly contraseña: string;
    readonly nombre_tipos: string;
    readonly nuevo_email: string;
}

export interface AutenticacionUsuarioRespuestaDto {
    readonly email: string;
    readonly nombre: string;
    readonly apellido: string;
    readonly contraseña: string;
    readonly estado: string;
    readonly nombre_tipos: string;
    readonly createAt: string;
    readonly updatedAt: string;
    readonly token: string;
}
