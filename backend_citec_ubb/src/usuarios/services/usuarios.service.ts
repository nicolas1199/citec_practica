import {
    Injectable,
    NotFoundException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { Usuarios } from '../../database/models/usuarios.model';
import {
    CrearUsuariosDto,
    ActualizarUsuariosDto,
    ObtenerPorIdUsuariosDto,
    EliminarUsuariosDto,
    IniciarSesionDto,
} from '../dtos/usuarios.dto';
import { BaseServices } from '../../common/base/base-services.class';
import { ESTADOS } from '../../common/constants/estados.constants';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService extends BaseServices {
    async crear(usuario: CrearUsuariosDto): Promise<Usuarios> {
        const existeUsuario = await Usuarios.findOne({
            where: { email: usuario.email },
        });

        if (existeUsuario) {
            throw new ConflictException(['Ya existe un usuario con ese email']);
        }

        const usuarioCreado = await Usuarios.create({
            ...usuario,
        });

        return usuarioCreado;
    }

    async obtenerTodos(): Promise<Usuarios[]> {
        const usuarios = await Usuarios.findAll({
            where: { estado: ESTADOS.OPCION_1 },
        });
        return usuarios;
    }

    async obtenerPorId(
        clavePrimaria: ObtenerPorIdUsuariosDto,
    ): Promise<Usuarios> {
        const usuario = await Usuarios.findByPk(clavePrimaria.email);

        if (!usuario) {
            throw new NotFoundException([
                `Usuario con email ${clavePrimaria.email} no encontrado`,
            ]);
        }

        return usuario;
    }

    async obtenerTodosEliminados(): Promise<Usuarios[]> {
        const usuarios = await Usuarios.findAll({
            where: { estado: ESTADOS.OPCION_2 },
        });
        return usuarios;
    }

    async actualizar(usuario: ActualizarUsuariosDto): Promise<Usuarios> {
        const usuarioExistente = await Usuarios.findByPk(usuario.email);
        const usuarioExistenteNuevo = await Usuarios.findByPk(
            usuario.nuevo_email,
        );

        if (!usuarioExistente) {
            throw new NotFoundException([
                `Usuario con el email ${usuario.email} no encontrado`,
            ]);
        }

        if (usuarioExistenteNuevo && usuario.email !== usuario.nuevo_email) {
            throw new ConflictException([
                `Ya existe un usuario con el email ${usuario.nuevo_email}`,
            ]);
        }

        const filasAfectadas = await Usuarios.update(
            {
                email: usuario.nuevo_email,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                contraseña: usuario.contraseña,
                nombre_tipos: usuario.nombre_tipos,
            },
            { where: { email: usuario.email } },
        );

        const usuarioActualizado = await Usuarios.findByPk(usuario.nuevo_email);

        return usuarioActualizado;
    }

    async eliminar(clavePrimaria: EliminarUsuariosDto): Promise<Usuarios> {
        const usuario = await Usuarios.findByPk(clavePrimaria.email);

        if (!usuario) {
            throw new NotFoundException([
                `Usuario con email ${clavePrimaria.email} no encontrado`,
            ]);
        }

        const filasAfectadas = await Usuarios.update(
            { estado: ESTADOS.OPCION_2 },
            { where: { email: clavePrimaria.email } },
        );

        const usuarioEliminado = await Usuarios.findByPk(clavePrimaria.email);

        return usuarioEliminado;
    }

    async iniciarSesion(datos: IniciarSesionDto): Promise<Usuarios> {
        const usuario = await Usuarios.findOne({
            where: { email: datos.email },
        });

        //Si el usuario no existe
        if (!usuario) {
            throw new ForbiddenException(['Correo o contraseña incorrectas']);
        }

        const contraseñaEncriptada = usuario.contraseña;

        //Comparar contraseñas
        const contraseñaValida = await bcrypt.compare(
            datos.contraseña,
            contraseñaEncriptada,
        );

        if (!contraseñaValida) {
            throw new ForbiddenException(['Correo o contraseña incorrectas']);
        }

        return usuario;
    }
}
