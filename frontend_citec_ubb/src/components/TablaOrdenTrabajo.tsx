import { useEffect, useState } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<any>();

const columns = () => [
    columnHelper.accessor('id', {
        header: () => 'ID',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('propuesta_servicio', {
        header: () => 'Propuesta de Servicio',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('oc_cliente', {
        header: () => 'Donde compra (PDF)',
        cell: (info) => {
            const pdfUrl = info.getValue();
            return (
                <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    Ver PDF
                </a>
            );
        },
    }),
    columnHelper.accessor('precio_total', {
        header: () => 'Precio Total (CLP)',
        cell: (info) => {
            const precio = info.getValue();
            const formatter = new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
            });
            return formatter.format(precio);
        },
    }),
    columnHelper.accessor('numero_factura', {
        header: () => 'N° de Factura',
        cell: (info) => info.getValue() || 'Sin asignar',
    }),
    columnHelper.accessor('comprobante_pago', {
        header: () => 'Comprobante de Pago (PDF)',
        cell: (info) => {
            const pdfUrl = info.getValue();
            return (
                <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    Ver PDF
                </a>
            );
        },
    }),
    columnHelper.accessor('estado', {
        header: () => 'Estado',
        cell: (info) => {
            const estado = info.getValue();
            const estadoMap: { [key: string]: { color: string; text: string } } = {
                pagado: { color: 'bg-green-500', text: 'Pagado' },
                pendiente: { color: 'bg-yellow-500', text: 'Pendiente' },
                no_pagado: { color: 'bg-red-500', text: 'No Pagado' },
            };
            const { color, text } = estadoMap[estado] || {
                color: 'bg-gray-500',
                text: 'Desconocido',
            };
            return (
                <span
                    className={`${color} text-white px-2 py-1 rounded text-xs font-semibold`}
                >
                    {text}
                </span>
            );
        },
    }),
];

const OrdenTrabajo = () => {
    const [propuestas, setPropuestas] = useState<any[]>([]);
    const [propuestasFiltradas, setPropuestasFiltradas] = useState<any[]>([]);
    const [inputSearchValue, setInputSearchValue] = useState('');

    const fetchPropuestas = async () => {
        try {
            // Datos de prueba. Sustituir por llamada real al backend.
            const data = [
                {
                    id: '123',
                    propuesta_servicio: 55,
                    oc_cliente: 'https://example.com/archivo1.pdf',
                    precio_total: 310000,
                    numero_factura: 10,
                    comprobante_pago: 'Empresa ABC',
                    estado: 'pagado',
                },
                {
                    id: '124',
                    propuesta_servicio: 99,
                    oc_cliente: 'https://example.com/archivo2.pdf',
                    precio_total: 199000,
                    numero_factura: 2,
                    comprobante_pago: 'Empresa ABC',
                    estado: 'pendiente',
                },
                {
                    id: '125',
                    propuesta_servicio: 10,
                    oc_cliente: 'https://example.com/archivo3.pdf',
                    precio_total: 157980,
                    numero_factura: 9,
                    comprobante_pago: 'Empresa ABC',
                    estado: 'no_pagado',
                },
            ];
            setPropuestas(data);
            setPropuestasFiltradas(data);
        } catch (error) {
            console.error('Error fetching propuestas:', error);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputSearchValue(e.target.value);
    };

    useEffect(() => {
        fetchPropuestas();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const searchValue = inputSearchValue.toLowerCase();
            setPropuestasFiltradas(
                propuestas.filter((propuesta) =>
                    propuesta.propuesta_servicio
                        .toString()
                        .toLowerCase()
                        .includes(searchValue),
                ),
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [inputSearchValue, propuestas]);

    const tabla = useReactTable({
        data: propuestasFiltradas,
        columns: columns(),
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

export default OrdenTrabajo;