import { z } from 'zod';

export const greDetalleSchema = z.object({
  productoId: z.string().min(1, 'Selecciona un producto'),
  cantidad: z.coerce
    .number({ invalid_type_error: 'Debe ser un número' })
    .min(0.0001, 'Debe ser mayor que cero'),
});

export const greFormSchema = z.object({
  numero: z.string().min(1, 'El número es obligatorio').max(20),
  serie: z.string().min(1, 'La serie es obligatoria').max(10),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  ruc: z
    .string()
    .regex(/^\d{11}$/, 'El RUC debe tener 11 dígitos')
    .optional()
    .or(z.literal('')),
  transportista: z.string().max(255).optional(),
  origen: z.string().max(500).optional(),
  destino: z.string().max(500).optional(),
  observaciones: z.string().optional(),
  estado: z.enum(['PENDIENTE', 'CONCILIADA', 'CON_DIFERENCIA']).optional(),
  productos: z.array(greDetalleSchema).min(1, 'Agrega al menos un producto'),
});

export type GreFormValues = z.infer<typeof greFormSchema>;

export const GRE_ESTADOS = ['PENDIENTE', 'CONCILIADA', 'CON_DIFERENCIA'] as const;

export const COMMON_SERIES = ['T001', 'T002', 'V001'] as const;
