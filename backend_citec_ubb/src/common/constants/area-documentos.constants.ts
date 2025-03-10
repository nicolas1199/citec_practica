/**
 * Estos son los codigos de area que
 * puede tener un informe
 */
export const AREAS_DE_DOCUMENTO = {
    OPCION_1: 'AA',
    OPCION_2: 'EC',
} as const;

export type AreaDeDocumento =
    (typeof AREAS_DE_DOCUMENTO)[keyof typeof AREAS_DE_DOCUMENTO];
