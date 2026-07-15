import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PRODUCT_CONSTANTS } from '../constants';
import { CreateProductDto, ListProductsQueryDto, UpdateProductDto } from '../dto';
import { PaginatedProducts, ProductItem } from '../interfaces';
import { CatalogRepository, ProductsRepository } from '../repositories';

type ProductRecord = {
  id: string;
  codigo: string;
  nombre: string;
  stockMinimo: Prisma.Decimal;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoria: { codigo: string; nombre: string };
  unidadMedida: { codigo: string; nombre: string };
  kardex: { saldoActual: Prisma.Decimal } | null;
};

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepo: ProductsRepository,
    private readonly catalogRepo: CatalogRepository,
  ) {}

  async listProducts(empresaId: string, query: ListProductsQueryDto): Promise<PaginatedProducts> {
    const page = query.page ?? PRODUCT_CONSTANTS.DEFAULT_PAGE;
    const limit = query.limit ?? PRODUCT_CONSTANTS.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const filters = {
      search: query.search?.trim(),
      activo: query.activo,
      categoria: query.categoria?.trim(),
    };

    const [products, total] = await Promise.all([
      this.productsRepo.findManyByEmpresa(empresaId, { skip, take: limit, ...filters }),
      this.productsRepo.countByEmpresa(empresaId, filters),
    ]);

    return {
      items: products.map((p) => this.toProductResponse(p)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getProductById(id: string, empresaId: string): Promise<ProductItem> {
    const product = await this.productsRepo.findByIdAndEmpresa(id, empresaId);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return this.toProductResponse(product);
  }

  async createProduct(dto: CreateProductDto, empresaId: string): Promise<ProductItem> {
    const codigo = dto.codigo.trim().toUpperCase();
    const existing = await this.productsRepo.findByCodigoAndEmpresa(codigo, empresaId);
    if (existing) {
      throw new ConflictException('Ya existe un producto con ese código');
    }

    const categoria = await this.resolveCategoria(empresaId, dto.categoria);
    const unidad = await this.resolveUnidad(empresaId, dto.unidad);

    const product = await this.productsRepo.createWithKardex({
      empresaId,
      categoriaId: categoria.id,
      unidadMedidaId: unidad.id,
      codigo,
      nombre: dto.nombre,
      stockMinimo: new Prisma.Decimal(dto.stockMinimo),
      stockActual: new Prisma.Decimal(dto.stockActual),
    });

    return this.toProductResponse(product);
  }

  async updateProduct(
    id: string,
    dto: UpdateProductDto,
    empresaId: string,
  ): Promise<ProductItem> {
    const product = await this.productsRepo.findByIdAndEmpresa(id, empresaId);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (dto.codigo) {
      const codigo = dto.codigo.trim().toUpperCase();
      if (codigo !== product.codigo) {
        const existing = await this.productsRepo.findByCodigoAndEmpresa(codigo, empresaId);
        if (existing && existing.id !== product.id) {
          throw new ConflictException('Ya existe un producto con ese código');
        }
      }
    }

    let categoriaId: string | undefined;
    if (dto.categoria) {
      const categoria = await this.resolveCategoria(empresaId, dto.categoria);
      categoriaId = categoria.id;
    }

    let unidadMedidaId: string | undefined;
    if (dto.unidad) {
      const unidad = await this.resolveUnidad(empresaId, dto.unidad);
      unidadMedidaId = unidad.id;
    }

    const stockActual =
      dto.stockActual !== undefined ? new Prisma.Decimal(dto.stockActual) : undefined;

    const updated = await this.productsRepo.updateProduct(
      product.id,
      {
        ...(dto.codigo !== undefined ? { codigo: dto.codigo } : {}),
        ...(dto.nombre !== undefined ? { nombre: dto.nombre } : {}),
        ...(categoriaId ? { categoriaId } : {}),
        ...(unidadMedidaId ? { unidadMedidaId } : {}),
        ...(dto.stockMinimo !== undefined
          ? { stockMinimo: new Prisma.Decimal(dto.stockMinimo) }
          : {}),
        ...(dto.activo !== undefined ? { activo: dto.activo } : {}),
      },
      stockActual,
    );

    return this.toProductResponse(updated);
  }

  async deleteProduct(id: string, empresaId: string): Promise<{ message: string }> {
    const product = await this.productsRepo.findByIdAndEmpresa(id, empresaId);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    await this.productsRepo.softDelete(product.id);
    return { message: 'Producto desactivado correctamente' };
  }

  private async resolveCategoria(empresaId: string, categoria: string) {
    const found = await this.catalogRepo.findCategoriaByText(empresaId, categoria);
    if (found) return found;

    try {
      return await this.catalogRepo.createCategoria(empresaId, categoria);
    } catch {
      const retry = await this.catalogRepo.findCategoriaByText(empresaId, categoria);
      if (retry) return retry;
      throw new BadRequestException('No se pudo resolver la categoría del producto');
    }
  }

  private async resolveUnidad(empresaId: string, unidad: string) {
    const found = await this.catalogRepo.findUnidadByCodigo(empresaId, unidad);
    if (found) return found;

    try {
      return await this.catalogRepo.createUnidad(empresaId, unidad);
    } catch {
      const retry = await this.catalogRepo.findUnidadByCodigo(empresaId, unidad);
      if (retry) return retry;
      throw new BadRequestException('No se pudo resolver la unidad de medida');
    }
  }

  private toProductResponse(product: ProductRecord): ProductItem {
    return {
      id: product.id,
      codigo: product.codigo,
      nombre: product.nombre,
      categoria: product.categoria.nombre,
      unidad: product.unidadMedida.codigo,
      stockActual: Number(product.kardex?.saldoActual ?? 0),
      stockMinimo: Number(product.stockMinimo),
      activo: product.activo,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}
