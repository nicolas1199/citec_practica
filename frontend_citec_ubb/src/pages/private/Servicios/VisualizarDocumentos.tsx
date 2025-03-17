import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useData } from '../../../components/AuthDataContext';
import ResponseMessage from '../../../components/ResponseMessage';
import { ENDPOINTS } from '../../../common/constants/urls.constants';

interface Documento {
    numero: number;
    nombre: string;
    ejecutor: string;
    cliente: string;
    area_documento: string;
    fecha_inicio: string;
    fecha_finalizacion: string;
    validez_documento: string;
    pdf_path: string;
    tipo_servicio: string;
    empresa_rut?: string;
}

const VisualizarDocumentos: React.FC = () => {
    const { token } = useData();
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterArea, setFilterArea] = useState<string>('');
    const [filterServicio, setFilterServicio] = useState<string>('');

    useEffect(() => {
        fetchDocumentos();
    }, [token]);

    const fetchDocumentos = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.DOCUMENTOS.OBTENER_TODOS}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            setDocumentos(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener documentos:', error);
            ResponseMessage.show('Error al cargar los documentos');
            setLoading(false);
        }
    };

    const handleDownloadPDF = (id: number, fileName: string) => {
        axios({
            url: `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.DOCUMENTOS.OBTENER_PDF_POR_ID}/${id}`,
            method: 'GET',
            responseType: 'blob',
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    fileName || `documento-${id}.pdf`,
                );
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                link.remove();
            })
            .catch((error) => {
                console.error('Error al descargar el PDF:', error);
                ResponseMessage.show('Error al descargar el PDF');
            });
    };

    // Filtrar documentos según los criterios de búsqueda
    const filteredDocumentos = documentos.filter((doc) => {
        const matchesSearch =
            doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.numero.toString().includes(searchTerm);

        const matchesArea = !filterArea || doc.area_documento === filterArea;
        const matchesServicio =
            !filterServicio || doc.tipo_servicio === filterServicio;

        return matchesSearch && matchesArea && matchesServicio;
    });

    // Obtener valores únicos para los filtros de dropdown
    const uniqueAreas = [
        ...new Set(documentos.map((doc) => doc.area_documento)),
    ];
    const uniqueServicios = [
        ...new Set(documentos.map((doc) => doc.tipo_servicio).filter(Boolean)),
    ];

    // Formatear fecha para mostrar
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL');
    };

    return (
        <div className="p-6 w-10/12 mx-auto bg-white shadow-md rounded-md my-10">
            <h1 className="text-2xl font-bold mb-6">Visualizar Documentos</h1>

            {/* Barra de búsqueda y filtros */}
            <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, cliente o número..."
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="w-48">
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={filterArea}
                        onChange={(e) => setFilterArea(e.target.value)}
                    >
                        <option value="">Todas las áreas</option>
                        {uniqueAreas.map((area) => (
                            <option key={area} value={area}>
                                {area}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-48">
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={filterServicio}
                        onChange={(e) => setFilterServicio(e.target.value)}
                    >
                        <option value="">Todos los servicios</option>
                        {uniqueServicios.map((servicio) => (
                            <option key={servicio} value={servicio}>
                                {servicio === 'AA_MAQUINARIA'
                                    ? 'AA Maquinaria'
                                    : servicio === 'AA_ESTRUCTURAL'
                                      ? 'AA Estructural'
                                      : servicio === 'EC'
                                        ? 'Ensayo de Compresión'
                                        : servicio}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={fetchDocumentos}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Actualizar
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-3 text-gray-600">Cargando documentos...</p>
                </div>
            ) : (
                <>
                    {filteredDocumentos.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-2 px-4 border-b">
                                            N°
                                        </th>
                                        <th className="py-2 px-4 border-b">
                                            Nombre
                                        </th>
                                        <th className="py-2 px-4 border-b">
                                            Cliente
                                        </th>
                                        <th className="py-2 px-4 border-b">
                                            Área
                                        </th>
                                        <th className="py-2 px-4 border-b">
                                            Tipo
                                        </th>
                                        <th className="py-2 px-4 border-b">
                                            Fecha
                                        </th>
                                        <th className="py-2 px-4 border-b">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDocumentos.map((documento) => (
                                        <tr
                                            key={documento.numero}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="py-2 px-4 border-b text-center">
                                                {documento.numero}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {documento.nombre}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {documento.cliente}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {documento.area_documento}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {documento.tipo_servicio ===
                                                'AA_MAQUINARIA'
                                                    ? 'AA Maquinaria'
                                                    : documento.tipo_servicio ===
                                                        'AA_ESTRUCTURAL'
                                                      ? 'AA Estructural'
                                                      : documento.tipo_servicio ===
                                                          'EC'
                                                        ? 'Ensayo de Compresión'
                                                        : documento.tipo_servicio ||
                                                          '-'}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {formatDate(
                                                    documento.fecha_finalizacion,
                                                )}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleDownloadPDF(
                                                                documento.numero,
                                                                documento.pdf_path,
                                                            )
                                                        }
                                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                        disabled={
                                                            !documento.pdf_path
                                                        }
                                                    >
                                                        Descargar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10 border rounded-md bg-gray-50">
                            <p className="text-gray-600">
                                No se encontraron documentos que coincidan con
                                los criterios de búsqueda.
                            </p>
                        </div>
                    )}

                    <div className="mt-4 text-sm text-gray-600">
                        Total de documentos: {filteredDocumentos.length}
                    </div>
                </>
            )}
        </div>
    );
};

export default VisualizarDocumentos;
