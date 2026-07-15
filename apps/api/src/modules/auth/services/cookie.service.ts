import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { REFRESH_TOKEN_COOKIE } from '../constants/auth.constants';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

@Injectable()
export class CookieService {
  constructor(private readonly config: ConfigService) {}

  private get cookieOptions() {
    const isProduction = this.config.get<string>('nodeEnv') === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
      maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_MS,
      path: '/api/auth',
    };
  }

  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, this.cookieOptions);
  }

  clearRefreshTokenCookie(res: Response): void {
    const { secure, sameSite, path } = this.cookieOptions;
    res.clearCookie(REFRESH_TOKEN_COOKIE, { path, secure, sameSite });
  }

  getRefreshTokenFromCookie(cookies: Record<string, string>): string | undefined {
    return cookies[REFRESH_TOKEN_COOKIE];
  }
}
