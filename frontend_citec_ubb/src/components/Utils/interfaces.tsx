/**
 * Este archivo contiene todos los interface de TypeScript utilzados en el frontend del proyecto.
 *
 * La principal finalidad de este archivo es centralizar y organizar las definiciones de tipos
 * para garantizar consistencia en todo el proyecto y facilitar el mantenimiento.
 *
 * Instrucciones:
 * - Agrega todos los nuevos types que se necesiten en el sistema en este archivo.
 * - Mantén una descripción detallada de cada tipo para mejorar la comprensión del sistema.
 */

/**
 * Representa la estructura de una empresa
 * Se utiliza para definir los datos relevantes de una empresa con la que trabaja el CITEC
 */

/**
 * @brief
 *  Recomendacion general es incluir las entidades o tablas en forma de interface
 */
export interface Empresa {
    rut: string;
    razon_social: string;
    nombre_de_fantasia: string;
    email_factura: string;
    direccion: string;
    telefono: string;
    comuna: string;
    giros: Array<{
        codigo: number;
    }>;
    contactos: Array<{
        email: string;
        nombre: string;
        cargo: string;
    }>;
}

export interface FacturaObtener {
    numero_folio: number;
    pago_neto: number;
    iva: number;
    fecha_emision: string;
    emisor: string;
    rut_receptor: string;
    codigo_giro: number;
    usuario: string;
    exento_iva: string;
    precio_por_servicio: Array<{
        precio_neto: number;
        nombre: string;
    }>;
}

export interface FacturaCrear {
    pago_neto: number;
    iva: number;
    rut_receptor: string;
    codigo_giro: number;
    usuario: string;
    exento_iva: string;
    precio_por_servicio: Array<{
        precio_neto: number;
        nombre: string;
    }>;
}

export interface FacturaEditar {
    numero_folio: number;
    pago_neto: number;
    iva: number;
    rut_receptor: string;
    codigo_giro: number;
    estado: string;
    usuario: string;
    exento_iva: string;
    precio_por_servicio: Array<{
        precio_neto: number;
        nombre: string;
    }>;
}

export interface Usuario {
    email: string;
    nombre: string;
    apellido: string;
    contraseña: string;
    nombre_tipo: string;
}

export interface PropuestaServicio {
    id: number;
    año: number;
    pago: number;
    fecha: string;
    estado: string;
    empresa: {
        rut: string;
        razon_social: string;
        nombre_de_fantasia: string;
        email_factura: string;
        direccion: string;
        telefono: string;
        contactos: {
            email: string;
            nombre: string;
            cargo: string;
        }[];
        estado: string;
        comuna: {
            id: number;
            nombre: string;
        };
        giros: {
            codigo: number;
            nombre: string;
            afecto_iva: string;
            nombre_categorias: string;
        }[];
    };
    adjudicado: string;
}

export interface Ensayo {
    id: number;
    nombre: string;
    id_servicio: number;
    createdAt: string;
    updatedAt: string;
}

export type CrearEnsayo = {
    nombre: Ensayo['nombre'];
    id_servicio: Ensayo['id_servicio']
}

export type ActualizarEnsayo = CrearEnsayo & {
    id: Ensayo['id']
};

export type CrearPropuestasDeServiciosDto = {
    año: PropuestaServicio['año'];
    pago: PropuestaServicio['pago'];
    fecha: PropuestaServicio['fecha'];
    rut_receptor: PropuestaServicio['empresa']['rut'];
    sub_servicios: string[];
    adjudicado: PropuestaServicio['adjudicado'];
};

export type ActualizarPropuestasDeServiciosDto = CrearPropuestasDeServiciosDto & {
    id: PropuestaServicio['id'];
};

export interface GrupoServicios {
    nombre: string;
    createdAt: string;
    updatedAt: string;
}

export interface SubServicios {
    nombre: string;
    pago_neto: number;
    createdAt: string;
    updatedAt: string;
}