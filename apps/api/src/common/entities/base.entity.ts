/**
 * Entidad base de dominio — referencia para módulos de Fase 4.2+.
 * Las entidades de negocio mapean modelos Prisma a objetos de dominio.
 */
export abstract class BaseEntity {
  id!: string;
  createdAt?: Date;
  updatedAt?: Date;
}
