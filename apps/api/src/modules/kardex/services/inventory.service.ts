import { Injectable } from '@nestjs/common';
import { KARDEX_CONSTANTS } from '../constants';
import { ListInventoryQueryDto } from '../dto';
import { InventoryItem, PaginatedInventory } from '../interfaces';
import { KardexRepository } from '../repositories';
import { KardexService } from './kardex.service';

@Injectable()
export class InventoryService {
  constructor(
    private readonly kardexRepo: KardexRepository,
    private readonly kardexService: KardexService,
  ) {}

  async listInventory(empresaId: string, query: ListInventoryQueryDto): Promise<PaginatedInventory> {
    const page = query.page ?? KARDEX_CONSTANTS.DEFAULT_PAGE;
    const limit = query.limit ?? KARDEX_CONSTANTS.DEFAULT_LIMIT;

    if (query.estado) {
      const products = await this.kardexRepo.findInventoryProducts(empresaId);
      const items = products
        .map((producto) => this.toInventoryItem(producto))
        .filter((item) => item.estado === query.estado);

      const total = items.length;
      const skip = (page - 1) * limit;

      return {
        items: items.slice(skip, skip + limit),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      };
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.kardexRepo.findInventoryProductsPaginated(empresaId, skip, limit),
      this.kardexRepo.countInventoryProducts(empresaId),
    ]);

    return {
      items: products.map((producto) => this.toInventoryItem(producto)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  private toInventoryItem(producto: {
    id: string;
    codigo: string;
    nombre: string;
    stockMinimo: { toString(): string } | number | string;
    kardex: { saldoActual: { toString(): string } | number | string } | null;
  }): InventoryItem {
    const stockActual = Number(producto.kardex?.saldoActual ?? 0);
    const stockMinimo = Number(producto.stockMinimo);

    return {
      productoId: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      stockActual,
      stockMinimo,
      estado: this.kardexService.computeInventoryState(stockActual, stockMinimo),
    };
  }
}
