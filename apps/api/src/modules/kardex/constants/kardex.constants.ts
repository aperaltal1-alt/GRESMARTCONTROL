export const KARDEX_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MOVEMENT_TYPES: ['ENTRADA', 'SALIDA', 'AJUSTE'] as const,
  INVENTORY_STATES: ['NORMAL', 'BAJO', 'SIN STOCK'] as const,
} as const;

export type KardexMovementType = (typeof KARDEX_CONSTANTS.MOVEMENT_TYPES)[number];
export type InventoryState = (typeof KARDEX_CONSTANTS.INVENTORY_STATES)[number];
