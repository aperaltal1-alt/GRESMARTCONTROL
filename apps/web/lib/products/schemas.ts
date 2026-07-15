import { z } from 'zod';

export const productFormSchema = z.object({
  codigo: z
    .string()
    .min(1, 'El código es obligatorio')
    .max(50, 'Máximo 50 caracteres'),
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(255, 'Máximo 255 caracteres'),
  categoria: z.string().min(1, 'La categoría es obligatoria'),
  unidad: z.string().min(1, 'La unidad es obligatoria'),
  stockActual: z.coerce
    .number({ invalid_type_error: 'Debe ser un número' })
    .min(0, 'No puede ser negativo'),
  stockMinimo: z.coerce
    .number({ invalid_type_error: 'Debe ser un número' })
    .min(0, 'No puede ser negativo'),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const COMMON_UNITS = ['UND', 'KG', 'LT', 'GR', 'ML', 'CJ', 'PAQ'] as const;
