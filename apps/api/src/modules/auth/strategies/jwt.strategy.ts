import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthenticatedUser, JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly authRepo: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => req.cookies?.['gre_access_token'] as string | null,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.authRepo.findUserById(payload.sub);

    if (!user || !user.activo || user.deletedAt) {
      throw new UnauthorizedException('Usuario inactivo o no encontrado');
    }
    if (!user.rol.activo) {
      throw new UnauthorizedException('Rol inactivo');
    }
    if (!user.empresa.activo || user.empresa.deletedAt) {
      throw new UnauthorizedException('Empresa inactiva');
    }

    return {
      id: payload.sub,
      sub: payload.sub,
      email: payload.email,
      nombre: payload.nombre,
      apellido: payload.apellido,
      rol: payload.rol,
      empresaId: payload.empresaId,
    };
  }
}
