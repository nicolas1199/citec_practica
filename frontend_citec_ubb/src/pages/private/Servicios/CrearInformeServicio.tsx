import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponseMessage from '../../../components/ResponseMessage';
import { useData } from '../../../components/AuthDataContext';
import { Empresa } from '../../../components/Utils/interfaces';

import { ENDPOINTS } from '../../../common/constants/urls.constants';
import ServicioAA from './components/ServicioAA';
import ServicioEC from './components/ServicioEC';

const CrearInformeServicio: React.FC = () => {
    const { token } = useData();
    const [empresas, setEmpresas] = useState<Empresa[]>([]);

    const initialInformeState = {
        // Campos comunes
        id_servicio: '',
        fecha_informe: '',
        rut_receptor: '',
        fecha_inicio: '',
        fecha_termino: '',

        // Campos específicos de AA
        antecedentes_AA: '',
        objetivo_ensayo_AA: '',
        identificacion_producto_AA: '',
        metodos_equipos: '',
        condiciones_ensayo_AA: '',
        definiciones: '',
        resultados_AA: '',
        conclusiones: '',
        elementos_verificacion: '',
        observaciones_AA: '',

        // Campos específicos de EC
        antecedentes_EC: '',
        objetivo_ensayo_EC: '',
        identificacion_producto_EC: '',
        procedencia_producto: '',
        norma_aplicada: '',
        metodologia_ensayo: '',
        condiciones_ensayo_EC: '',
        fecha_ensayo: '',
        operador_equipamiento: '',
        resultados_EC: '',
        comentarios: '',
        observaciones_EC: '',
    };

    const [informe, setInforme] = useState(initialInformeState);

    const clearLocalStorageDrafts = () => {
        const storageKeys = [
            // AA
            'editor-draft-antecedentes-AA',
            'editor-draft-objetivo_ensayo-AA',
            'editor-draft-identificacion_producto-AA',
            'editor-draft-metodos_equipos',
            'editor-draft-condiciones_ensayo-AA',
            'editor-draft-definiciones',
            'editor-draft-resultados-AA',
            'editor-draft-conclusiones',
            'editor-draft-elementos_verificacion',
            'editor-draft-observaciones-AA',

            // EC
            'editor-draft-antecedentes-EC',
            'editor-draft-objetivo_ensayo-EC',
            'editor-draft-identificacion_producto-EC',
            'editor-draft-procedencia_producto',
            'editor-draft-norma_aplicada',
            'editor-draft-metodologia_ensayo',
            'editor-draft-condiciones_ensayo-EC',
            'editor-draft-fecha_ensayo',
            'editor-draft-operador_equipamiento',
            'editor-draft-resultados-EC',
            'editor-draft-comentarios',
            'editor-draft-observaciones-EC',
        ];

        storageKeys.forEach((key) => localStorage.removeItem(key));
    };

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.EMPRESAS.OBTENER_TODOS}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                setEmpresas(response.data);
            } catch (error) {
                console.error('Error al obtener las empresas:', error);
                ResponseMessage.show('Error al cargar las empresas');
            }
        };

        fetchEmpresas();
    }, [token]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setInforme({
            ...informe,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (!informe.id_servicio) {
                throw new Error('Por favor, seleccione un servicio');
            }

            console.log('Datos del formulario:', informe);

            ResponseMessage.show('Informe creado exitosamente');

            clearLocalStorageDrafts();
            setInforme(initialInformeState);
        } catch (error) {
            console.error('Error al crear el informe:', error);
            ResponseMessage.show('Error al crear el informe');
        }
    };

    const servicios = [
        { id: 1, nombre: 'AA' },
        { id: 2, nombre: 'EC' },
    ];

    const renderServicioForm = () => {
        switch (informe.id_servicio) {
            case '1':
                return <ServicioAA informe={informe} setInforme={setInforme} />;
            case '2':
                return <ServicioEC informe={informe} setInforme={setInforme} />;
            default:
                return (
                    <div className="text-center py-4">
                        Por favor, seleccione un área de servicio para
                        continuar.
                    </div>
                );
        }
    };

    return (
        <form
            className="p-6 w-10/12 mx-auto bg-white shadow-md rounded-md my-10"
            onSubmit={handleSubmit}
        >
            <h1 className="text-2xl font-bold mb-4">Crear Informe de Ensayo</h1>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Area de Servicio
                    </label>

                    <select
                        name="id_servicio"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm sm:leading-5"
                        onChange={handleInputChange}
                        value={informe.id_servicio}
                    >
                        <option value="">Seleccione un servicio</option>
                        {servicios.map((servicio) => (
                            <option key={servicio.id} value={servicio.id}>
                                {servicio.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Fecha del Informe
                    </label>

                    <input
                        type="date"
                        name="fecha_informe"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm sm:leading-5"
                        onChange={handleInputChange}
                        value={informe.fecha_informe}
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Empresa
                    </label>
                    <select
                        name="rut_receptor"
                        className="w-100 mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm sm:leading-5"
                        onChange={handleInputChange}
                        value={informe.rut_receptor}
                    >
                        <option value="">Seleccione una empresa</option>
                        {empresas.map((empresa) => (
                            <option key={empresa.rut} value={empresa.rut}>
                                {empresa.razon_social}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Tipo de Servicio
                    </label>

                    <select
                        name="tipo_servicio"
                        className="w-100 mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm sm:leading-5"
                        onChange={handleInputChange}
                    >
                        <option value="">Seleccione un tipo de servicio</option>
                        <option value="1">Ensayo</option>
                        <option value="2">Calibración</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Tipo de Ensayo
                    </label>

                    <select
                        name="estado"
                        className="w-100 mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm sm:leading-5"
                        onChange={handleInputChange}
                    >
                        <option value="">Seleccione un tipo de ensayo</option>
                        <option value="1">Ensayo 1</option>
                        <option value="2">Ensayo 2</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Fecha de Inicio
                    </label>

                    <input
                        type="date"
                        name="fecha_inicio"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm sm:leading-5"
                        onChange={handleInputChange}
                        value={informe.fecha_inicio}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Fecha de Termino
                    </label>
                    <input
                        type="date"
                        name="fecha_termino"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm sm:leading-5"
                        onChange={handleInputChange}
                        value={informe.fecha_termino}
                    />
                </div>
            </div>

            {renderServicioForm()}

            <button
                type="submit"
                className="bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                disabled={!informe.id_servicio}
            >
                Crear Informe
            </button>
        </form>
    );
};

export default CrearInformeServicio;
