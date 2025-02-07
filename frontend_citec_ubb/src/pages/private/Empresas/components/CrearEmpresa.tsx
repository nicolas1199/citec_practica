import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { CrearEmpresaDto } from '../dtos/empresas.dto';
import { ENDPOINTS } from '../../../../common/constants/urls.constants';
import { useData } from '../../../../components/AuthDataContext';
import { useNavigate } from 'react-router-dom';

interface Comuna {
  id: number;
  nombre: string;
  id_provincias: number; // ID de la provincia asociada
}

interface Provincia {
  id: number;
  nombre: string;
  id_regiones: number; // ID de la región asociada
}

interface Region {
  id: number;
  nombre: string;
}

interface Contacto {
  email: string;
  nombre: string;
  cargo: string;
}

interface Giro {
  codigo: number;
  nombre: string;
}

const CrearEmpresa: React.FC = () => {
  const { token } = useData();
  const [values, setValues] = useState<CrearEmpresaDto>({
    rut: '',
    razon_social: '',
    nombre_de_fantasia: '',
    email_factura: '',
    direccion: '',
    id_comunas: 0, // Actualizado para incluir provincia
    telefono: '',
    contactos: [], // Para almacenar contactos
    giros: [], // Para almacenar giros seleccionados
  });

  const navigate = useNavigate();

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

  const [newContacto, setNewContacto] = useState<Contacto>({
    email: '',
    nombre: '',
    cargo: '',
  });

  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [filteredComunas, setFilteredComunas] = useState<Comuna[]>([]);
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [giros, setGiros] = useState<Giro[]>([]);
  const [filteredGiros, setFilteredGiros] = useState<Giro[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchComuna, setSearchComuna] = useState('');

  // Obtener datos de regiones, provincias y comunas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regionesRes, provinciasRes, comunasRes, girosRes] =
          await Promise.all([
            axios.get(
              `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.REGIONES.OBTENER_TODOS}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            ),
            axios.get(
              `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.PROVINCIAS.OBTENER_TODOS}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            ),
            axios.get(
              `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.COMUNA.OBTENER_TODOS}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            ),
            axios.get(
              `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.GIROS.OBTENER_TODOS}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            ),
          ]);

        setRegiones(regionesRes.data || []);
        setProvincias(provinciasRes.data || []);
        setComunas(comunasRes.data || []);
        setGiros(girosRes.data || []);
        setFilteredGiros(girosRes.data || []);
        setFilteredComunas(comunasRes.data || []);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, [token]);

  const handleSearchComuna = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchComuna(term);

    const filtered = comunas.filter((comuna) =>
      comuna.nombre.toLowerCase().includes(term),
    );

    setFilteredComunas(filtered);
  };

  const handleComunaSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedComuna = comunas.find(
      (comuna) => comuna.nombre === e.target.value,
    );
    if (selectedComuna) {
      setValues((prev) => ({
        ...prev,
        id_comunas: selectedComuna.id,
      }));
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

  const [selectedGiros, setSelectedGiros] = useState<number[]>([]);

  const handleGiroSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedGiro = giros.find(
      (giro) =>
        `${giro.nombre} (Código: ${giro.codigo})` === e.target.value,
    );
    if (selectedGiro && !selectedGiros.includes(selectedGiro.codigo)) {
      setSelectedGiros([...selectedGiros, selectedGiro.codigo]);
      setValues((prev) => ({
        ...prev,
        giros: [...prev.giros, selectedGiro.codigo],
      }));
    }
  };

  const handleRemoveGiro = (giroCodigo: number) => {
    const updatedGiros = selectedGiros.filter(
      (codigo) => codigo !== giroCodigo,
    );
    setSelectedGiros(updatedGiros);
    setValues((prev) => ({
      ...prev,
      giros: updatedGiros,
    }));
  };

  const handleSearchGiro = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = giros.filter(
      (giro) =>
        giro.nombre.toLowerCase().includes(term) ||
        giro.codigo.toString().includes(term),
    );

    setFilteredGiros(filtered);
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
      (contacto) => contacto.email !== email,
    );
    setValues((prev) => ({ ...prev, contactos: updatedContactos }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // Verificar que el estado esté actualizado antes de enviar
      const dataToSend = { ...values };

      // Agregar prefijo si el teléfono es de tipo celular
      if (
        telefonoTipo === 'celular' &&
        !dataToSend.telefono.startsWith('+569')
      ) {
        dataToSend.telefono = `+569${dataToSend.telefono}`;
      }

      // Asegurar que `id_comunas` esté correcto
      if (!dataToSend.id_comunas || dataToSend.id_comunas === 0) {
        console.warn(
          'id_comunas no está configurado correctamente:',
          dataToSend.id_comunas,
        );
        alert('Por favor selecciona una comuna antes de enviar.');
        return;
      }

      console.log('Enviando datos al backend:', dataToSend);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_NESTJS_URL}/${ENDPOINTS.EMPRESAS.CREAR}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate('/dashboard/empresas')

      console.log('Respuesta del backend:', data);
    } catch (error) {
      console.error('Error en la petición:', error);
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

  return (
    <form
      className="p-6 w-10/12 mx-auto bg-white shadow-md rounded-md my-10"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold mb-4">Crear Empresa</h1>

      {/* Campos básicos de la empresa */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="mb-2 p-0 font-bold">
            Rut de la empresa
            <span className="text-red-500"> * </span>
          </h3>
          <input
            type="text"
            name="rut"
            placeholder="RUT"
            value={values.rut}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <h3 className="mb-2 p-0 font-bold">
            Razón social de la empresa
            <span className="text-red-500"> * </span>
          </h3>
          <input
            type="text"
            name="razon_social"
            placeholder="Razón Social"
            value={values.razon_social}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <h3 className="mb-2 p-0 font-bold">
            Nombre de fantasía
            <span className="text-red-500"> * </span>
          </h3>
          <input
            type="text"
            name="nombre_de_fantasia"
            placeholder="Nombre de Fantasía"
            value={values.nombre_de_fantasia}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <h3 className="mb-2 p-0 font-bold">
            Email de factura
            <span className="text-red-500"> * </span>
          </h3>
          <input
            type="email"
            name="email_factura"
            placeholder="Email Factura"
            value={values.email_factura}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <h3 className="mb-2 p-0 font-bold">
            Direccion<span className="text-red-500"> * </span>
          </h3>
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={values.direccion}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <h3 className="mb-2 p-0 font-bold">
            Teléfono<span className="text-red-500"> * </span>
          </h3>
          <div className="flex gap-2">
            <select
              onChange={handleTelefonoTipoChange}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value="celular">Celular (+56 9)</option>
              <option value="fijo">Teléfono Fijo</option>
            </select>
            <input
              type="text"
              name="telefono"
              placeholder={
                telefonoTipo === 'celular'
                  ? '8 dígitos'
                  : '9 dígitos'
              }
              value={values.telefono}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
              maxLength={telefonoTipo === 'celular' ? 8 : 9}
            />
          </div>
        </div>
      </div>

      {/* Buscar y Seleccionar Comuna */}
      <div className="relative mb-4">
        <label className="block mb-2">Seleccione una Comuna</label>
        <input
          type="text"
          value={searchComuna}
          onChange={handleSearchComuna}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Ingrese nombre de la Comuna"
        />
        {searchComuna.length >= 1 && filteredComunas.length > 0 && (
          <ul className="absolute bg-white border border-gray-300 rounded-md shadow-md w-full mt-1 max-h-40 overflow-y-auto z-10">
            {filteredComunas.map((comuna) => (
              <li
                key={comuna.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setValues((prev) => ({
                    ...prev,
                    id_comunas: comuna.id,
                  }));
                  setSearchComuna(comuna.nombre);
                  setFilteredComunas([]);
                }}
              >
                {comuna.nombre}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mostrar Región y Provincia seleccionadas */}
      <div className="flex mb-4">
        <div className="flex-1 text-gray-600">
          Provincia:{' '}
          {values.id_comunas
            ? provincias.find(
              (provincia) =>
                provincia.id ===
                comunas.find(
                  (comuna) =>
                    comuna.id === values.id_comunas,
                )?.id_provincias, // Usamos el id_provincias directamente
            )?.nombre
            : 'Seleccione una comuna'}
        </div>
        <div className="flex-1 text-gray-600">
          Región:{' '}
          {values.id_comunas
            ? regiones.find(
              (region) =>
                region.id ===
                provincias.find(
                  (provincia) =>
                    provincia.id ===
                    comunas.find(
                      (comuna) =>
                        comuna.id ===
                        values.id_comunas,
                    )?.id_provincias, // Usamos id_provincias
                )?.id_regiones, // Usamos id_regiones directamente
            )?.nombre
            : 'Seleccione una comuna'}
        </div>
      </div>

      {/* Buscar y Seleccionar Giros */}
      <div className="relative mb-4">
        <label className="block mb-2">Seleccione un Giro</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchGiro}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Ingrese nombre del Giro"
        />
        {searchTerm.length >= 1 && filteredGiros.length > 0 && (
          <ul className="absolute bg-white border border-gray-300 rounded-md shadow-md w-full mt-1 max-h-40 overflow-y-auto z-10">
            {filteredGiros.map((giro) => (
              <li
                key={giro.codigo}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  // Agrega el código del giro a la lista de giros seleccionados
                  setSelectedGiros((prev) => [...prev, giro.codigo]);

                  // Limpia el campo de texto
                  setSearchTerm('');

                  // Limpia la lista filtrada
                  setFilteredGiros([]);
                }}
              >
                {`${giro.codigo} - ${giro.nombre}`}
              </li>
            ))}
          </ul>
        )}
      </div>



      {/* Giros seleccionados */}
      <h2 className="font-semibold mt-4">Giros Seleccionados:</h2>
      <div className="bg-gray-100 rounded-md p-4 mt-2">
        {selectedGiros.map((codigo) => {
          const giro = giros.find((g) => g.codigo === codigo);
          return (
            <div
              key={codigo}
              className="flex justify-between items-center border-b py-2 last:border-b-0"
            >
              <span className="text-gray-700">
                {giro?.codigo} - {giro?.nombre}
              </span>
              <button
                onClick={() => handleRemoveGiro(codigo)}
                className="text-white ml-2 hover:bg-red-700 bg-red-500 p-2 rounded-md transition-colors"
              >
                Eliminar
              </button>
            </div>
          );
        })}
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
        Crear Empresa
      </button>
    </form>
  );
};

export default CrearEmpresa;
