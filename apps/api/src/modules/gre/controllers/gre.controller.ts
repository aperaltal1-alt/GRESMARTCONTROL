import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
  CreateGreDto,
  GreResponseDto,
  GreUploadResponseDto,
  ListGreQueryDto,
  PaginatedGreDto,
  UpdateGreDto,
} from '../dto';
import { GreService } from '../services';
import { UploadedGreFile } from '../interfaces';

@ApiTags('GRE')
@ApiBearerAuth('access-token')
@Controller('gre')
export class GreController {
  constructor(private readonly greService: GreService) {}

  @Get()
  @Roles('ADMIN', 'SUPERVISOR', 'CONSULTA')
  @ApiOperation({
    summary: 'Listar GRE',
    description:
      'Listado paginado con filtros por número, serie, estado, rango de fechas y RUC emisor.',
  })
  @ApiStandardResponse(PaginatedGreDto, 'Listado de GRE')
  listGre(@CurrentUser() user: AuthenticatedUser, @Query() query: ListGreQueryDto) {
    return this.greService.listGre(user.empresaId, query);
  }

  @Get(':id')
  @Roles('ADMIN', 'SUPERVISOR', 'CONSULTA')
  @ApiOperation({ summary: 'Obtener GRE por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la GRE' })
  @ApiStandardResponse(GreResponseDto, 'Detalle de la GRE')
  @ApiResponse({ status: 404, description: 'GRE no encontrada' })
  getGreById(
    @Param('id', ParseUuidPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.greService.getGreById(id, user.empresaId);
  }

  @Post()
  @Roles('ADMIN', 'SUPERVISOR')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear GRE',
    description:
      'Registra una GRE con detalle de productos. Número único por serie y empresa.',
  })
  @ApiStandardResponse(GreResponseDto, 'GRE creada')
  @ApiResponse({ status: 409, description: 'Número duplicado para la serie' })
  @ApiResponse({ status: 400, description: 'Validación o producto inexistente' })
  createGre(@Body() dto: CreateGreDto, @CurrentUser() user: AuthenticatedUser) {
    return this.greService.createGre(dto, user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPERVISOR')
  @ApiOperation({
    summary: 'Editar GRE',
    description: 'Actualiza cabecera y opcionalmente reemplaza el detalle de productos.',
  })
  @ApiParam({ name: 'id', description: 'UUID de la GRE' })
  @ApiStandardResponse(GreResponseDto, 'GRE actualizada')
  @ApiResponse({ status: 404, description: 'GRE no encontrada' })
  @ApiResponse({ status: 409, description: 'Número duplicado para la serie' })
  updateGre(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateGreDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.greService.updateGre(id, dto, user);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPERVISOR')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Desactivar GRE (soft delete)',
    description: 'Marca deletedAt y activo=false. No elimina físicamente.',
  })
  @ApiParam({ name: 'id', description: 'UUID de la GRE' })
  @ApiResponse({
    status: 200,
    description: 'GRE desactivada',
    schema: {
      example: {
        success: true,
        message: 'Operación exitosa',
        data: { message: 'GRE desactivada correctamente' },
        timestamp: '2026-07-08T03:00:00.000Z',
      },
    },
  })
  deleteGre(
    @Param('id', ParseUuidPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.greService.deleteGre(id, user.empresaId);
  }

  @Post(':id/upload')
  @Roles('ADMIN', 'SUPERVISOR')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Subir archivo XML o PDF',
    description:
      'Almacena el archivo sin procesarlo. Solo se aceptan XML y PDF dentro del tamaño máximo configurado.',
  })
  @ApiParam({ name: 'id', description: 'UUID de la GRE' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo XML o PDF',
        },
      },
    },
  })
  @ApiStandardResponse(GreUploadResponseDto, 'Archivo cargado')
  @ApiResponse({ status: 404, description: 'GRE no encontrada' })
  @ApiResponse({ status: 415, description: 'Tipo de archivo no permitido' })
  @ApiResponse({ status: 413, description: 'Archivo demasiado grande' })
  uploadFile(
    @Param('id', ParseUuidPipe) id: string,
    @UploadedFile() file: UploadedGreFile,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.greService.uploadFile(id, file, user);
  }
}
