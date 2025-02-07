import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import { ENDPOINTS } from '../common/constants/urls.constants';
import { PropuestaServicio } from './Utils/interfaces';
import ResponseMessage from './ResponseMessage';
import { useData } from './AuthDataContext';

const columnHelper = createColumnHelper<PropuestaServicio>();

const columns = (handleOpenDetails: (row: PropuestaServicio) => void) => [
    columnHelper.accessor('id', {
        header: () => 'ID Propuesta',
        cell: (info) => info.getValue() ?? 'N/A',
    }),
    columnHelper.accessor('fecha', {
        header: () => 'Fecha',
        cell: (info) => {
            const date = info.getValue();
            return date ? new Date(date).toLocaleDateString() : 'N/A';
        },
    }),
    columnHelper.accessor('año', {
        header: () => 'Año',
        cell: (info) => info.getValue() ?? 'N/A',
    }),
    columnHelper.accessor('pago', {
        header: () => 'Pago (UF)',
        cell: (info) => {
            const value = info.getValue();
            return typeof value === 'number' ? value.toFixed(2) : 'N/A';
        },
    }),
    columnHelper.accessor(row => row.empresa?.razon_social ?? 'N/A', {
        id: 'razon_social',
        header: () => 'Razón Social',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('empresa.rut', {
        header: () => 'RUT Empresa',
        cell: (info) => {
            const empresa = info.row.original.empresa;
            return empresa?.rut || 'N/A';
        },
    }),
    columnHelper.accessor('adjudicado', {
        header: () => 'Adjudica',
        cell: (info) => {
            const value = info.getValue();
            return value === 'SI' ? 'Sí' : value === 'NO' ? 'No' : 'N/A';
        },
    }),
    columnHelper.display({
        id: 'acciones',
        header: () => 'Acciones',
        cell: (props) => (
            <div className="flex gap-2">
                <button
                    onClick={() => handleOpenDetails(props.row.original)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                    Detalles
                </button>
            </div>
        ),
    }),
];

const TablaPropuestas = () => {
    const navigate = useNavigate();
    const [propuestas, setPropuestas] = useState<PropuestaServicio[]>([]);
    const [propuestasFiltradas, setPropuestasFiltradas] = useState<PropuestaServicio[]>([]);
    const [inputSearchValue, setInputSearchValue] = useState('');
    const [selectedPropuesta, setSelectedPropuesta] = useState<PropuestaServicio | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

     const { token } = useData();

    const fetchPropuestas = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.PROPUESTAS_DE_SERVICIOS.OBTENER_TODOS}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data) {
                // Validate and transform data to ensure required properties exist
                const propuestasData = Array.isArray(response.data) ? response.data.map(propuesta => ({
                    ...propuesta,
                    empresa: propuesta.empresa || {
                        razon_social: 'N/A',
                        rut: 'N/A',
                        email_factura: '',
                        direccion: '',
                        telefono: '',
                        contactos: []
                    }
                })) : [];
                
                setPropuestas(propuestasData);
                setPropuestasFiltradas(propuestasData);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Request details:', {
                    url: error.config?.url,
                    headers: error.config?.headers,
                    response: error.response?.data
                });
                ResponseMessage.show(error.response?.data?.message || 'Error al cargar los datos');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenDetails = (propuesta: PropuestaServicio) => {
        setSelectedPropuesta(propuesta);
        setShowPopup(true);
    };

    const handleEdit = (id: number) => {
        console.log('Navigating to:', `/dashboard/propuestas/editar/${id}`); // Debug line
        navigate(`/dashboard/propuestas/editar/${id}`);
        setShowPopup(false);
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.PROPUESTAS_DE_SERVICIOS.ELIMINAR}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            await fetchPropuestas();
            setShowPopup(false);
            ResponseMessage.show('Propuesta eliminada exitosamente');
        } catch (error) {
            ResponseMessage.show('Error al eliminar la propuesta');
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputSearchValue(e.target.value);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedPropuesta(null);
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchPropuestas();
            setIsLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const searchValue = inputSearchValue.toLowerCase();
            setPropuestasFiltradas(
                propuestas.filter((propuesta) => {
                    const razonSocial = propuesta.empresa?.razon_social?.toLowerCase() || '';
                    const rut = propuesta.empresa?.rut?.toLowerCase() || '';
                    const id = propuesta.id?.toString() || '';
                    const estado = propuesta.estado?.toLowerCase() || '';

                    return (
                        razonSocial.includes(searchValue) ||
                        rut.includes(searchValue) ||
                        id.includes(searchValue) ||
                        estado.includes(searchValue)
                    );
                }),
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [inputSearchValue, propuestas]);

    // Debug useEffect to monitor data
    useEffect(() => {
        console.log('Current propuestas:', propuestas);
        console.log('Filtered propuestas:', propuestasFiltradas);
    }, [propuestas, propuestasFiltradas]);

    const tabla = useReactTable({
        data: propuestasFiltradas,
        columns: columns(handleOpenDetails),
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="container mx-auto w-11/12 my-10">
            <div className="flex justify-between items-center mb-4">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => console.log('Crear nueva propuesta')}
                >
                    Crear
                </button>
                <form onSubmit={(e) => e.preventDefault()} className="flex">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={inputSearchValue}
                        onChange={handleSearchChange}
                        className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                    >
                        Buscar
                    </button>
                </form>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-4">
                        Cargando propuestas...
                    </div>
                ) : propuestasFiltradas.length === 0 ? (
                    <div className="text-center py-4">
                        No hay propuestas de servicios disponibles
                    </div>
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                            {tabla.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-2 text-left"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {tabla.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-t hover:bg-gray-100 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-2">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showPopup && selectedPropuesta && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-lg">
                        <h2 className="text-lg font-bold mb-4">Detalles de Propuesta</h2>
                        <p><strong>ID:</strong> {selectedPropuesta.id}</p>
                        <p><strong>Fecha:</strong> {new Date(selectedPropuesta.fecha).toLocaleDateString()}</p>
                        <p><strong>Año:</strong> {selectedPropuesta.año}</p>
                        <p><strong>Pago:</strong> {selectedPropuesta.pago} UF</p>
                        <p><strong>Estado:</strong> {selectedPropuesta.estado}</p>
                        <p><strong>Adjudicado:</strong> {selectedPropuesta.adjudicado}</p>
                        
                        <h3 className="font-bold mt-4">Datos de la Empresa</h3>
                        <p><strong>Razón Social:</strong> {selectedPropuesta.empresa?.razon_social || 'N/A'}</p>
                        <p><strong>RUT:</strong> {selectedPropuesta.empresa?.rut || 'N/A'}</p>
                        <p><strong>Email Factura:</strong> {selectedPropuesta.empresa?.email_factura || 'N/A'}</p>
                        <p><strong>Dirección:</strong> {selectedPropuesta.empresa?.direccion || 'N/A'}</p>
                        <p><strong>Teléfono:</strong> {selectedPropuesta.empresa?.telefono || 'N/A'}</p>

                        <h3 className="font-bold mt-4">Contactos</h3>
                        <ul className="list-disc list-inside">
                            {selectedPropuesta.empresa?.contactos?.map((contacto, index) => (
                                <li key={index}>
                                    {contacto.nombre} - {contacto.cargo} ({contacto.email})
                                </li>
                            )) || <li>No hay contactos disponibles</li>}
                        </ul>

                        <div className="mt-4 flex justify-between gap-2">
                            <button
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                onClick={() => handleEdit(selectedPropuesta.id)}
                            >
                                Editar
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={() => handleDelete(selectedPropuesta.id)}
                            >
                                Eliminar
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                onClick={() => setShowPopup(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TablaPropuestas;
