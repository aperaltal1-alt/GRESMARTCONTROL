import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiStandardResponse } from '../../../common/decorators/api-standard-response.decorator';
import { ParseUuidPipe } from '../../../common/pipes/parse-uuid.pipe';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import {
  CreateUserDto,
  ListUsersQueryDto,
  PaginatedUsersDto,
  UpdateUserDto,
  UpdateUserStatusDto,
  UserResponseDto,
} from '../dto';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Roles('ADMIN')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar usuarios de la empresa',
    description: 'Solo ADMIN. Usuarios filtrados por la empresa del token JWT.',
  })
  @ApiStandardResponse(PaginatedUsersDto, 'Listado paginado de usuarios')
  listUsers(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListUsersQueryDto,
  ) {
    return this.usersService.listUsers(user.empresaId, query);
  }

  @Get('roles')
  @ApiOperation({
    summary: 'Roles disponibles para asignación',
    description: 'Devuelve ADMIN, SUPERVISOR y CONSULTA.',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles del MVP',
    schema: {
      example: {
        success: true,
        message: 'Operación exitosa',
        data: [
          { codigo: 'ADMIN', nombre: 'Administrador', descripcion: 'Acceso total al sistema' },
          { codigo: 'SUPERVISOR', nombre: 'Supervisor', descripcion: 'Operaciones y conciliación' },
          { codigo: 'CONSULTA', nombre: 'Consulta', descripcion: 'Solo lectura' },
        ],
        timestamp: '2026-07-08T03:00:00.000Z',
      },
    },
  })
  getRoles() {
    return this.usersService.getRoles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiStandardResponse(UserResponseDto, 'Detalle del usuario')
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  getUserById(
    @Param('id', ParseUuidPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.getUserById(id, user.empresaId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear usuario',
    description: 'Crea un usuario en la empresa del administrador autenticado.',
  })
  @ApiStandardResponse(UserResponseDto, 'Usuario creado')
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  createUser(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.createUser(dto, user.empresaId, user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Editar usuario',
    description: 'Actualiza datos básicos, rol y opcionalmente contraseña.',
  })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiStandardResponse(UserResponseDto, 'Usuario actualizado')
  updateUser(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.updateUser(id, dto, user.empresaId, user.id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Activar o desactivar usuario',
    description: 'Al desactivar se revocan todas las sesiones activas.',
  })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiStandardResponse(UserResponseDto, 'Estado actualizado')
  @ApiResponse({ status: 403, description: 'No puede desactivarse a sí mismo' })
  updateUserStatus(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.updateUserStatus(id, dto, user.empresaId, user.id);
  }
}
