import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../database/base.repository';

@Injectable()
export class PasswordResetRepository extends BaseRepository {
  create(data: { usuarioId: string; tokenHash: string; expiresAt: Date }) {
    return this.prisma.passwordResetToken.create({ data });
  }

  findValidByHash(tokenHash: string) {
    return this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { usuario: true },
    });
  }

  markAsUsed(id: string) {
    return this.prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  invalidateAllForUser(usuarioId: string) {
    return this.prisma.passwordResetToken.updateMany({
      where: { usuarioId, usedAt: null },
      data: { usedAt: new Date() },
    });
  }
}
