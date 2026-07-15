import { createHash, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { AuthTokensResponse, TokenPair } from '../interfaces';
import { JwtPayload } from '../../../common/interfaces';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: { sub: string }): string {
    return this.jwtService.sign(
      { sub: payload.sub, jti: randomBytes(16).toString('hex') },
      {
        secret: this.config.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: this.config.get<string>('jwt.refreshExpiresIn', '7d') as `${number}d`,
      },
    );
  }

  verifyRefreshToken(token: string): { sub: string; jti?: string } {
    return this.jwtService.verify<{ sub: string; jti?: string }>(token, {
      secret: this.config.getOrThrow<string>('jwt.refreshSecret'),
    });
  }

  async generateTokenPair(user: {
    id: string;
    email: string;
    nombre: string;
    apellido?: string | null;
    rol: string;
    empresaId: string;
  }): Promise<AuthTokensResponse> {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido ?? undefined,
      rol: user.rol,
      empresaId: user.empresaId,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken({ sub: user.id });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 15 * 60,
    };
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }

  getRefreshExpirationDate(): Date {
    return new Date(Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_MS);
  }

  getPasswordResetExpirationDate(): Date {
    return new Date(Date.now() + AUTH_CONSTANTS.PASSWORD_RESET_EXPIRES_MS);
  }
}
