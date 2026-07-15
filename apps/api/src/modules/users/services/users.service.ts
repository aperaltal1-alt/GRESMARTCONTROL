import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AUTH_CONSTANTS } from '../../auth/constants/auth.constants';
import { MvpUserRole, USER_CONSTANTS } from '../constants';
import {
  CreateUserDto,
  ListUsersQueryDto,
  UpdateUserDto,
  UpdateUserStatusDto,
} from '../dto';
import { PaginatedUsers, RoleOption, UserListItem } from '../interfaces';
import { RolesRepository, UsersRepository } from '../repositories';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly rolesRepo: RolesRepository,
  ) {}

  async listUsers(empresaId: string, query: ListUsersQueryDto): Promise<PaginatedUsers> {
    const page = query.page ?? USER_CONSTANTS.DEFAULT_PAGE;
    const limit = query.limit ?? USER_CONSTANTS.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.usersRepo.findManyByEmpresa(empresaId, {
        skip,
        take: limit,
        search: query.search?.trim(),
        activo: query.activo,
      }),
      this.usersRepo.countByEmpresa(empresaId, {
        search: query.search?.trim(),
        activo: query.activo,
      }),
    ]);

    return {
      items: users.map((user) => this.toUserResponse(user)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getRoles(): Promise<RoleOption[]> {
    const roles = await this.rolesRepo.findAllSystemRoles();
    return roles.map((rol) => ({
      codigo: rol.codigo as MvpUserRole,
      nombre: rol.nombre,
      descripcion: rol.descripcion,
    }));
  }

  async getUserById(id: string, empresaId: string): Promise<UserListItem> {
    const user = await this.usersRepo.findByIdAndEmpresa(id, empresaId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.toUserResponse(user);
  }

  async createUser(
    dto: CreateUserDto,
    empresaId: string,
    actorId: string,
  ): Promise<UserListItem> {
    void actorId;

    const existing = await this.usersRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    const rol = await this.rolesRepo.findSystemRoleByCodigo(dto.rol);
    if (!rol) {
      throw new BadRequestException(`El rol ${dto.rol} no está disponible`);
    }

    const passwordHash = await bcrypt.hash(dto.password, AUTH_CONSTANTS.BCRYPT_ROUNDS);
    const user = await this.usersRepo.create({
      email: dto.email,
      passwordHash,
      nombre: dto.nombre,
      apellido: dto.apellido,
      rolId: rol.id,
      empresaId,
    });

    return this.toUserResponse(user);
  }

  async updateUser(
    id: string,
    dto: UpdateUserDto,
    empresaId: string,
    actorId: string,
  ): Promise<UserListItem> {
    const user = await this.usersRepo.findByIdAndEmpresa(id, empresaId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (dto.email && dto.email.toLowerCase().trim() !== user.email) {
      const existing = await this.usersRepo.findByEmail(dto.email);
      if (existing && existing.id !== user.id) {
        throw new ConflictException('Ya existe un usuario con ese email');
      }
    }

    if (dto.rol && dto.rol !== user.rol.codigo && id === actorId) {
      throw new ForbiddenException('No puede cambiar su propio rol');
    }

    let rolId: string | undefined;
    if (dto.rol && dto.rol !== user.rol.codigo) {
      const rol = await this.rolesRepo.findSystemRoleByCodigo(dto.rol);
      if (!rol) {
        throw new BadRequestException(`El rol ${dto.rol} no está disponible`);
      }
      rolId = rol.id;
    }

    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, AUTH_CONSTANTS.BCRYPT_ROUNDS);
      await this.usersRepo.revokeAllSessions(user.id);
    }

    const updated = await this.usersRepo.update(user.id, {
      ...(dto.email !== undefined ? { email: dto.email } : {}),
      ...(dto.nombre !== undefined ? { nombre: dto.nombre } : {}),
      ...(dto.apellido !== undefined ? { apellido: dto.apellido ?? null } : {}),
      ...(rolId ? { rolId } : {}),
      ...(passwordHash ? { passwordHash } : {}),
    });

    return this.toUserResponse(updated);
  }

  async updateUserStatus(
    id: string,
    dto: UpdateUserStatusDto,
    empresaId: string,
    actorId: string,
  ): Promise<UserListItem> {
    const user = await this.usersRepo.findByIdAndEmpresa(id, empresaId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (id === actorId && !dto.activo) {
      throw new ForbiddenException('No puede desactivar su propia cuenta');
    }

    if (user.activo === dto.activo) {
      return this.toUserResponse(user);
    }

    const updated = await this.usersRepo.update(user.id, { activo: dto.activo });

    if (!dto.activo) {
      await this.usersRepo.revokeAllSessions(user.id);
    }

    return this.toUserResponse(updated);
  }

  private toUserResponse(user: {
    id: string;
    email: string;
    nombre: string;
    apellido: string | null;
    activo: boolean;
    ultimoLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    rol: { codigo: string; nombre: string };
  }): UserListItem {
    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol.codigo as MvpUserRole,
      rolNombre: user.rol.nombre,
      activo: user.activo,
      ultimoLoginAt: user.ultimoLoginAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
