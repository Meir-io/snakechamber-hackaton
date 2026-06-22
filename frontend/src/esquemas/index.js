import { z } from 'zod'

export const esquemaRfc = z.object({
  rfc: z.string().regex(/^[A-Z&]{3,4}\d{6}[A-Z\d]{3}$/, 'RFC inválido'),
  razonSocial: z.string().min(1, 'Razón social requerida'),
  fechaConstitucion: z.string().optional(),
  esEfos: z.boolean().default(false),
})

export const esquemaContrato = z.object({
  id: z.string().uuid(),
  numero: z.string().min(1),
  monto: z.number().positive('El monto debe ser positivo'),
  fecha: z.string(),
  descripcion: z.string().optional(),
  organismoContratante: z.string().min(1),
  proveedorRfc: z.string(),
  municipio: z.string().optional(),
  riesgo: z.enum(['bajo', 'medio', 'alto', 'critico']).default('bajo'),
})

export const esquemaMunicipio = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1),
  totalContratos: z.number().int().nonnegative(),
  totalMonto: z.number().nonnegative(),
  indiceRiesgo: z.number().min(0).max(100),
  efosDetectados: z.number().int().nonnegative(),
})

export const esquemaExtraccionOcr = z.object({
  rfcEmisor: z.string().optional(),
  rfcReceptor: z.string().optional(),
  monto: z.number().optional(),
  fecha: z.string().optional(),
  descripcion: z.string().optional(),
  confianza: z.number().min(0).max(1),
})

export const esquemaFiltroGrafo = z.object({
  mostrarSoloEfos: z.boolean().default(false),
  montoMinimo: z.number().nonnegative().default(0),
  densidadCluster: z.number().min(0).max(1).default(0.5),
})
