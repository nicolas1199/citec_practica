import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { Ensayo, CrearEnsayo } from '../../../components/Utils/interfaces';
import { ENDPOINTS } from "../../../common/constants/urls.constants";
import { useData } from '../../../components/AuthDataContext';
import ResponseMessage from '../../../components/ResponseMessage';

const CrearEnsayo: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useData();
    const [ensayo, setEnsayo] = useState<Ensayo[]>([]);
    const [formData, setFormData] = useState<CrearEnsayo>({
        nombre: '',
        id_servicio: 0,
    });
    

    useEffect(() => {
        const fetchEnsayos = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.ENSAYOS.OBTENER_TODOS}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setEnsayo(response.data);
            } catch (error) {
                console.error('Error al obtener los ensayos:', error);
                ResponseMessage.show('Error al cargar los ensayos');
            }
        };

        fetchEnsayos();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            nombre: String(formData.nombre),
            id_servicio: Number(formData.id_servicio)
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.ENSAYOS.CREAR}`,
                formattedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                console.log('Success:', response.data);
                ResponseMessage.show('Ensayo Creado exitosamente');
                navigate('/dashboard/ensayos');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    data: formattedData
                });
            }
        }
    };

    return (
        <div className="p-6 w-10/12 mx-auto bg-white shadow-md rounded-md my-10">
            <h1 className="text-2xl font-bold mb-6">Crear Ensayo</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            type="string"
                            name="Nombre"
                            value={formData.nombre}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Id del Servicio
                        </label>
                        <select
                            name="Id del servicio"
                            value={formData.id_servicio}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        >
                            <option value="NO">No</option>
                            <option value="SI">Sí</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/ensayos')}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Crear Ensayo
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearEnsayo;
