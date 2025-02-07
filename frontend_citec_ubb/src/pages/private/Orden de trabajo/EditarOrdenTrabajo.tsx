const EditarOrdenTrabajo: React.FC = () => {
    return (
        <form className="p-6 w-10/12 mx-auto bg-white shadow-md rounded-md my-10">
            <h1 className="text-2xl font-bold mb-4">Editar Orden de Trabajo</h1>

            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* ID de la orden de trabajo */}
                <div>
                    <label className="block mb-2 font-bold">
                        ID orden de trabajo
                    </label>
                    <input
                        type="text"
                        placeholder="ID"
                        defaultValue="12345" // Ejemplo de valor cargado
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Selección de propuesta de servicio */}
                <div className="mb-4">
                    <h3 className="mb-2 p-0 font-bold">
                        Seleccione la propuesta de servicio
                        <span className="text-red-500"> * </span>
                    </h3>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        defaultValue="11" // Ejemplo de valor cargado
                    >
                        <option value="">Seleccione propuesta de servicio (ID)</option>
                        <option value="9">9</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                </div>

                {/* Archivo: OC cliente */}
                <div>
                    <h3 className="mb-2 p-0 font-bold">
                        OC cliente<span className="text-red-500"> * </span>
                    </h3>
                    <input
                        type="file"
                        accept="application/pdf"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Archivo: Número de factura */}
                <div>
                    <h3 className="mb-2 p-0 font-bold">
                        N° de factura<span className="text-red-500"> * </span>
                    </h3>
                    <input
                        type="file"
                        accept="application/pdf"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Archivo: Comprobante de pago */}
                <div>
                    <h3 className="mb-2 p-0 font-bold">
                        Comprobante de pago<span className="text-red-500"> * </span>
                    </h3>
                    <input
                        type="file"
                        accept="application/pdf"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Estado del pago */}
                <div className="mb-4">
                    <h3 className="mb-2 p-0 font-bold">
                        Seleccione estado del pago
                        <span className="text-red-500"> * </span>
                    </h3>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        defaultValue="pendiente" // Ejemplo de valor cargado
                    >
                        <option value="">Seleccione estado</option>
                        <option value="pagado">Pagado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="no pagado">No pagado</option>
                    </select>
                </div>
            </div>

            {/* Botón de guardar cambios */}
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mt-4"
            >
                Guardar Cambios
            </button>
        </form>
    );
};

export default EditarOrdenTrabajo;