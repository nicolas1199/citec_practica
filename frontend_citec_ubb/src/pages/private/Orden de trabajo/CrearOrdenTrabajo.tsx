
const CrearFactura: React.FC = () => {

    return (
        <form
            className="p-6 w-10/12 mx-auto bg-white shadow-md rounded-md my-10"
        >
            <h1 className="text-2xl font-bold mb-4">Crear Orden de trabajo</h1>

            <div className="grid grid-cols-2 gap-4 mb-4">

                <div>
                    <label className="block mb-2 font-bold">
                        ID orden de trabajo
                    </label>
                    <input
                        type="text"
                        placeholder="ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <h3 className="mb-2 p-0 font-bold">
                        Seleccione la propuesta de servicio
                        <span className="text-red-500"> * </span>
                    </h3>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Seleccione propuesta de servcio (ID)</option>
                        <option>9</option>
                        <option>11</option>
                        <option>12</option>

                    </select>
                </div>

                <div>
                    <h3 className="mb-2 p-0 font-bold">
                        OC cliente<span className="text-red-500"> * </span>
                    </h3>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                console.log("Archivo seleccionado:", file.name);
                                // Aquí puedes manejar el archivo, por ejemplo, guardarlo en el estado o subirlo al backend
                            }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <h3 className="mb-2 p-0 font-bold">
                        N° de factura<span className="text-red-500"> * </span>
                    </h3>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                console.log("Archivo seleccionado:", file.name);
                                // Aquí puedes manejar el archivo, por ejemplo, guardarlo en el estado o subirlo al backend
                            }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <h3 className="mb-2 p-0 font-bold">
                        Comprobante de pago<span className="text-red-500"> * </span>
                    </h3>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                console.log("Archivo seleccionado:", file.name);
                                // Aquí puedes manejar el archivo, por ejemplo, guardarlo en el estado o subirlo al backend
                            }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <h3 className="mb-2 p-0 font-bold">
                        Seleccione estado del pago
                        <span className="text-red-500"> * </span>
                    </h3>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Seleccione estado</option>
                        <option>pagado</option>
                        <option>pendiente</option>
                        <option>no pagado</option>

                    </select>
                </div>
            </div>

            {/* Botón de enviar */}
            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors mt-4"
            >
                Crear orden de trabajo
            </button>
        </form>
    );
};

export default CrearFactura;
