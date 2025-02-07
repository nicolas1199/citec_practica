import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import axios from 'axios';
//import { useNavigate } from "react-router-dom";
import ResponseMessage from '../../../../components/ResponseMessage';
import { CrearUsuariosDto } from '../dtos/usuarios.dto';
import { ENDPOINTS } from '../../../../common/constants/urls.constants';
import { useData } from '../../../../components/AuthDataContext';
import { useNavigate } from 'react-router-dom';

// interface ValoresUsuario {
//   email: string;
//   nombre: string;
//   apellido: string;
//   contraseña: string;
//   nombre_tipo: string;
// }

function CrearUsuario() {
    //const navigate = useNavigate();

    const [values, setValues] = useState<CrearUsuariosDto>({
        email: '',
        nombre: '',
        apellido: '',
        contraseña: '',
        nombre_tipos: '',
    });

    const [repetirContraseña, setRepetirContraseña] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const navigate = useNavigate();

    const { token } = useData();
    

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (repetirContraseña !== values.contraseña) {
            ResponseMessage.show(`Las contraseñas deben ser iguales`);
            return;
        }
        
        axios
            .post(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.USUARIOS.CREAR}`,
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
            .catch((err) => {
                console.error(err);
            });
    };

    const [Usuarios, setUsuarios] = useState<string[]>([]);

    useEffect(() => {
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
                console.error(error);
            });
    }, []);

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Crear usuario
                        </h1>
                        <form
                            className="space-y-4 md:space-y-6"
                            action="#"
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    id="nombre"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="nombre"
                                    required
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="lastname"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    name="apellido"
                                    id="apellido"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Apellido"
                                    required
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="usuario@gmail.com"
                                    required
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="type"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Tipo de usuario
                                </label>
                                <select
                                    name="nombre_tipos"
                                    id="nombre_tipos"
                                    onChange={handleSelectChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required
                                >
                                    <option value="">
                                        Seleccione el tipo de usuario
                                    </option>
                                    {Usuarios && Usuarios.length > 0 ? (
                                        Usuarios.map((usuario, key) => (
                                            <option key={key} value={usuario}>
                                                {usuario}
                                            </option>
                                        ))
                                    ) : (
                                        <option>
                                            No hay tipos de usuario disponibles
                                        </option>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    name="contraseña"
                                    id="contraseña"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 
                                    focus:border-primary-600 block w-full p-2.5"
                                    required
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Repetir contraseña
                                </label>
                                <input
                                    type="password"
                                    name="contraseña"
                                    id="contraseña"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 
                                    focus:border-primary-600 block w-full p-2.5"
                                    required
                                    onChange={(e) =>
                                        setRepetirContraseña(e.target.value)
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 
                                focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 
                                py-2.5 text-center"
                            >
                                Crear usuario
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CrearUsuario;
