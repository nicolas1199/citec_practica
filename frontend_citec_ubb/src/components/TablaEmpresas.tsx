import { useEffect, useState } from 'react';
import { Empresa } from './Utils/interfaces';
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

const columnHelper = createColumnHelper<Empresa>();

const columns = (handleDelete: (rut: string) => void) => [
    columnHelper.accessor('nombre_de_fantasia', {
        header: () => 'Nombre',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('razon_social', {
        header: () => 'Razon Social',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email_factura', {
        header: () => 'Correo',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('rut', {
        header: () => 'Rut',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('direccion', {
        header: () => 'Dirección',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('telefono', {
        header: () => 'Teléfono',
        cell: (info) => info.getValue(),
    }),
    columnHelper.display({
        id: 'acciones',
        header: () => 'Acciones',
        cell: (props) => (
            <div className="flex gap-4">
                <Link
                    to={`/dashboard/empresas/editar/${props.row.original.rut}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                    Editar
                </Link>
                <button
                    onClick={() => handleDelete(props.row.original.rut)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    Eliminar
                </button>
            </div>
        ),
    }),
];

const TablaEmpresas = () => {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [empresasFiltradas, setEmpresasFiltradas] = useState<Empresa[]>([]);
    const [inputSearchValue, setInputSearchValue] = useState('');

    const { token } = useData();

    const fetchEmpresas = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.EMPRESAS.OBTENER_TODOS}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = response.data;
            const mappedEmpresas: Empresa[] = data.map((item: any) => ({
                rut: item.rut,
                razon_social: item.razon_social,
                nombre_de_fantasia: item.nombre_de_fantasia,
                email_factura: item.email_factura,
                direccion: item.direccion,
                comuna: item.comuna,
                telefono: item.telefono,
            }));
            setEmpresas(mappedEmpresas);
            setEmpresasFiltradas(mappedEmpresas);
        } catch (error) {
            console.error('Error fetching empresas:', error);
        }
    };

    const handleDelete = async (rut: string) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.EMPRESAS.ELIMINAR}/${rut}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            // Actualizar la lista de empresas después de eliminar
            setEmpresasFiltradas((prevEmpresas) =>
                prevEmpresas.filter((empresa) => empresa.rut !== rut),
            );

            ResponseMessage.show('Empresa eliminada');
        } catch (error: any) {
            if (error.name === 'AxiosError') {
                ResponseMessage.show(
                    `${error.response.data.errors[0].msg} valor: ${error.response.data.errors[0].value}`,
                );
            } else {
                console.error('Error deleting empresa:', error);
            }
        }
    };

    useEffect(() => {
        fetchEmpresas();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const searchValue = inputSearchValue.toLowerCase();
            setEmpresasFiltradas(
                empresas.filter(
                    (empresa) =>
                        empresa.nombre_de_fantasia
                            .toLowerCase()
                            .includes(searchValue) ||
                        empresa.razon_social
                            .toLowerCase()
                            .includes(searchValue) ||
                        empresa.email_factura
                            .toLowerCase()
                            .includes(searchValue) ||
                        empresa.rut.toLowerCase().includes(searchValue) ||
                        empresa.direccion.toLowerCase().includes(searchValue) ||
                        empresa.telefono.toLowerCase().includes(searchValue),
                ),
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [inputSearchValue, empresas]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputSearchValue(e.target.value);
    };

    const tabla = useReactTable({
        data: empresasFiltradas,
        columns: columns(handleDelete),
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="container mx-auto w-11/12 my-10">
            <div className="mb-4">
                <Link
                    to={'/dashboard/empresas/crear'}
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
};

export default TablaEmpresas;
