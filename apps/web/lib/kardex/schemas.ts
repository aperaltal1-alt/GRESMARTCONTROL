import { z } from 'zod';

export const KARDEX_MOVEMENT_TYPES = ['ENTRADA', 'SALIDA', 'AJUSTE'] as const;

export const kardexMovementSchema = z.object({
  productoId: z.string().min(1, 'Selecciona un producto'),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  tipo: z.enum(['ENTRADA', 'SALIDA', 'AJUSTE'], {
    required_error: 'Selecciona un tipo de movimiento',
  }),
  cantidad: z.coerce
    .number({ invalid_type_error: 'Debe ser un número' })
    .min(0.0001, 'Debe ser mayor que cero'),
  observacion: z.string().optional(),
});

export type KardexMovementFormValues = z.infer<typeof kardexMovementSchema>;
