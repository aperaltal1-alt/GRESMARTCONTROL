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
  CreateProductDto,
  ListProductsQueryDto,
  PaginatedProductsDto,
  ProductResponseDto,
  UpdateProductDto,
} from '../dto';
import { ProductsService } from '../services/products.service';

@ApiTags('Products')
@ApiBearerAuth('access-token')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles('ADMIN', 'SUPERVISOR', 'CONSULTA')
  @ApiOperation({
    summary: 'Listar productos',
    description: 'Listado paginado con búsqueda por código/nombre, filtro activo y categoría.',
  })
  @ApiStandardResponse(PaginatedProductsDto, 'Listado de productos')
  listProducts(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListProductsQueryDto,
  ) {
    return this.productsService.listProducts(user.empresaId, query);
  }

  @Get(':id')
  @Roles('ADMIN', 'SUPERVISOR', 'CONSULTA')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiStandardResponse(ProductResponseDto, 'Detalle del producto')
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  getProductById(
    @Param('id', ParseUuidPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.productsService.getProductById(id, user.empresaId);
  }

  @Post()
  @Roles('ADMIN', 'SUPERVISOR')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear producto',
    description: 'Registra un producto con stock inicial. Código único por empresa.',
  })
  @ApiStandardResponse(ProductResponseDto, 'Producto creado')
  @ApiResponse({ status: 409, description: 'Código duplicado' })
  createProduct(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.productsService.createProduct(dto, user.empresaId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Editar producto' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiStandardResponse(ProductResponseDto, 'Producto actualizado')
  updateProduct(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.productsService.updateProduct(id, dto, user.empresaId);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPERVISOR')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Desactivar producto (soft delete)',
    description: 'Marca deletedAt y activo=false. No elimina físicamente.',
  })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto desactivado',
    schema: {
      example: {
        success: true,
        message: 'Operación exitosa',
        data: { message: 'Producto desactivado correctamente' },
        timestamp: '2026-07-08T03:00:00.000Z',
      },
    },
  })
  deleteProduct(
    @Param('id', ParseUuidPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.productsService.deleteProduct(id, user.empresaId);
  }
}
