import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ResponseMessage from '../../../components/ResponseMessage';
import { ENDPOINTS } from '../../../common/constants/urls.constants';
import { ActualizarPropuestasDeServiciosDto, PropuestaServicio } from '../../../components/Utils/interfaces';
import { useData } from '../../../components/AuthDataContext';

const EditarPropuesta: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useData();
    
    const [propuesta, setPropuesta] = useState<PropuestaServicio | null>(null);
    const [formData, setFormData] = useState<ActualizarPropuestasDeServiciosDto>({
        id: Number(id),
        año: 0,
        pago: 0,
        fecha: '',
        rut_receptor: '',
        sub_servicios: [],
        adjudicado: 'NO'
    });

    useEffect(() => {
        const fetchPropuesta = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.PROPUESTAS_DE_SERVICIOS.OBTENER_POR_ID}/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data) {
                    setPropuesta(response.data);
                    setFormData({
                        id: Number(id),
                        año: response.data.año,
                        pago: response.data.pago,
                        fecha: response.data.fecha,
                        rut_receptor: response.data.empresa.rut,
                        sub_servicios: [], // You'll need to handle this based on your data structure
                        adjudicado: response.data.adjudicado
                    });
                }
            } catch (error) {
                console.error('Error fetching propuesta:', error);
                ResponseMessage.show('Error al cargar la propuesta');
                navigate('/dashboard/propuestas');
            }
        };

        if (id) {
            fetchPropuesta();
        }
    }, [id, token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'año' || name === 'pago' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.PROPUESTAS_DE_SERVICIOS.ACTUALIZAR}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            ResponseMessage.show('Propuesta actualizada exitosamente');
            navigate('/dashboard/propuestas');
        } catch (error) {
            console.error('Error updating propuesta:', error);
            ResponseMessage.show('Error al actualizar la propuesta');
        }
    };

    if (!propuesta) {
        return <div>Cargando...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 w-10/12 mx-auto bg-white shadow-md rounded-md my-10">
            <h1 className="text-2xl font-bold mb-4">Editar Propuesta</h1>

            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block mb-2 font-bold">
                        Año <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="año"
                        value={formData.año}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-bold">
                        Pago (UF) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="pago"
                        value={formData.pago}
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
                        Adjudicado <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="adjudicado"
                        value={formData.adjudicado}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value="SI">Sí</option>
                        <option value="NO">No</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="button"
                    onClick={() => navigate('/dashboard/propuestas')}
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

export default EditarPropuesta;
