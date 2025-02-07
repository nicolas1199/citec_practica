export const TIPOS_DE_PAGO = {
    OPCION_1: 'FACTURA',
    OPCION_2: 'COMPROBANTE DE PAGO',
    OPCION_3: 'ORDEN DE COMPRA',
} as const;

export type TiposDePago = (typeof TIPOS_DE_PAGO)[keyof typeof TIPOS_DE_PAGO];
