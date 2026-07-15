import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../database/base.repository';

@Injectable()
export class AuthRepository extends BaseRepository {
  findUserByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        rol: { select: { id: true, codigo: true, nombre: true, activo: true } },
        empresa: { select: { id: true, razonSocial: true, activo: true, deletedAt: true } },
      },
    });
  }

  findUserById(id: string) {
    return this.prisma.usuario.findUnique({
      where: { id },
      include: {
        rol: {
          select: {
            id: true,
            codigo: true,
            nombre: true,
            activo: true,
            rolPermisos: { include: { permiso: { select: { codigo: true, activo: true } } } },
          },
        },
        empresa: { select: { id: true, razonSocial: true, activo: true, deletedAt: true } },
      },
    });
  }

  updateLastLogin(userId: string) {
    return this.prisma.usuario.update({
      where: { id: userId },
      data: { ultimoLoginAt: new Date() },
    });
  }

  updatePassword(userId: string, passwordHash: string) {
    return this.prisma.usuario.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
