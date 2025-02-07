import { useEffect, useState } from 'react';
import { Usuario } from './Utils/interfaces';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ResponseMessage from './ResponseMessage';
import { ENDPOINTS } from '../common/constants/urls.constants';
import { useData } from './AuthDataContext';

function TablaUsuario() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]); // Estado adicional para los usuarios filtrados
    const [inputSearchValue, setInputSearchValue] = useState('');

    const { token } = useData();

    useEffect(() => {
        axios
            .get(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.USUARIOS.OBTENER_TODOS}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((response) => {
                const data = response.data;
                const mappedUsuarios: Usuario[] = data.map((item: any) => ({
                    email: item.email,
                    nombre: item.nombre,
                    apellido: item.apellido,
                    email_factura: item.email_factura,
                    contraseña: item.contraseña,
                    nombre_tipo: item.nombre_tipo,
                }));
                setUsuarios(mappedUsuarios);
                setFilteredUsuarios(mappedUsuarios); // Inicialmente mostramos todos los usuarios
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleDelete = (usuario: Usuario) => {
        axios
            .delete(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.USUARIOS.ELIMINAR}/${usuario.email}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((response) => {
                const updatedUsuarios = usuarios.filter(
                    (u) => u.email !== usuario.email,
                );
                setUsuarios(updatedUsuarios);
                setFilteredUsuarios(updatedUsuarios); // Actualizamos los usuarios filtrados
                console.log(response);
                ResponseMessage.show(`Usuario eliminado exitosamente`);
            })
            .catch((error) => {
                if (error.name === 'AxiosError') {
                    ResponseMessage.show(
                        `${error.response.data.errors[0].msg} valor: ${error.response.data.errors[0].value}`,
                    );
                } else {
                    console.error('Error eliminando usuario:', error);
                }
            });
    };

    const handleSearch = (value: string) => {
        setInputSearchValue(value);
        const searchValue = value.toLowerCase();
        const filtered = usuarios.filter(
            (usuario) =>
                usuario.nombre.toLowerCase().includes(searchValue) ||
                usuario.apellido.toLowerCase().includes(searchValue) ||
                usuario.email.toLowerCase().includes(searchValue) ||
                usuario.nombre_tipo.toLowerCase().includes(searchValue),
        );
        setFilteredUsuarios(filtered);
    };

    const columnHelper = createColumnHelper<Usuario>();
    const columns = [
        columnHelper.accessor('email', {
            header: () => 'Email',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('nombre', {
            header: () => 'Nombre',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('apellido', {
            header: () => 'Apellido',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('nombre_tipo', {
            header: () => 'Tipo de usuario',
            cell: (info) => info.getValue(),
        }),
        columnHelper.display({
            id: 'acciones',
            header: () => 'Acciones',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Link
                        to={`editar/${row.original.email}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                        Editar
                    </Link>
                    <button
                        onClick={() => handleDelete(row.original)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Eliminar
                    </button>
                </div>
            ),
        }),
    ];

    const tabla = useReactTable({
        data: filteredUsuarios, // Usamos los usuarios filtrados para la tabla
        columns,
        debugTable: false,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="container mx-auto w-11/12 my-10">
            <div className="mb-4">
                <Link
                    to={'/dashboard/usuarios/crear'}
                    className="bg-green-500 text-white px-4 py-2 font-semibold hover:bg-green-600 rounded-md"
                >
                    + Nuevo
                </Link>
            </div>
            <div className="search-bar mb-4">
                <form onSubmit={(e) => e.preventDefault()} className="flex">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={inputSearchValue}
                        onChange={(e) => handleSearch(e.target.value)}
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
            </div>
        </div>
    );
}

export default TablaUsuario;
