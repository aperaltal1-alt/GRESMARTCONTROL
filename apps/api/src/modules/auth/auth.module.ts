import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers';
import { AuthService, CookieService, TokenService } from './services';
import {
  AuthRepository,
  LoginAttemptRepository,
  PasswordResetRepository,
  RefreshTokenRepository,
} from './repositories';
import { JwtStrategy } from './strategies';
import { JwtAuthGuard, RolesGuard } from './guards';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.getOrThrow<string>('jwt.secret'),
        signOptions: {
          expiresIn: config.get<string>('jwt.expiresIn', '15m') as NonNullable<
            NonNullable<JwtModuleOptions['signOptions']>['expiresIn']
          >,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    CookieService,
    AuthRepository,
    RefreshTokenRepository,
    PasswordResetRepository,
    LoginAttemptRepository,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [AuthService, TokenService, JwtModule, PassportModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
