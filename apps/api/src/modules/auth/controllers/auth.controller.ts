import {

  Body,

  Controller,

  Get,

  HttpCode,

  HttpStatus,

  Post,

  Req,

  Res,

} from '@nestjs/common';

import {

  ApiBearerAuth,

  ApiBody,

  ApiCookieAuth,

  ApiOperation,

  ApiResponse,

  ApiTags,

  ApiUnauthorizedResponse,

} from '@nestjs/swagger';

import { Throttle } from '@nestjs/throttler';

import { Request, Response } from 'express';

import { ApiStandardResponse } from '../../../common/decorators/api-standard-response.decorator';

import { Public } from '../../../common/decorators';

import { CurrentUser } from '../../../common/decorators/current-user.decorator';

import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';

import {

  ChangePasswordDto,

  ForgotPasswordDto,

  LoginDto,

  LoginResponseDto,

  ProfileResponseDto,

  RefreshTokenDto,

  ResetPasswordDto,

} from '../dto';

import { AuthService } from '../services/auth.service';

import { CookieService } from '../services/cookie.service';



@ApiTags('Auth')

@Controller('auth')

export class AuthController {

  constructor(

    private readonly authService: AuthService,

    private readonly cookieService: CookieService,

  ) {}



  @Public()

  @Post('login')

  @HttpCode(HttpStatus.OK)

  @Throttle({ default: { limit: 10, ttl: 60000 } })

  @ApiOperation({

    summary: 'Iniciar sesión',

    description:

      'Autentica con email y contraseña. Devuelve access token JWT (15 min) y refresh token (7 días). ' +

      'El refresh token también se envía en cookie HttpOnly `gre_refresh_token`. ' +

      'Rate limit de seguridad: 5 intentos fallidos → bloqueo 15 minutos por email+IP.',

  })

  @ApiBody({ type: LoginDto })

