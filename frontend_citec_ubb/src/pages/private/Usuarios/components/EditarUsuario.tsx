import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ResponseMessage from '../../../../components/ResponseMessage';
import { ENDPOINTS } from '../../../../common/constants/urls.constants';
import { useData } from '../../../../components/AuthDataContext';
import { ActualizarUsuarioDto } from '../dtos/usuarios.dto';
import { useNavigate } from "react-router-dom";
// interface ValoresUsuario {
//   email: string;
//   nuevo_email: string;
//   nombre: string;
//   apellido: string;
//   contraseña: string;
//   nombre_tipo: string;
// }

function EditarUsuario() {
    const [values, setValues] = useState<ActualizarUsuarioDto>({
        email: '',
        nombre: '',
        apellido: '',
        contraseña: '',
        nombre_tipos: '',
        nuevo_email: '',
    });
    const [Usuarios, setUsuarios] = useState<string[]>([]);
    const [locks, setLocks] = useState({
        nombre: true,
        apellido: true,
        nuevo_email: true,
        contraseña: true,
        repetirContraseña: true,
    });

    const navigate = useNavigate();

    const [repetirContraseña, setRepetirContraseña] = useState('');

    const { email } = useParams(); // Email del usuario que se edita

    useEffect(() => {
        // Cargar la información del usuario
        axios
            .get(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.USUARIOS.OBTENER_POR_ID}/${email}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((response) => {
                const data = response.data;
                setValues({
                    email: email!,
                    nombre: data.nombre,
                    apellido: data.apellido,
                    contraseña: '', // No se muestra la contraseña
                    nombre_tipos: data.nombre_tipos,
                    nuevo_email: email!,
                });
            })
            .catch((error) => {
                console.error('Error al obtener los datos del usuario:', error);
            });

        // Cargar los tipos de usuario
        axios
            .get(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.TIPOSUSUARIO.OBTENER_TODOS}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((response) => {
                const data = response.data;
                if (Array.isArray(data)) {
                    const tipoUsuarios = data.map(
                        (element: any) => element.nombre,
                    );
                    setUsuarios(tipoUsuarios);
                } else {
                    console.error('Respuesta inesperada: no es un array');
                }
            })
            .catch((error) => {
                console.error('Error al obtener los tipos de usuario:', error);
            });
    }, [email]);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const { token } = useData();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(values);
        if (repetirContraseña !== values.contraseña) {
            ResponseMessage.show(`Las contraseñas deben ser iguales`);
            return;
        }
        axios
            .put(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.USUARIOS.ACTUALIZAR}`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then(() => {
                navigate('/dashboard/usuarios');
            })
            .catch((error) => {
                console.error(error);
                if (error.name === 'AxiosError') {
                    ResponseMessage.show(
                        `${error.response.data.errors[0].msg}, valor: ${error.response.data.errors[0].value}`,
                    );
                }
            });
    };

    const toggleLock = (field: keyof typeof locks) => {
        setLocks((prevLocks) => ({
            ...prevLocks,
            [field]: !prevLocks[field],
        }));
    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Editar usuario <br /> "{values.nombre}{' '}
                            {values.apellido}"
                        </h1>

                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleSubmit}
                        >
                            <div className="flex items-center">
                                <label
                                    htmlFor="nombre"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Nombre
                                </label>
                                <button
                                    type="button"
                                    onClick={() => toggleLock('nombre')}
                                    className="ml-2 text-gray-500"
                                >
                                    {locks.nombre ? '🔒' : '🔓'}
                                </button>
                            </div>
                            <input
                                type="text"
                                name="nombre"
                                id="nombre"
                                className={`w-full px-4 py-2 border border-gray-300 rounded-md transition ${
                                    locks.nombre ? 'bg-gray-200' : 'bg-white'
                                }`}
                                value={values.nombre}
                                onChange={handleInputChange}
                                disabled={locks.nombre}
                            />

                            <div className="flex items-center">
                                <label
                                    htmlFor="apellido"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Apellido
                                </label>
                                <button
                                    type="button"
                                    onClick={() => toggleLock('apellido')}
                                    className="ml-2 text-gray-500"
                                >
                                    {locks.apellido ? '🔒' : '🔓'}
                                </button>
                            </div>
                            <input
                                type="text"
                                name="apellido"
                                id="apellido"
                                className={`w-full px-4 py-2 border border-gray-300 rounded-md transition ${
                                    locks.apellido ? 'bg-gray-200' : 'bg-white'
                                }`}
                                value={values.apellido}
                                onChange={handleInputChange}
                                disabled={locks.apellido}
                            />

                            <div className="flex items-center">
                                <label
                                    htmlFor="nuevo_email"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Nuevo email
                                </label>
                                <button
                                    type="button"
                                    onClick={() => toggleLock('nuevo_email')}
                                    className="ml-2 text-gray-500"
                                >
                                    {locks.nuevo_email ? '🔒' : '🔓'}
                                </button>
                            </div>
                            <input
                                type="email"
                                name="nuevo_email"
                                id="nuevo_email"
                                className={`w-full px-4 py-2 border border-gray-300 rounded-md transition ${
                                    locks.nuevo_email
                                        ? 'bg-gray-200'
                                        : 'bg-white'
                                }`}
                                value={values.nuevo_email}
                                onChange={handleInputChange}
                                disabled={locks.nuevo_email}
                            />

                            <div className="flex items-center">
                                <label
                                    htmlFor="contraseña"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Nueva Contraseña
                                </label>
                                <button
                                    type="button"
                                    onClick={() => toggleLock('contraseña')}
                                    className="ml-2 text-gray-500"
                                >
                                    {locks.contraseña ? '🔒' : '🔓'}
                                </button>
                            </div>
                            <input
                                type="password"
                                name="contraseña"
                                id="contraseña"
                                className={`w-full px-4 py-2 border border-gray-300 rounded-md transition ${
                                    locks.contraseña
                                        ? 'bg-gray-200'
                                        : 'bg-white'
                                }`}
                                placeholder="••••••••"
                                onChange={handleInputChange}
                                disabled={locks.contraseña}
                            />

                            <div className="flex items-center">
                                <label
                                    htmlFor="repetirContraseña"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Repetir contraseña
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        toggleLock('repetirContraseña')
                                    }
                                    className="ml-2 text-gray-500"
                                >
                                    {locks.repetirContraseña ? '🔒' : '🔓'}
                                </button>
                            </div>
                            <input
                                type="password"
                                name="repetirContraseña"
                                id="repetirContraseña"
                                className={`w-full px-4 py-2 border border-gray-300 rounded-md transition ${
                                    locks.repetirContraseña
                                        ? 'bg-gray-200'
                                        : 'bg-white'
                                }`}
                                placeholder="••••••••"
                                onChange={(e) =>
                                    setRepetirContraseña(e.target.value)
                                }
                                disabled={locks.repetirContraseña}
                            />
                            <label
                                htmlFor="nombre_tipos"
                                className="block text-sm font-medium text-gray-900"
                            >
                                Tipo de Usuario
                            </label>
                            <select
                                name="nombre_tipos"
                                id="nombre_tipos"
                                value={values.nombre_tipos}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            >
                                {Usuarios.map((tipos) => (
                                    <option key={tipos} value={tipos}>
                                        {tipos}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Guardar cambios
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EditarUsuario;
