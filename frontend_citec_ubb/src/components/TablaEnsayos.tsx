
import { useEffect, useState } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS } from "../common/constants/urls.constants";
import { Ensayo } from '../components/Utils/interfaces';
import ResponseMessage from './ResponseMessage';
import { useData } from './AuthDataContext';

const columnHelper = createColumnHelper<Ensayo>();

const TablaEnsayos = () => {
    const navigate = useNavigate();
    const [ensayos, setEnsayos] = useState<Ensayo[]>([]);
    const [selectedEnsayo, setSelectedEnsayo] = useState<Ensayo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useData();

    const fetchEnsayos = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.ENSAYOS.OBTENER_TODOS}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setEnsayos(response.data || []);
        } catch (error) {
            ResponseMessage.show('Error al cargar los ensayos');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnsayos();
    }, []);

    const handleOpenDetails = (ensayo: Ensayo) => {
        setSelectedEnsayo(ensayo);
    };

    const handleCloseDetails = () => {
        setSelectedEnsayo(null);
    };

    const handleEdit = (id: number) => {
        navigate(`/dashboard/ensayos/editar/${id}`);
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este ensayo?");
        if (!confirmDelete) return;

        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.ENSAYOS.ELIMINAR}/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setEnsayos((prev) => prev.filter((ensayo) => ensayo.id !== id));
            ResponseMessage.show('Ensayo eliminado correctamente');
            handleCloseDetails();
        } catch (error) {
            ResponseMessage.show('Error al eliminar el ensayo');
        }
    };

    const columns = [
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
                <button
                    onClick={() => handleOpenDetails(props.row.original)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                    Detalles
                </button>
            ),
        }),
    ];

    const tabla = useReactTable({
        data: ensayos,
        columns,
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

            {selectedEnsayo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-2">Detalles del Ensayo</h3>
                        <p><strong>ID:</strong> {selectedEnsayo.id}</p>
                        <p><strong>Nombre:</strong> {selectedEnsayo.nombre}</p>
                        <p><strong>ID Servicio:</strong> {selectedEnsayo.id_servicio}</p>

                        <div className="mt-4 flex justify-between">
                            <button
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                onClick={() => handleEdit(selectedEnsayo.id)}
                            >
                                Editar
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={() => handleDelete(selectedEnsayo.id)}
                            >
                                Eliminar
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                onClick={handleCloseDetails}
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

export default TablaEnsayos;
