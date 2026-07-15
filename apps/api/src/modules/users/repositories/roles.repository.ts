import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../database/base.repository';
import { MvpUserRole } from '../constants';

@Injectable()
export class RolesRepository extends BaseRepository {
  findSystemRoleByCodigo(codigo: MvpUserRole) {
    return this.prisma.rol.findFirst({
      where: {
        codigo,
        empresaId: null,
        esSistema: true,
        activo: true,
      },
    });
  }

  findAllSystemRoles() {
    return this.prisma.rol.findMany({
      where: {
        codigo: { in: ['ADMIN', 'SUPERVISOR', 'CONSULTA'] },
        empresaId: null,
        esSistema: true,
        activo: true,
      },
      orderBy: { codigo: 'asc' },
    });
  }
}
