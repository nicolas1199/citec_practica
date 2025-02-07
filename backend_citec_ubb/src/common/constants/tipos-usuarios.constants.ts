/**
 * Estos son los roles de usuario o
 * tipos de usuario que se pueden tener en la aplicación.
 */
export const TIPOS_DE_USUARIO = {
    OPCION_1: 'ADMINISTRADOR',
    OPCION_2: 'CLIENTE',
    OPCION_3: 'CONTABLE',
} as const;

export type TiposDeUsuario =
    (typeof TIPOS_DE_USUARIO)[keyof typeof TIPOS_DE_USUARIO];
