export interface CrearEmpresaDto {
    readonly rut: string;
    readonly razon_social: string;
    readonly nombre_de_fantasia: string;
    readonly email_factura: string;
    readonly direccion: string;
    readonly id_comunas: number;
    readonly telefono: string;
    readonly contactos: Contacto[];
    readonly giros: number[];
}

export interface Contacto {
    readonly email: string;
    readonly nombre: string;
    readonly cargo: string;
}
