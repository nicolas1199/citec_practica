export const ADJUDICADO = {
    OPCION_1: 'SI',
    OPCION_2: 'NO',
} as const;

export type Adjudicado = (typeof ADJUDICADO)[keyof typeof ADJUDICADO];
