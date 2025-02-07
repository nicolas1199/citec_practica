import React, { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../components/AuthDataContext';
import { ENDPOINTS } from '../../common/constants/urls.constants';

interface LoginFormValues {
    email: string;
    contraseña: string;
}

const Login: React.FC = () => {
    /*
    @brief 
    Hook que agrega estado al componente, se utiliza para manejar los parametros de incio de sesion
    */
    const [values, setValues] = useState<LoginFormValues>({
        email: '',
        contraseña: '',
    });

    /*
    @Brief
    Hook encargado del manejo de errores en la funcion handleSubmit
    */
    const [error, setError] = useState<string | null>(null);

    /*
    @brief
    Componente utilizado para navegar entre paginas (componentes)
    */
    const navigate = useNavigate();

    /*
    @brief
    e: ChangeEvent<HTMLInputElement es una funcion encargada de manejar los cambios de un input
    seValues: Se encarga de actualizar el esatdo de los datos
    ...values: copia las propiedades del objeto seleccionado
    e.target.name: Es el campo de entrada que provoca el evento, ej: escribir el email
    e.target.value: Valor actual del campo de entrada que ha sido modificado 
     Captura y guarda las creedenciales de incio de sesión escritas por el usuario
    */
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    /*
    @brief
    e: FormEvent<HTMLFormElement: Define el tipo de evento como uno de formulario
    e.preventDefault(): Evita que la pagina se recarge al enviar el formulario
    axios.post: Se realiza la comunicaión con el backend a traves de su url y enviando los valores(values)
    response == true: Se inicio sesion de manera existosa
    response == false: ocurrio un error al iniciar sesion
    catch: Maneja el error ocurrido y lo imprime en consola
     Envia las creedenciales de incio de sesion al backend
    */
    const { login } = useData();
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios
            .post(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.AUTENTICACION.INICIAR}`,
                values,
            )
            .then((response) => {
                login(
                    response.data.token,
                    response.data.nombre_tipos,
                    response.data.email,
                    response.data.nombre,
                    response.data.apellido,
                );
                navigate('/dashboard');
            })
            .catch((err) => {
                console.error(err);
                setError('Error en la conexión con el servidor');
            });
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 h-screen">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Inicia sesión en tu cuenta
                        </h1>
                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Tú email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                              focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="nombre@gmail.com"
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="contraseña"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="contraseña"
                                        id="contraseña"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                                  focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        {showPassword ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}
                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none 
                            focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Iniciar sesión
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;