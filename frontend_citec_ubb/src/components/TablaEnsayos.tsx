import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../common/constants/urls.constants';
import { Ensayo } from '../components/Utils/interfaces';
import ResponseMessage from './ResponseMessage';
import { useData } from './AuthDataContext';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

const TablaEnsayos = () => {
    const navigate = useNavigate();
    const [ensayos, setEnsayos] = useState<Ensayo[]>([]);
    const [selectedEnsayo, setSelectedEnsayo] = useState<Ensayo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { token } = useData();

    const fetchEnsayos = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.ENSAYOS.OBTENER_TODOS}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            const ensayosFormateados = response.data.map((ensayo: any) => ({
                id: ensayo.id,
                nombre_ensayo: ensayo.nombre ?? ensayo.nombre_ensayo,
                tipo_servicio_id: ensayo.id_servicio ?? ensayo.tipo_servicio_id,
                createdAt: ensayo.createdAt,
                updatedAt: ensayo.updatedAt,
            }));

            setEnsayos(ensayosFormateados);
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
        const confirmDelete = window.confirm(
            '¿Estás seguro de que deseas eliminar este ensayo?',
        );
        if (!confirmDelete) return;

        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.ENSAYOS.ELIMINAR}/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            setEnsayos((prevEnsayos) => {
                return prevEnsayos.filter((ensayo) => ensayo.id !== id);
            });
            ResponseMessage.show('Ensayo eliminado correctamente');
            handleCloseDetails();
        } catch (error) {
            ResponseMessage.show('Error al eliminar el ensayo');
        }
    };

    useEffect(() => {
        if (ensayos.length > 0) {
            // Destruir instancia existente si ya existe
            const table = $('#tablaEnsayos').DataTable();
            if ($.fn.dataTable.isDataTable('#tablaEnsayos')) {
                table.destroy();
            }

            // Inicializamos DataTable después de que los datos hayan sido cargados
            $(document).ready(function () {
                $('#tablaEnsayos').DataTable({
                    paging: true, // Habilitar paginación
                    pageLength: 10, // Mostrar 10 ensayos por página
                    searching: true, // Habilitar la búsqueda
                    ordering: true, // Habilitar el ordenamiento de las columnas
                    language: {
                        search: 'Buscar:',
                        lengthMenu: 'Mostrar _MENU_ registros por página',
                        paginate: {
                            next: 'Siguiente',
                            previous: 'Anterior',
                        },
                        zeroRecords: 'No se encontraron registros',
                        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
                        infoEmpty: 'Mostrando 0 a 0 de 0 registros',
                        infoFiltered: '(filtrado de _MAX_ registros)',
                    },
                    lengthMenu: [5, 10, 15, 20], // Opciones para el número de entradas por página
                    columnDefs: [
                        {
                            targets: [0, 1, 2], // Permitir ordenar por ID, Nombre y ID Servicio
                            orderable: true,
                        },
                    ],
                });
            });
        }

        // Función de limpieza para cuando el componente se desmonta
        return () => {
            if ($.fn.dataTable.isDataTable('#tablaEnsayos')) {
                $('#tablaEnsayos').DataTable().destroy();
            }
        };
    }, [ensayos]);

    return (
        <div className="container mx-auto w-11/12 my-10">
            <h2 className="text-xl font-bold mb-4">Lista de Ensayos</h2>
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-4">Cargando ensayos...</div>
                ) : ensayos.length === 0 ? (
                    <div className="text-center py-4">
                        No hay ensayos disponibles
                    </div>
                ) : (
                    <table
                        id="tablaEnsayos"
                        className="display min-w-full bg-white shadow-md rounded-lg overflow-hidden"
                    >
                        <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                            <tr>
                                <th>ID Ensayo</th>
                                <th>Nombre del Ensayo</th>
                                <th>ID Servicio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {ensayos.map((ensayo) => (
                                <tr
                                    key={ensayo.id}
                                    className="border-t hover:bg-gray-100 transition-colors"
                                >
                                    <td>{ensayo.id}</td>
                                    <td>{ensayo.nombre_ensayo ?? 'N/A'}</td>
                                    <td>{ensayo.tipo_servicio_id ?? 'N/A'}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleOpenDetails(ensayo)
                                            }
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedEnsayo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-2">
                            Detalles del Ensayo
                        </h3>
                        <p>
                            <strong>ID:</strong> {selectedEnsayo.id}
                        </p>
                        <p>
                            <strong>Nombre:</strong>{' '}
                            {selectedEnsayo.nombre_ensayo}
                        </p>
                        <p>
                            <strong>ID Servicio:</strong>{' '}
                            {selectedEnsayo.tipo_servicio_id}
                        </p>

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
