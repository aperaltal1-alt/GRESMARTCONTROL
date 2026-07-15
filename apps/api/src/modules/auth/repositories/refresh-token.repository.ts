import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../database/base.repository';

@Injectable()
export class RefreshTokenRepository extends BaseRepository {
  create(data: {
    usuarioId: string;
    tokenHash: string;
    expiresAt: Date;
    ip?: string;
    userAgent?: string;
  }) {
    return this.prisma.refreshToken.create({ data });
  }

  findValidByHash(tokenHash: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        usuario: {
          include: {
            rol: { select: { codigo: true, activo: true } },
            empresa: { select: { id: true, razonSocial: true, activo: true, deletedAt: true } },
          },
        },
      },
    });
  }

  revokeByHash(tokenHash: string) {
    return this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  revokeAllForUser(usuarioId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { usuarioId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
