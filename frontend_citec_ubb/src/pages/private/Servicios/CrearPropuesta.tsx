import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Empresa, CrearPropuestasDeServiciosDto } from '../../../components/Utils/interfaces';
import { ENDPOINTS } from '../../../common/constants/urls.constants';
import { useData } from '../../../components/AuthDataContext';
import ResponseMessage from '../../../components/ResponseMessage';

const CrearPropuesta: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useData();
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [formData, setFormData] = useState<CrearPropuestasDeServiciosDto>({
        año: new Date().getFullYear(),
        pago: 0,
        fecha: new Date().toISOString().split('T')[0],
        rut_receptor: '',
        sub_servicios: [],
        adjudicado: 'NO'
    });
    

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.EMPRESAS.OBTENER_TODOS}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setEmpresas(response.data);
            } catch (error) {
                console.error('Error al obtener las empresas:', error);
                ResponseMessage.show('Error al cargar las empresas');
            }
        };

        fetchEmpresas();
    }, [token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'pago' || name === 'año' ? Number(value) : value
        }));
    };

    // Format the RUT as XX.XXX.XXX-Y
    const formatRut = (rut: string) => {
        const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
        if (cleanRut.length < 2) return '';
        const body = cleanRut.slice(0, -1).split('').reverse();
        const dv = cleanRut.slice(-1);

        // Add dots every three digits
        const formattedBody = body.reduce((acc, curr, i) => {
            if (i > 0 && i % 3 === 0) {
                return curr + '.' + acc;
            }
            return curr + acc;
        }, '');

        return `${formattedBody}-${dv}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            rut_receptor: formatRut(formData.rut_receptor), // Send as clean number without separators
            fecha: new Date(formData.fecha).toISOString().split('T')[0], // Format as YYYY-MM-DD
            año: Number(formData.año),
            pago: Number(formData.pago),
            sub_servicios: [], // Empty array if no sub_servicios
            adjudicado: formData.adjudicado || 'NO' // Ensure default value
        };

        console.log('Sending data with formatted RUT:', formattedData); // Debug log

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.PROPUESTAS_DE_SERVICIOS.CREAR}`,
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
                ResponseMessage.show('Propuesta creada exitosamente');
                navigate('/dashboard/propuestas');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    data: formattedData,
                    sentRut: formattedData.rut_receptor, // Debug the RUT being sent
                    rawRut: formData.rut_receptor
                });
                ResponseMessage.show(
                    error.response?.data?.message || 
                    `Error al crear la propuesta. RUT enviado: ${formattedData.rut_receptor}`
                );
            }
        }
    };

    return (
        <div className="p-6 w-10/12 mx-auto bg-white shadow-md rounded-md my-10">
            <h1 className="text-2xl font-bold mb-6">Crear Propuesta de Servicio</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Año
                        </label>
                        <input
                            type="number"
                            name="año"
                            value={formData.año}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Pago (UF)
                        </label>
                        <input
                            type="number"
                            name="pago"
                            value={formData.pago}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Fecha
                        </label>
                        <input
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Empresa
                        </label>
                        <select
                            name="rut_receptor"
                            value={formData.rut_receptor}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
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
                            Adjudicado
                        </label>
                        <select
                            name="adjudicado"
                            value={formData.adjudicado}
                            onChange={handleInputChange}
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
                        onClick={() => navigate('/dashboard/propuestas')}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Crear Propuesta
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearPropuesta;
