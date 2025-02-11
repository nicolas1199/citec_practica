export const TIPOS_DE_DOCUMENTO = {
    OPCION_1: 'AA',
    OPCION_2: 'EC'
}as const

export type TiposDeDocumento = 
    (typeof TIPOS_DE_DOCUMENTO)[keyof typeof TIPOS_DE_DOCUMENTO];