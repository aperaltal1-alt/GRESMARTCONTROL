import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma';

/**
 * Clase base para repositorios — encapsula acceso a Prisma.
 * Los módulos de dominio extenderán esta clase en Fase 4.2+.
 */
@Injectable()
export abstract class BaseRepository {
  constructor(protected readonly prisma: PrismaService) {}
}
