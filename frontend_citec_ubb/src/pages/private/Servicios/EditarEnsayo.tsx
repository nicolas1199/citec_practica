import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ResponseMessage from '../../../components/ResponseMessage';
import { ENDPOINTS } from '../../../common/constants/urls.constants';
import { ActualizarEnsayo, Ensayo } from '../../../components/Utils/interfaces';
import { useData } from '../../../components/AuthDataContext';

const EditarEnsayo: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useData();
    
    const [ensayo, setEnsayo] = useState<Ensayo | null>(null);
    const [formData, setFormData] = useState<ActualizarEnsayo>({
        id: Number(id),
        nombre: '',
        fecha: '',
        servicio: 0
    });

    useEffect(() => {
        const fetchEnsayo = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.ENSAYOS.OBTENER_POR_ID}/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data) {
                    setEnsayo(response.data);
                    setFormData({
                        id: Number(id),
                        nombre: response.data.nombre,
                        fecha: response.data.fecha,
                        servicio: response.data.servicio
                    });
                }
            } catch (error) {
                console.error('Error fetching ensayo:', error);
                ResponseMessage.show('Error al cargar el ensayo');
                navigate('/dashboard/ensayos');
            }
        };

        if (id) {
            fetchEnsayo();
        }
    }, [id, token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'servicio' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.ENSAYOS.ACTUALIZAR}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            ResponseMessage.show('Ensayo actualizado exitosamente');
            navigate('/dashboard/ensayos');
        } catch (error) {
            console.error('Error updating ensayo:', error);
            ResponseMessage.show('Error al actualizar el ensayo');
        }
    };

    if (!ensayo) {
        return <div>Cargando...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 w-10/12 mx-auto bg-white shadow-md rounded-md my-10">
            <h1 className="text-2xl font-bold mb-4">Editar Ensayo</h1>

            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block mb-2 font-bold">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-bold">
                        Fecha <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="fecha"
                        value={formData.fecha.split('T')[0]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-bold">
                        Servicio <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="servicio"
                        value={formData.servicio}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="button"
                    onClick={() => navigate('/dashboard/ensayos')}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Guardar Cambios
                </button>
            </div>
        </form>
    );
};

export default EditarEnsayo;
