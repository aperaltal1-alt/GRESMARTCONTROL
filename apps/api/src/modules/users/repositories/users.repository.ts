import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../database/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository {
  findManyByEmpresa(
    empresaId: string,
    options: {
      skip: number;
      take: number;
      search?: string;
      activo?: boolean;
    },
  ) {
    const where: Prisma.UsuarioWhereInput = {
      empresaId,
      deletedAt: null,
      ...(options.activo !== undefined ? { activo: options.activo } : {}),
      ...(options.search
        ? {
            OR: [
              { email: { contains: options.search, mode: 'insensitive' } },
              { nombre: { contains: options.search, mode: 'insensitive' } },
              { apellido: { contains: options.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return this.prisma.usuario.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: [{ activo: 'desc' }, { nombre: 'asc' }],
      include: {
        rol: { select: { codigo: true, nombre: true } },
      },
    });
  }

  countByEmpresa(
    empresaId: string,
    options: { search?: string; activo?: boolean },
  ) {
    const where: Prisma.UsuarioWhereInput = {
      empresaId,
      deletedAt: null,
      ...(options.activo !== undefined ? { activo: options.activo } : {}),
      ...(options.search
        ? {
            OR: [
              { email: { contains: options.search, mode: 'insensitive' } },
              { nombre: { contains: options.search, mode: 'insensitive' } },
              { apellido: { contains: options.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return this.prisma.usuario.count({ where });
  }

  findByIdAndEmpresa(id: string, empresaId: string) {
    return this.prisma.usuario.findFirst({
      where: { id, empresaId, deletedAt: null },
      include: {
        rol: { select: { id: true, codigo: true, nombre: true, activo: true } },
        empresa: { select: { id: true, razonSocial: true, activo: true } },
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  create(data: {
    email: string;
    passwordHash: string;
    nombre: string;
    apellido?: string | null;
    rolId: string;
    empresaId: string;
  }) {
    return this.prisma.usuario.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        nombre: data.nombre.trim(),
        apellido: data.apellido?.trim() || null,
        rolId: data.rolId,
        empresaId: data.empresaId,
        activo: true,
      },
      include: {
        rol: { select: { codigo: true, nombre: true } },
      },
    });
  }

  update(
    id: string,
    data: Partial<{
      email: string;
      passwordHash: string;
      nombre: string;
      apellido: string | null;
      rolId: string;
      activo: boolean;
    }>,
  ) {
    return this.prisma.usuario.update({
      where: { id },
      data: {
        ...(data.email !== undefined ? { email: data.email.toLowerCase().trim() } : {}),
        ...(data.passwordHash !== undefined ? { passwordHash: data.passwordHash } : {}),
        ...(data.nombre !== undefined ? { nombre: data.nombre.trim() } : {}),
        ...(data.apellido !== undefined ? { apellido: data.apellido?.trim() || null } : {}),
        ...(data.rolId !== undefined ? { rolId: data.rolId } : {}),
        ...(data.activo !== undefined ? { activo: data.activo } : {}),
      },
      include: {
        rol: { select: { codigo: true, nombre: true } },
      },
    });
  }

  revokeAllSessions(usuarioId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { usuarioId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
