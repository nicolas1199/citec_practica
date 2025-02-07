export const ESTADOS = {
    OPCION_1: 'ACTIVO',
    OPCION_2: 'ELIMINADO',
} as const;

export type Estados = (typeof ESTADOS)[keyof typeof ESTADOS];
