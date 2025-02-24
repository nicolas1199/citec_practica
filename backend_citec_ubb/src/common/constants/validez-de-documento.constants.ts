/**
 * Estos son los estados que 
 * puede tener un informe
 */
export const VALIDEZ_DE_DOCUMENTO = {
    OPCION_1: 'VALIDADO',
    OPCION_2: 'NO VALIDO',
    OPCION_3: 'VALIDANDO',
} as const

export type ValidezDeDocumento =
    (typeof VALIDEZ_DE_DOCUMENTO)[keyof typeof VALIDEZ_DE_DOCUMENTO];