  @ApiStandardResponse(LoginResponseDto, 'Login exitoso')

  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })

  @ApiResponse({ status: 403, description: 'Cuenta bloqueada temporalmente (15 min)' })

  async login(

    @Body() dto: LoginDto,

    @Req() req: Request,

    @Res({ passthrough: true }) res: Response,

  ) {

    const ip = req.ip || req.socket.remoteAddress || '0.0.0.0';

    const userAgent = req.headers['user-agent'];

    const result = await this.authService.login(dto, ip, userAgent);



    this.cookieService.setRefreshTokenCookie(res, result.tokens.refreshToken);



    return result;

  }



  @Public()

  @Post('logout')

  @HttpCode(HttpStatus.OK)

  @ApiOperation({

    summary: 'Cerrar sesión',

    description:

      'Revoca el refresh token (body o cookie HttpOnly) e invalida la sesión en base de datos.',

  })

  @ApiBody({ type: RefreshTokenDto, required: false })

  @ApiCookieAuth('refresh-token')

  @ApiResponse({

    status: 200,

    description: 'Sesión cerrada correctamente',

    schema: {

      example: {

        success: true,

        message: 'Operación exitosa',

        data: { message: 'Sesión cerrada correctamente' },

        timestamp: '2026-07-08T03:00:00.000Z',

      },

    },

  })

  async logout(

    @Body() dto: RefreshTokenDto,

    @Req() req: Request,

    @Res({ passthrough: true }) res: Response,

  ) {

    const refreshToken =

      dto.refreshToken ||

      this.cookieService.getRefreshTokenFromCookie(req.cookies ?? {});



    const result = await this.authService.logout(refreshToken);

    this.cookieService.clearRefreshTokenCookie(res);



    return result;

  }



  @Public()

  @Post('refresh')

  @HttpCode(HttpStatus.OK)

  @ApiOperation({

    summary: 'Renovar access token',

    description:

      'Intercambia un refresh token válido por un nuevo par access+refresh (rotación de tokens). ' +

      'Acepta token en body o cookie HttpOnly.',

  })

  @ApiBody({ type: RefreshTokenDto, required: false })

  @ApiCookieAuth('refresh-token')

  @ApiResponse({

    status: 200,

    description: 'Tokens renovados',

    schema: {

      example: {

        success: true,

        message: 'Operación exitosa',

        data: {

          tokens: {

            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',

            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',

            tokenType: 'Bearer',

            expiresIn: 900,

          },

        },

        timestamp: '2026-07-08T03:00:00.000Z',

      },

    },

  })

  @ApiUnauthorizedResponse({ description: 'Refresh token inválido, expirado o revocado' })

  async refresh(

    @Body() dto: RefreshTokenDto,

    @Req() req: Request,

    @Res({ passthrough: true }) res: Response,

  ) {

    const refreshToken =

      dto.refreshToken ||

      this.cookieService.getRefreshTokenFromCookie(req.cookies ?? {});



    const result = await this.authService.refresh(

      refreshToken!,

      req.ip,

      req.headers['user-agent'],

    );



    this.cookieService.setRefreshTokenCookie(res, result.tokens.refreshToken);



    return result;

  }



  @Public()

  @Post('forgot-password')

  @HttpCode(HttpStatus.OK)

  @Throttle({ default: { limit: 3, ttl: 60000 } })

  @ApiOperation({

    summary: 'Recuperación de contraseña',

    description:

      'Genera un token de recuperación (MVP: simulado, se registra en logs del servidor). ' +

      'Siempre responde igual para no revelar si el email existe.',

  })

  @ApiBody({ type: ForgotPasswordDto })

  @ApiResponse({

    status: 200,

    description: 'Solicitud procesada',

    schema: {

      example: {

        success: true,

        message: 'Operación exitosa',

        data: {

          message:

            'Si el email está registrado, recibirá instrucciones para restablecer su contraseña.',

        },

        timestamp: '2026-07-08T03:00:00.000Z',

      },

    },

  })

  async forgotPassword(@Body() dto: ForgotPasswordDto) {

    return this.authService.forgotPassword(dto);

  }



  @Public()

  @Post('reset-password')

  @HttpCode(HttpStatus.OK)

  @ApiOperation({

    summary: 'Restablecer contraseña',

    description:

      'Establece una nueva contraseña con el token de recuperación. Revoca todas las sesiones activas.',

  })

  @ApiBody({ type: ResetPasswordDto })

  @ApiResponse({

    status: 200,

    description: 'Contraseña restablecida',

    schema: {

      example: {

        success: true,

        message: 'Operación exitosa',

        data: { message: 'Contraseña restablecida correctamente' },

        timestamp: '2026-07-08T03:00:00.000Z',

      },

    },

  })

  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })

  async resetPassword(@Body() dto: ResetPasswordDto) {

    return this.authService.resetPassword(dto);

  }



  @Post('change-password')

  @HttpCode(HttpStatus.OK)

  @ApiBearerAuth('access-token')

  @ApiOperation({

    summary: 'Cambiar contraseña',

    description:

      'Cambia la contraseña del usuario autenticado. Revoca todas las sesiones activas.',

  })

  @ApiBody({ type: ChangePasswordDto })

  @ApiResponse({

    status: 200,

    description: 'Contraseña actualizada',

    schema: {

      example: {

        success: true,

        message: 'Operación exitosa',

        data: { message: 'Contraseña actualizada correctamente' },

        timestamp: '2026-07-08T03:00:00.000Z',

      },

    },

  })

  @ApiResponse({ status: 400, description: 'Contraseña actual incorrecta o igual a la nueva' })

  @ApiUnauthorizedResponse({ description: 'No autenticado' })

  async changePassword(

    @CurrentUser() user: AuthenticatedUser,

    @Body() dto: ChangePasswordDto,

  ) {

    return this.authService.changePassword(user.id, dto);

  }



  @Get('profile')

  @ApiBearerAuth('access-token')

  @ApiOperation({

    summary: 'Perfil del usuario autenticado',

    description:

      'Devuelve datos del usuario, empresa, rol y permisos RBAC granulares. ' +

      'Valida que usuario, rol y empresa estén activos.',

  })

  @ApiStandardResponse(ProfileResponseDto, 'Perfil del usuario')

  @ApiUnauthorizedResponse({ description: 'Token inválido o entidad inactiva' })

  async getProfile(@CurrentUser() user: AuthenticatedUser) {

    return this.authService.getProfile(user.id);

  }

}


