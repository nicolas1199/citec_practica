import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { Empresa } from '../../../../components/Utils/interfaces';
import { useData } from '../../../../components/AuthDataContext';
import { useNavigate } from 'react-router-dom';
import ResponseMessage from '../../../../components/ResponseMessage';
import { ENDPOINTS } from '../../../../common/constants/urls.constants';

interface Comuna {
    id: string;
    nombre: string;
    provincia: string; // Incluimos la provincia
}

interface Contacto {
    email: string;
    nombre: string;
    cargo: string;
}

const EditarEmpresa: React.FC = () => {
    const { regiones, comunas, giros, provincias } = useData();
    const [values, setValues] = useState<Empresa>({
        rut: '',
        razon_social: '',
        nombre_de_fantasia: '',
        email_factura: '',
        direccion: '',
        telefono: '',
        comuna: '', // Actualizado para incluir provincia
        giros: [], // Para almacenar giros seleccionados
        contactos: [], // Para almacenar contactos
    });

    const formatRut = (rut: string) => {
        const cleanRut = rut.replace(/\D/g, '').slice(0, 9); // Limitar a 9 dígitos
        if (cleanRut.length <= 1) return cleanRut;

        // Formatear con puntos y guion solo si tiene más de un dígito
        const rutWithDots =
            cleanRut.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
            '-' +
            cleanRut.slice(-1);
        return rutWithDots;
    };

    const [selectedGiros, setSelectedGiros] = useState<
        { codigo: number; nombre: string }[]
    >([]);
    const [selectedComuna, setSelectedComuna] = useState<Comuna | null>(null);
    const [newContacto, setNewContacto] = useState<Contacto>({
        email: '',
        nombre: '',
        cargo: '',
    });

    const handleComunaChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const comuna = comunas?.find((c) => String(c.id) === e.target.value);
        const comunaID = String(comuna.id);
        if (comuna) {
            setSelectedComuna(comuna);
            setValues((prev) => ({ ...prev, comuna: comunaID }));
        } else {
            setSelectedComuna(null);
            setValues((prev) => ({ ...prev, comuna })); // Resetear comuna
        }
    };

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        if (name === 'rut') {
            setValues((prev) => ({ ...prev, rut: formatRut(value) }));
        } else {
            setValues({ ...values, [name]: value });
        }
    };

    const handleGiroChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const giroCodigo = parseInt(e.target.value);
        const giroSeleccionado = giros?.find((g) => g.codigo === giroCodigo);

        if (
            giroSeleccionado &&
            !selectedGiros.some((selected) => selected.codigo === giroCodigo)
        ) {
            setSelectedGiros([...selectedGiros, giroSeleccionado]);
            setValues((prev) => ({
                ...prev,
                giros: [...prev.giros, giroSeleccionado],
            }));
        }
    };

    const handleRemoveGiro = (giroCodigo: number) => {
        const updatedGiros = selectedGiros.filter(
            (g) => g.codigo !== giroCodigo,
        );
        setSelectedGiros(updatedGiros);
        setValues((prev) => ({ ...prev, giros: updatedGiros }));
    };

    const handleContactoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewContacto({ ...newContacto, [name]: value });
    };

    const handleAddContacto = () => {
        if (newContacto.email && newContacto.nombre && newContacto.cargo) {
            setValues((prev) => ({
                ...prev,
                contactos: [...prev.contactos, newContacto],
            }));
            setNewContacto({ email: '', nombre: '', cargo: '' }); // Resetear el formulario de contacto
        }
    };

    const handleRemoveContacto = (email: string) => {
        const updatedContactos = values.contactos.filter(
            (contacto: any) => contacto.email !== email,
        );
        setValues((prev: any) => ({ ...prev, contactos: updatedContactos }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            // Agrega el prefijo +569 si el tipo de teléfono es celular y no está presente aún
            const telefonoConPrefijo =
                telefonoTipo === 'celular' &&
                !values.telefono.startsWith('+569')
                    ? `+569${values.telefono}`
                    : values.telefono;

            //@ts-ignore
            const updatedGiro = selectedGiros?.map(
                ({ codigo, ...rest }) => ({
                    /*@ts-ignore*/
                    codigo: codigo_giro,
                    ...rest,
                }),
            );

            const rut = window.location.pathname.split('/').pop();
            // Crea un nuevo objeto con el teléfono modificado
            const dataToSend = {
                ...values,
                telefono: telefonoConPrefijo,
                nuevo_rut: values.rut,
                giros: updatedGiro,
                rut: rut,
            };

            console.log(dataToSend); // Para verificar el objeto antes de enviarlo

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.EMPRESAS.ACTUALIZAR}`,
                dataToSend,
            );
            console.log(response.data.response || response.data.errors);

            ResponseMessage.show(`${response.data.msg}`);
        } catch (error: any) {
            if (error.name === 'AxiosError') {
                ResponseMessage.show(
                    `${error.response.data.errors[0].msg} valor: ${error.response.data.errors[0].value}`,
                );
            }
            console.log(error);
        }
    };
    const [telefonoTipo, setTelefonoTipo] = useState<'celular' | 'fijo'>(
        'celular',
    );
    const handleTelefonoTipoChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const tipo = e.target.value as 'celular' | 'fijo';
        setTelefonoTipo(tipo);
        setValues((prev) => ({ ...prev, telefono: '' })); // Limpia el campo al cambiar de tipo
    };
    const [editableFields, setEditableFields] = useState<boolean[]>([
        false,
        false,
        false,
        false,
        false,
        false,
    ]); // Para manejar la edición de campos
    const toggleEditable = (index: number) => {
        const updatedFields = [...editableFields];
        updatedFields[index] = !updatedFields[index];
        setEditableFields(updatedFields);
    };

    const navigate = useNavigate();
    //Apenas cargue la pagina verificamos si el rut existe
    useEffect(() => {
        const rut = window.location.pathname.split('/').pop();
        axios
            .get(
                `${import.meta.env.VITE_BACKEND_URL}/${
                    import.meta.env.VITE_API_KEY
                }/business/get-by-id/${rut}`,
            )
            .then((res) => {
                // Verificamos que la respuesta contenga los datos de la empresa
                if (res.data.response) {
                    const empresa = res.data.response;
                    // Actualizamos los valores en el estado
                    setValues({
                        rut: rut!,
                        razon_social: empresa.razon_social,
                        nombre_de_fantasia: empresa.nombre_de_fantasia,
                        email_factura: empresa.email_factura,
                        direccion: empresa.direccion,
                        telefono: empresa.telefono,
                        comuna: String(empresa.comuna.id), // Asegúrate de guardar solo el ID de la comuna
                        giros: empresa.giros, // Asumiendo que `giros` ya está en el formato correcto
                        contactos: empresa.contactos, // Asumiendo que `contactos` ya está en el formato correcto
                    });

                    const tel: string = empresa.telefono.toString();
                    if (tel.startsWith('+569')) {
                        setTelefonoTipo('celular');
                    } else {
                        setTelefonoTipo('fijo');
                    }

                    const comuna = comunas?.find(
                        (c) => String(c.id) === String(empresa.comuna.id),
                    );
                    if (comuna) {
                        setSelectedComuna(comuna);
                    }
                    setSelectedGiros(empresa.giros); // Si es necesario, para manejar giros seleccionados
                }
            })
            .catch((error) => {
                navigate('/dashboard');
                console.log(error);
            });
    }, [comunas]);

    return (
        <form
            className="p-6 w-10/12 mx-auto bg-white shadow-md rounded-md my-10"
            onSubmit={handleSubmit}
        >
            <h1 className="text-2xl font-bold mb-4">Editar Empresa</h1>

            {/* Campos básicos de la empresa */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                    {
                        label: 'Rut de la empresa',
                        name: 'rut',
                        type: 'text',
                        required: true,
                    },
                    {
                        label: 'Razón social de la empresa',
                        name: 'razon_social',
                        type: 'text',
                        required: true,
                    },
                    {
                        label: 'Nombre de fantasía',
                        name: 'nombre_de_fantasia',
                        type: 'text',
                        required: true,
                    },
                    {
                        label: 'Email de factura',
                        name: 'email_factura',
                        type: 'email',
                        required: true,
                    },
                    {
                        label: 'Dirección',
                        name: 'direccion',
                        type: 'text',
                        required: true,
                    },
                    {
                        label: 'Teléfono',
                        name: 'telefono',
                        type: 'text',
                        required: true,
                    },
                ].map((field, index) => (
                    <div key={field.name}>
                        <h3 className="mb-2 p-0 font-bold">
                            {field.label}
                            <span className="text-red-500"> * </span>
                        </h3>
                        <div className="flex gap-2">
                            {field.name === 'telefono' ? (
                                <select
                                    value={telefonoTipo}
                                    onChange={handleTelefonoTipoChange}
                                    className={`px-2 py-1 border border-gray-300 rounded-md ${
                                        editableFields[index]
                                            ? 'bg-white'
                                            : 'bg-gray-200'
                                    }`}
                                    disabled={!editableFields[index]}
                                >
                                    <option value="celular">
                                        Celular (+56 9)
                                    </option>
                                    <option value="fijo">Teléfono Fijo</option>
                                </select>
                            ) : (
                                ''
                            )}

                            <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.label}
                                value={values[field.name as keyof Empresa]
                                    .toString()
                                    .replace('+569', '')}
                                onChange={(e) => handleInputChange(e)}
                                className={`w-full px-4 py-2 border border-gray-300 rounded-md ${
                                    editableFields[index]
                                        ? 'bg-white'
                                        : 'bg-gray-200'
                                } transition`}
                                disabled={!editableFields[index]}
                                required={field.required}
                                maxLength={
                                    field.name === 'telefono'
                                        ? telefonoTipo === 'celular'
                                            ? 8
                                            : 9
                                        : undefined
                                }
                            />
                            <button
                                type="button"
                                onClick={() => toggleEditable(index)}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                                {editableFields[index] ? '🔓' : '🔒'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selección de Comuna */}
            <div className="mb-4">
                <label className="block mb-2">Seleccione una Comuna</label>
                <select
                    value={selectedComuna?.id}
                    onChange={handleComunaChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                    <option value="">Seleccione una Comuna</option>
                    {comunas?.map((comuna) => (
                        <option key={comuna.id} value={comuna.id}>
                            {comuna.nombre}
                        </option>
                    )) ?? <option value="">No hay comunas disponibles</option>}
                </select>
            </div>

            {/* Mostrar Región y Provincia seleccionadas */}
            <div className="flex mb-4">
                <div className="flex-1 text-gray-600">
                    Provincia:{' '}
                    {selectedComuna
                        ? provincias?.find(
                              (p) => p.id === selectedComuna.provincia,
                          )?.nombre
                        : 'Seleccione una comuna'}
                </div>
                <div className="flex-1 text-gray-600">
                    Región:{' '}
                    {selectedComuna
                        ? regiones?.find(
                              (r) =>
                                  r.id ===
                                  provincias?.find(
                                      (p) => p.id === selectedComuna.provincia,
                                  )?.region,
                          )?.nombre
                        : 'Seleccione una comuna'}
                </div>
            </div>

            {/* Selección de Giros */}
            <div className="mb-4">
                <label className="block mb-2">Seleccione Giros</label>
                <select
                    onChange={handleGiroChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                    <option value="">Seleccione un Giro</option>
                    {giros?.map((giro) => (
                        <option key={giro.codigo} value={giro.codigo}>
                            {giro.nombre}
                        </option>
                    )) ?? <option value="">No hay giros disponibles</option>}
                </select>

                {/* Giros seleccionados */}
                <h2 className="font-semibold mt-4">Giros Seleccionados:</h2>
                <div className="bg-gray-100 rounded-md p-4 mt-2">
                    {selectedGiros.length > 0 ? (
                        selectedGiros.map((giro) => (
                            <div
                                key={giro.codigo}
                                className="flex justify-between items-center border-b py-2 last:border-b-0"
                            >
                                <span className="text-gray-700">
                                    {giro.nombre}
                                </span>
                                <button
                                    onClick={() =>
                                        handleRemoveGiro(giro.codigo)
                                    }
                                    className="text-white ml-2 hover:bg-red-700 bg-red-500 p-2 rounded-md transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">
                            No hay giros seleccionados
                        </p>
                    )}
                </div>
            </div>

            {/* Añadir Contactos */}
            <div className="mb-4">
                <h2 className="font-semibold mt-4">Agregar Contactos</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={newContacto.email}
                        onChange={handleContactoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={newContacto.nombre}
                        onChange={handleContactoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                        type="text"
                        name="cargo"
                        placeholder="Cargo"
                        value={newContacto.cargo}
                        onChange={handleContactoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleAddContacto}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Agregar Contacto
                </button>

                {/* Contactos añadidos */}
                <h2 className="font-semibold mt-4">Contactos Agregados:</h2>
                <div className="bg-gray-100 rounded-md p-4 mt-2">
                    {values.contactos.length > 0 ? (
                        values.contactos.map((contacto) => (
                            <div
                                key={contacto.email}
                                className="flex justify-between items-center border-b py-2 last:border-b-0"
                            >
                                <span className="text-gray-700">
                                    {contacto.nombre} - {contacto.email} -{' '}
                                    {contacto.cargo}
                                </span>
                                <button
                                    onClick={() =>
                                        handleRemoveContacto(contacto.email)
                                    }
                                    className="text-white ml-2 hover:bg-red-700 bg-red-500 p-2 rounded-md transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">
                            No hay contactos agregados
                        </p>
                    )}
                </div>
            </div>

            {/* Botón de enviar */}
            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
                Editar Empresa
            </button>
        </form>
    );
};

export default EditarEmpresa;
