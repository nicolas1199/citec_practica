import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponseMessage from '../../../components/ResponseMessage';
import { useData } from '../../../components/AuthDataContext';
import { Empresa } from '../../../components/Utils/interfaces';

import { ENDPOINTS } from '../../../common/constants/urls.constants';
import ServicioAA from './components/ServicioAA';
import ServicioEC from './components/ServicioEC';

// Interfaz para las áreas de documentos
interface AreaDocumento {
    cod_area: string;
}

const CrearInformeEnsayo: React.FC = () => {
    const { token } = useData();
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [ensayos, setEnsayos] = useState<any[]>([]);
    const [areasDocumento, setAreasDocumento] = useState<AreaDocumento[]>([]);
    const [aaTipoServicio, setAATipoServicio] = useState<
        'maquinaria' | 'estructural'
    >('maquinaria');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedPdf, setGeneratedPdf] = useState<{
        fileName: string;
        filePath: string;
        documento?: any;
    } | null>(null);

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

    useEffect(() => {
        const fetchEnsayos = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.ENSAYOS.OBTENER_TODOS}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                setEnsayos(response.data);
            } catch (error) {
                console.error('Error al obtener los ensayos:', error);
                ResponseMessage.show('Error al cargar los ensayos');
            }
        };

        fetchEnsayos();
    }, [token]);

    // Nuevo efecto para cargar áreas de documento desde la API
    useEffect(() => {
        const fetchAreasDocumento = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.AREAS_DOCUMENTOS.OBTENER_TODOS}`,
                );
                setAreasDocumento(response.data);
            } catch (error) {
                console.error('Error al obtener áreas de documentos:', error);
                ResponseMessage.show('Error al cargar áreas de documentos');
            }
        };

        fetchAreasDocumento();
    }, []);

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
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!commonFields.id_servicio) {
                throw new Error('Por favor, seleccione un servicio');
            }

            const formData = getActiveFields();
            console.log('Datos del formulario:', formData);

            // Determinar el tipo de servicio para el backend
            let tipoServicio = '';
            if (commonFields.id_servicio === '1') {
                tipoServicio =
                    aaTipoServicio === 'maquinaria'
                        ? 'AA_MAQUINARIA'
                        : 'AA_ESTRUCTURAL';
            } else if (commonFields.id_servicio === '2') {
                tipoServicio = 'EC';
            }

            // Crear un título para el informe
            const empresaSeleccionada = empresas.find(
                (emp) => emp.rut === commonFields.rut_receptor,
            );
            const nombreEmpresa =
                empresaSeleccionada?.razon_social || 'Cliente';
            const fecha = commonFields.fecha_informe
                ? new Date(commonFields.fecha_informe).toLocaleDateString()
                : new Date().toLocaleDateString();

            const ensayoSeleccionado = ensayos.find(
                (ensayo) => ensayo.id.toString() === commonFields.id_servicio,
            );
            const nombreEnsayo = ensayoSeleccionado?.nombre || 'Ensayo';
            const titulo = `Informe de ${nombreEnsayo} - ${nombreEmpresa} - ${fecha}`;

            // Datos para crear/actualizar documento en la DB
            const documentoData = {
                nombre: titulo,
                ejecutor: 'CITEC UBB',
                cliente: empresaSeleccionada?.razon_social || '',
                direccion: empresaSeleccionada?.direccion || '',
                area_documento: commonFields.id_servicio === '1' ? 'AA' : 'EC',
                fecha_inicio: commonFields.fecha_inicio,
                fecha_finalizacion: commonFields.fecha_termino,
                empresa_rut: commonFields.rut_receptor,
            };

            // Enviar los datos al backend para generar el PDF
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.DOCUMENTOS.GENERAR_PDF}`,
                {
                    contenido: formData,
                    titulo: titulo,
                    tipoServicio: tipoServicio,
                    documentoData: documentoData,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            // Guardar la referencia al PDF generado
            setGeneratedPdf(response.data);

            // Limpiar drafts de localStorage
            clearLocalStorageDrafts();

            // Devolver a estado inicial
            setCommonFields(initialCommonState);
            setAAMaquinariaFields(initialAAMaquinariaState);
            setAAEstructuralFields(initialAAEstructuralState);
            setECFields(initialECState);

            ResponseMessage.show('Informe generado exitosamente');
        } catch (error) {
            console.error('Error al generar el informe:', error);
            ResponseMessage.show('Error al generar el informe');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownloadPdf = () => {
        if (!generatedPdf) return;

        fetch(
            `${import.meta.env.VITE_BACKEND_NESTJS_URL}/documentos/descargar-pdf/${generatedPdf.fileName}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = generatedPdf.fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            })
            .catch((error) => {
                console.error('Error al descargar el PDF:', error);
                ResponseMessage.show('Error al descargar el PDF');
            });
    };

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
                        {areasDocumento.map((area) => (
                            <option
                                key={area.cod_area}
                                value={area.cod_area === 'AA' ? '1' : '2'}
                            >
                                {area.cod_area}
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
                        name="ensayo"
                        className="w-100 mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm sm:leading-5"
                        onChange={handleInputChange}
                    >
                        <option value="">Seleccione un tipo de ensayo</option>
                        {ensayos.map((ensayo) => (
                            <option key={ensayo.id} value={ensayo.id}>
                                {ensayo.nombre}
                            </option>
                        ))}
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

            <div className="flex gap-4 mt-6">
                <button
                    type="submit"
                    className="bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                    disabled={!commonFields.id_servicio || isSubmitting}
                >
                    {isSubmitting ? 'Generando...' : 'Generar Informe'}
                </button>

                {generatedPdf && (
                    <>
                        <button
                            type="button"
                            onClick={handleDownloadPdf}
                            className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                        >
                            Ver/Descargar PDF
                        </button>
                        {generatedPdf.documento && (
                            <p className="text-sm text-gray-700 self-center">
                                Documento guardado con ID:{' '}
                                {generatedPdf.documento.numero}
                            </p>
                        )}
                    </>
                )}
            </div>

            {generatedPdf && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 font-medium">
                        ¡Informe generado correctamente!
                    </p>
                    <p className="text-sm text-green-700">
                        Haga clic en "Ver/Descargar PDF" para visualizar o
                        guardar el documento.
                    </p>
                </div>
            )}
        </form>
    );
};

export default CrearInformeEnsayo;
