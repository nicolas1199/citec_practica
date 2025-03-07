import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponseMessage from '../../../components/ResponseMessage';
import { useData } from '../../../components/AuthDataContext';
import { Empresa } from '../../../components/Utils/interfaces';

import { ENDPOINTS } from '../../../common/constants/urls.constants';
import ServicioAA from './components/ServicioAA';
import ServicioEC from './components/ServicioEC';

const CrearInformeEnsayo: React.FC = () => {
    const { token } = useData();
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [aaTipoServicio, setAATipoServicio] = useState<
        'maquinaria' | 'estructural'
    >('maquinaria');

    // Estados de los campos de los formularios
    const initialCommonState = {
        id_servicio: '',
        fecha_informe: '',
        rut_receptor: '',
        fecha_inicio: '',
        fecha_termino: '',
    };

    // Estados de los campos del formulario de AA Maquinaria
    const initialAAMaquinariaState = {
        antecedentes: '',
        objetivo_ensayo: '',
        identificacion_producto: '',
        procedencia_producto: '',
        norma_aplicada: '',
        metodologia_ensayo: '',
        condiciones_ensayo: '',
        fecha_ensayo: '',
        operador_equipamiento: '',
        resultados: '',
        comentarios: '',
        observaciones: '',
    };

    // Estados de los campos del formulario de AA Estructural
    const initialAAEstructuralState = {
        antecedentes: '',
        objetivo_ensayo: '',
        identificacion_producto: '',
        metodos_equipos: '',
        condiciones_ensayo: '',
        definiciones: '',
        resultados: '',
        conclusiones: '',
        elementos_verificacion: '',
        observaciones: '',
    };

    // Estados de los campos del formulario de EC
    const initialECState = {
        antecedentes: '',
        materiales_caracteristicas: '',
        fecha_ensayo_detalle: '',
        dimensiones: '',
        normativa_utilizada: '',
        otros_datos: '',
        aplicacion_carga: '',
        resultados: '',
        modos_falla: '',
        conclusiones: '',
        observaciones: '',
    };

    const [commonFields, setCommonFields] = useState(initialCommonState);
    const [aaMaquinariaFields, setAAMaquinariaFields] = useState(
        initialAAMaquinariaState,
    );
    const [aaEstructuralFields, setAAEstructuralFields] = useState(
        initialAAEstructuralState,
    );
    const [ecFields, setECFields] = useState(initialECState);

    const clearLocalStorageDrafts = () => {
        const allKeys = Object.keys(localStorage);

        const draftKeys = allKeys.filter((key) =>
            key.startsWith('editor-draft-'),
        );

        draftKeys.forEach((key) => {
            localStorage.removeItem(key);
        });
    };

    const getActiveFields = () => {
        if (commonFields.id_servicio === '1') {
            if (aaTipoServicio === 'maquinaria') {
                return {
                    ...commonFields,
                    ...aaMaquinariaFields,
                    tipo_aa: 'maquinaria',
                };
            } else {
                return {
                    ...commonFields,
                    ...aaEstructuralFields,
                    tipo_aa: 'estructural',
                };
            }
        } else if (commonFields.id_servicio === '2') {
            return { ...commonFields, ...ecFields };
        }
        return commonFields;
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
        setCommonFields({
            ...commonFields,
            [e.target.name]: e.target.value,
        });

        if (
            e.target.name === 'aa_tipo' &&
            (e.target.value === 'maquinaria' ||
                e.target.value === 'estructural')
        ) {
            if (aaTipoServicio === 'maquinaria') {
                setAAMaquinariaFields(aaMaquinariaFields);
            } else {
                setAAEstructuralFields(aaEstructuralFields);
            }

            setAATipoServicio(e.target.value as 'maquinaria' | 'estructural');

            requestAnimationFrame(() => {
                console.log('Type changed to:', e.target.value);
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (!commonFields.id_servicio) {
                throw new Error('Por favor, seleccione un servicio');
            }

            const formData = getActiveFields();
            console.log('Datos del formulario:', formData);

            // Limpiar drafts de localStorage
            clearLocalStorageDrafts();

            // Reestablecer los campos a sus valores iniciales
            setCommonFields(initialCommonState);
            setAAMaquinariaFields(initialAAMaquinariaState);
            setAAEstructuralFields(initialAAEstructuralState);
            setECFields(initialECState);

            ResponseMessage.show('Informe creado exitosamente');
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
        switch (commonFields.id_servicio) {
            case '1':
                return (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Tipo de AA
                            </label>
                            <select
                                name="aa_tipo"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm sm:leading-5"
                                onChange={handleInputChange}
                                value={aaTipoServicio}
                            >
                                <option value="maquinaria">Maquinaria</option>
                                <option value="estructural">Estructural</option>
                            </select>
                        </div>
                        <ServicioAA
                            key={`aa-${aaTipoServicio}`}
                            informe={
                                aaTipoServicio === 'maquinaria'
                                    ? aaMaquinariaFields
                                    : aaEstructuralFields
                            }
                            setInforme={
                                aaTipoServicio === 'maquinaria'
                                    ? setAAMaquinariaFields
                                    : setAAEstructuralFields
                            }
                            tipoAA={aaTipoServicio}
                        />
                    </>
                );
            case '2':
                return (
                    <ServicioEC informe={ecFields} setInforme={setECFields} />
                );
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
                        value={commonFields.id_servicio}
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
                        value={commonFields.fecha_informe}
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
                        value={commonFields.rut_receptor}
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
                        value={commonFields.fecha_inicio}
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
                        value={commonFields.fecha_termino}
                    />
                </div>
            </div>

            {renderServicioForm()}

            <button
                type="submit"
                className="bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                disabled={!commonFields.id_servicio}
            >
                Crear Informe
            </button>
        </form>
    );
};

export default CrearInformeEnsayo;
