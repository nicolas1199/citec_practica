import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { CrearEnsayo } from '../../../components/Utils/interfaces';
import { ENDPOINTS } from "../../../common/constants/urls.constants";
import { useData } from '../../../components/AuthDataContext';
import ResponseMessage from '../../../components/ResponseMessage';

const CrearEnsayo: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useData();
    
    const [formData, setFormData] = useState<CrearEnsayo>({
        nombre_ensayo: '', 
        tipo_servicio_id: 0, // ID del servicio
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.name === "tipo_servicio_id"
                ? Number(e.target.value) || 0  // Asegura que sea un número
                : e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.ENSAYOS.CREAR}`,
                formData,
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
                    data: formData
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
                            Nombre del Ensayo
                        </label>
                        <input
                            type="text"
                            name="nombre_ensayo"  // <-- Debe coincidir con `CrearEnsayo`
                            value={formData.nombre_ensayo}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            ID del Servicio
                        </label>
                        <input
                            type="number"
                            name="tipo_servicio_id"  // <-- Debe coincidir con `CrearEnsayo`
                            value={formData.tipo_servicio_id}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                            min={1} // Evita números negativos o cero
                        />
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
