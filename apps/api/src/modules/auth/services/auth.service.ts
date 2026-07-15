import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PinoLogger } from 'nestjs-pino';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import {
  AuthRepository,
  LoginAttemptRepository,
  PasswordResetRepository,
  RefreshTokenRepository,
} from '../repositories';
import { TokenService } from './token.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
} from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly passwordResetRepo: PasswordResetRepository,
    private readonly loginAttemptRepo: LoginAttemptRepository,
    private readonly tokenService: TokenService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async login(dto: LoginDto, ip: string, userAgent?: string) {
    const email = dto.email.toLowerCase().trim();

    const blockedUntil = await this.loginAttemptRepo.getBlockedUntil(email, ip);
    if (blockedUntil) {
      const minutesLeft = Math.ceil((blockedUntil.getTime() - Date.now()) / 60000);
      throw new ForbiddenException(
        `Cuenta bloqueada temporalmente. Intente nuevamente en ${minutesLeft} minuto(s).`,
      );
    }

    const user = await this.authRepo.findUserByEmail(email);

    if (!user) {
      await this.loginAttemptRepo.recordFailedAttempt(email, ip);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    this.validateUserState(user);

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      await this.loginAttemptRepo.recordFailedAttempt(email, ip);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.loginAttemptRepo.clearAttempts(email, ip);
    await this.authRepo.updateLastLogin(user.id);

    const tokens = await this.tokenService.generateTokenPair({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol.codigo,
      empresaId: user.empresaId,
    });

    await this.refreshTokenRepo.create({
      usuarioId: user.id,
      tokenHash: this.tokenService.hashToken(tokens.refreshToken),
      expiresAt: this.tokenService.getRefreshExpirationDate(),
      ip,
      userAgent,
    });

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol.codigo,
        empresaId: user.empresaId,
        empresaNombre: user.empresa.razonSocial,
      },
    };
  }

  async refresh(refreshToken: string, ip?: string, userAgent?: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token requerido');
    }

    let payload: { sub: string };
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const tokenHash = this.tokenService.hashToken(refreshToken);
    const stored = await this.refreshTokenRepo.findValidByHash(tokenHash);

    if (!stored) {
      throw new UnauthorizedException('Refresh token revocado o no encontrado');
    }

    const user = stored.usuario;
    this.validateUserState(user);

    await this.refreshTokenRepo.revokeByHash(tokenHash);

    const tokens = await this.tokenService.generateTokenPair({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol.codigo,
      empresaId: user.empresaId,
    });

    await this.refreshTokenRepo.create({
      usuarioId: user.id,
      tokenHash: this.tokenService.hashToken(tokens.refreshToken),
      expiresAt: this.tokenService.getRefreshExpirationDate(),
      ip,
      userAgent,
    });

    return { tokens };
  }

  async logout(refreshToken?: string, userId?: string) {
    if (refreshToken) {
      const tokenHash = this.tokenService.hashToken(refreshToken);
      await this.refreshTokenRepo.revokeByHash(tokenHash);
    } else if (userId) {
      await this.refreshTokenRepo.revokeAllForUser(userId);
    }

    return { message: 'Sesión cerrada correctamente' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.authRepo.findUserByEmail(email);

    if (user && user.activo && !user.deletedAt) {
      const plainToken = this.tokenService.generateSecureToken();
      const tokenHash = this.tokenService.hashToken(plainToken);

      await this.passwordResetRepo.invalidateAllForUser(user.id);
      await this.passwordResetRepo.create({
        usuarioId: user.id,
        tokenHash,
        expiresAt: this.tokenService.getPasswordResetExpirationDate(),
      });

      this.logger.info(
        { email, resetToken: plainToken },
        '[MVP] Token de recuperación generado (simular envío por email)',
      );
    }

    return {
      message:
        'Si el email está registrado, recibirá instrucciones para restablecer su contraseña.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.tokenService.hashToken(dto.token);
    const record = await this.passwordResetRepo.findValidByHash(tokenHash);

    if (!record) {
      throw new BadRequestException('Token de recuperación inválido o expirado');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, AUTH_CONSTANTS.BCRYPT_ROUNDS);
    await this.authRepo.updatePassword(record.usuarioId, passwordHash);
    await this.passwordResetRepo.markAsUsed(record.id);
    await this.refreshTokenRepo.revokeAllForUser(record.usuarioId);

    return { message: 'Contraseña restablecida correctamente' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.authRepo.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    const samePassword = await bcrypt.compare(dto.newPassword, user.passwordHash);
    if (samePassword) {
      throw new BadRequestException('La nueva contraseña debe ser diferente a la actual');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, AUTH_CONSTANTS.BCRYPT_ROUNDS);
    await this.authRepo.updatePassword(userId, passwordHash);
    await this.refreshTokenRepo.revokeAllForUser(userId);

    return { message: 'Contraseña actualizada correctamente' };
  }

  async getProfile(userId: string) {
    const user = await this.authRepo.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    this.validateUserState(user);

    const permisos = user.rol.rolPermisos
      .filter((rp) => rp.permiso.activo)
      .map((rp) => rp.permiso.codigo);

    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol.codigo,
      empresaId: user.empresaId,
      empresaNombre: user.empresa.razonSocial,
      ultimoLoginAt: user.ultimoLoginAt?.toISOString() ?? null,
      permisos,
    };
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = await this.authRepo.findUserById(userId);
    if (!user) return false;
    return bcrypt.compare(password, user.passwordHash);
  }

  private validateUserState(user: {
    activo: boolean;
    deletedAt: Date | null;
    rol: { activo: boolean };
    empresa: { activo: boolean; deletedAt: Date | null };
  }) {
    if (!user.activo || user.deletedAt) {
      throw new ForbiddenException('La cuenta de usuario está inactiva');
    }
    if (!user.rol.activo) {
      throw new ForbiddenException('El rol asignado está inactivo');
    }
    if (!user.empresa.activo || user.empresa.deletedAt) {
      throw new ForbiddenException('La empresa asociada está inactiva');
    }
  }
}
