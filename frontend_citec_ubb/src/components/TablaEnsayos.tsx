
import { useEffect, useState } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import { ENDPOINTS } from "../common/constants/urls.constants";
import { Ensayo } from '../components/Utils/interfaces';
import ResponseMessage from './ResponseMessage';
import { useData } from './AuthDataContext';

const columnHelper = createColumnHelper<Ensayo>();

const columns = (handleOpenDetails: (row: Ensayo) => void) => [
    columnHelper.accessor('id', {
        header: () => 'ID Ensayo',
        cell: (info) => info.getValue() ?? 'N/A',
    }),
    columnHelper.accessor('nombre', {
        header: () => 'Nombre del Ensayo',
        cell: (info) => info.getValue() ?? 'N/A',
    }),
    columnHelper.accessor('id_servicio', {
        header: () => 'ID Servicio',
        cell: (info) => info.getValue() ?? 'N/A',
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

const TablaEnsayos = () => {
    const [ensayos, setEnsayos] = useState<Ensayo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useData();

    const fetchEnsayos = async () => {
        console.log('Token:', token); // Verifica si el token está siendo obtenido correctamente
        console.log('URL de la API:', `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.ENSAYOS.OBTENER_TODOS}`); // Verifica la URL que se está construyendo

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.ENSAYOS.OBTENER_TODOS}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('Datos obtenidos:', response.data); // Verifica lo que está retornando la API
            setEnsayos(response.data || []);
        } catch (error) {
            console.error('Error al cargar los ensayos:', error); // Agrega un log más detallado del error
            ResponseMessage.show('Error al cargar los ensayos');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnsayos();
    }, []);

    const handleOpenDetails = (ensayo: Ensayo) => {
        console.log('Detalles del ensayo:', ensayo);
    };

    const tabla = useReactTable({
        data: ensayos,
        columns: columns(handleOpenDetails),
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="container mx-auto w-11/12 my-10">
            <h2 className="text-xl font-bold mb-4">Lista de Ensayos</h2>
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-4">Cargando ensayos...</div>
                ) : ensayos.length === 0 ? (
                    <div className="text-center py-4">No hay ensayos disponibles</div>
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                            {tabla.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="px-4 py-2 text-left">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {tabla.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="border-t hover:bg-gray-100 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TablaEnsayos;
