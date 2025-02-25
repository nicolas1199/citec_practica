import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponseMessage from '../../../components/ResponseMessage';
import { useData } from '../../../components/AuthDataContext';
import { Empresa } from '../../../components/Utils/interfaces';

import { ENDPOINTS } from '../../../common/constants/urls.constants';
import CuadroTexto from '../../../components/CuadroTexto';

const CrearInformeServicio: React.FC = () => {
    const { token } = useData();
    const [empresas, setEmpresas] = useState<Empresa[]>([]);

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
    /*     useEffect(() => {
        const fetchInforme = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_NESTJS_URL}/servicios/${id_servicio}/informe`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                setInforme(response.data);
            } catch (error) {
                console.error('Error al obtener el informe:', error);
                ResponseMessage.show('Error al cargar el informe');
            }
        };

        fetchInforme();
    }, [id_servicio, token]); */

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
            console.log('Datos del formulario:', informe);
        } catch (error) {
            console.error('Error al crear el informe:', error);
            ResponseMessage.show('Error al crear el informe');
        }
    };

    const servicios = [
        { id: 1, nombre: 'AA' },
        { id: 2, nombre: 'EC' },
    ];

    const [informe, setInforme] = useState({
        id_servicio: '',
        fecha_informe: '',
        rut_receptor: '',
        observaciones: '',
    });

    return (
        <form
            className="p-6 w-10/12 mx-auto bg-white shadow-md rounded-md my-10"
            onSubmit={handleSubmit}
        >
            <h1 className="text-2xl font-bold mb-4">
                Crear Informe de Servicio
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Area de Servicio
                    </label>

                    <select
                        name="id_servicio"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text
                        sm:leading-5"
                        onChange={handleInputChange}
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
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text
                        sm:leading-5"
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Empresa
                    </label>
                    <select
                        name="rut_receptor"
                        className="w-100 mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text
                        sm:leading-5"
                        onChange={handleInputChange}
                    >
                        <option value="">Seleccione una empresa</option>
                        {empresas.map((empresa) => (
                            <option key={empresa.rut} value={empresa.rut}>
                                {empresa.razon_social}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">II Observaciones</h4>

                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev) => ({
                            ...prev,
                            observaciones: content,
                        }))
                    }
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
            >
                Crear Informe
            </button>
        </form>
    );
};

export default CrearInformeServicio;
