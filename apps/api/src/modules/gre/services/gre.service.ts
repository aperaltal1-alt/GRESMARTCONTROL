import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { GRE_CONSTANTS } from '../constants';
import {
  CreateGreDto,
  GreDetalleDto,
  ListGreQueryDto,
  UpdateGreDto,
} from '../dto';
import {
  GreArchivoItem,
  GreDetalleItem,
  GreItem,
  GreListItem,
  PaginatedGre,
  UploadedGreFile,
} from '../interfaces';
import { GreCatalogRepository, GreRepository } from '../repositories';
import { GreStorageService } from './gre-storage.service';

type GreFullRecord = NonNullable<Awaited<ReturnType<GreRepository['findByIdAndEmpresa']>>>;
type GreListRecord = Awaited<ReturnType<GreRepository['findManyByEmpresa']>>[number];

@Injectable()
export class GreService {
  constructor(
    private readonly greRepo: GreRepository,
    private readonly catalogRepo: GreCatalogRepository,
    private readonly storageService: GreStorageService,
  ) {}

  async listGre(empresaId: string, query: ListGreQueryDto): Promise<PaginatedGre> {
    const page = query.page ?? GRE_CONSTANTS.DEFAULT_PAGE;
    const limit = query.limit ?? GRE_CONSTANTS.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const filters = {
      numero: query.numero?.trim(),
      serie: query.serie?.trim(),
      estado: query.estado,
      fechaDesde: query.fechaDesde,
      fechaHasta: query.fechaHasta,
      empresa: query.empresa?.trim(),
    };

    const [items, total] = await Promise.all([
      this.greRepo.findManyByEmpresa(empresaId, { skip, take: limit, ...filters }),
      this.greRepo.countByEmpresa(empresaId, filters),
    ]);

    return {
      items: items.map((item) => this.toGreListResponse(item)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getGreById(id: string, empresaId: string): Promise<GreItem> {
    const gre = await this.greRepo.findByIdAndEmpresa(id, empresaId);
    if (!gre) {
      throw new NotFoundException('GRE no encontrada');
    }
    return this.toGreResponse(gre);
  }

  async createGre(
    dto: CreateGreDto,
    user: AuthenticatedUser,
  ): Promise<GreItem> {
    const empresa = await this.catalogRepo.findEmpresaById(user.empresaId);
    if (!empresa) {
      throw new BadRequestException('Empresa no encontrada');
    }

    const tipoDocumento = await this.catalogRepo.findOrCreateTipoDocumentoGre(user.empresaId);
    const serie = await this.catalogRepo.findOrCreateSerie(
      user.empresaId,
      tipoDocumento.id,
      dto.serie,
    );

    const numero = dto.numero.trim();
    const duplicate = await this.greRepo.findBySerieAndNumero(
      serie.id,
      numero,
      user.empresaId,
    );
    if (duplicate) {
      throw new ConflictException('Ya existe una GRE con ese número y serie');
    }

    const detalles = await this.resolveDetalles(dto.productos, user.empresaId);
    const estadoDocumento = await this.catalogRepo.findEstadoDocumento(
      user.empresaId,
      tipoDocumento.id,
      'PENDIENTE',
    );

    const gre = await this.greRepo.createWithDetalles({
      empresaId: user.empresaId,
      tipoDocumentoId: tipoDocumento.id,
      serieId: serie.id,
      numero,
      fechaEmision: new Date(dto.fecha),
      rucEmisor: dto.ruc?.trim() ?? empresa.ruc,
      transportista: dto.transportista,
      origen: dto.origen,
      destino: dto.destino,
      estadoDocumentoId: estadoDocumento?.id,
      observacion: dto.observaciones,
      createdById: user.id,
      detalles,
    });

    return this.toGreResponse(gre);
  }

  async updateGre(
    id: string,
    dto: UpdateGreDto,
    user: AuthenticatedUser,
  ): Promise<GreItem> {
    const gre = await this.greRepo.findByIdAndEmpresa(id, user.empresaId);
    if (!gre) {
      throw new NotFoundException('GRE no encontrada');
    }

    const tipoDocumento = await this.catalogRepo.findOrCreateTipoDocumentoGre(user.empresaId);
    let serieId = gre.serieId;
    let numero = gre.numero;

    if (dto.serie) {
      const serie = await this.catalogRepo.findOrCreateSerie(
        user.empresaId,
        tipoDocumento.id,
        dto.serie,
      );
      serieId = serie.id;
    }

    if (dto.numero) {
      numero = dto.numero.trim();
    }

    if (serieId !== gre.serieId || numero !== gre.numero) {
      const duplicate = await this.greRepo.findBySerieAndNumero(
        serieId,
        numero,
        user.empresaId,
      );
      if (duplicate && duplicate.id !== gre.id) {
        throw new ConflictException('Ya existe una GRE con ese número y serie');
      }
    }

    let estadoDocumentoId: string | null | undefined;
    if (dto.estado) {
      const estadoDocumento = await this.catalogRepo.findEstadoDocumento(
        user.empresaId,
        tipoDocumento.id,
        dto.estado,
      );
      estadoDocumentoId = estadoDocumento?.id ?? null;
    }

    await this.greRepo.updateGre(gre.id, {
      ...(dto.serie !== undefined ? { serieId } : {}),
      ...(dto.numero !== undefined ? { numero } : {}),
      ...(dto.fecha !== undefined ? { fechaEmision: new Date(dto.fecha) } : {}),
      ...(dto.ruc !== undefined ? { rucEmisor: dto.ruc.trim() } : {}),
      ...(dto.transportista !== undefined
        ? { transportista: dto.transportista?.trim() ?? null }
        : {}),
      ...(dto.origen !== undefined ? { origen: dto.origen?.trim() ?? null } : {}),
      ...(dto.destino !== undefined ? { destino: dto.destino?.trim() ?? null } : {}),
      ...(dto.estado !== undefined ? { estado: dto.estado } : {}),
      ...(dto.estado !== undefined ? { estadoDocumentoId } : {}),
      ...(dto.observaciones !== undefined
        ? { observacion: dto.observaciones?.trim() ?? null }
        : {}),
    });

    if (dto.productos) {
      const detalles = await this.resolveDetalles(dto.productos, user.empresaId);
      const updated = await this.greRepo.replaceDetalles(gre.id, detalles);
      return this.toGreResponse(updated);
    }

    const updated = await this.greRepo.findByIdAndEmpresa(gre.id, user.empresaId);
    return this.toGreResponse(updated!);
  }

  async deleteGre(id: string, empresaId: string): Promise<{ message: string }> {
    const gre = await this.greRepo.findByIdAndEmpresa(id, empresaId);
    if (!gre) {
      throw new NotFoundException('GRE no encontrada');
    }

    await this.greRepo.softDelete(gre.id);
    return { message: 'GRE desactivada correctamente' };
  }

  async uploadFile(
    id: string,
    file: UploadedGreFile | undefined,
    user: AuthenticatedUser,
  ): Promise<GreArchivoItem> {
    if (!file) {
      throw new BadRequestException('Debe adjuntar un archivo en el campo "file"');
    }

    if (file.size > this.storageService.maxFileSize) {
      throw new PayloadTooLargeException(
        `El archivo excede el tamaño máximo de ${this.storageService.maxFileSize} bytes`,
      );
    }

    const tipo = this.storageService.resolveFileType(file.originalname, file.mimetype);
    if (!tipo) {
      throw new UnsupportedMediaTypeException('Solo se permiten archivos XML o PDF');
    }

    const gre = await this.greRepo.findByIdAndEmpresa(id, user.empresaId);
    if (!gre) {
      throw new NotFoundException('GRE no encontrada');
    }

    const stored = await this.storageService.saveGreFile(
      gre.id,
      file.originalname,
      file.buffer,
      tipo,
    );

    const archivo = await this.greRepo.createArchivo({
      greId: gre.id,
      tipo,
      nombreOriginal: file.originalname,
      nombreAlmacenado: stored.nombreAlmacenado,
      ruta: stored.ruta,
      mimeType: file.mimetype || (tipo === 'XML' ? 'application/xml' : 'application/pdf'),
      tamanoBytes: stored.tamanoBytes,
      hashSha256: stored.hashSha256,
      usuarioId: user.id,
    });

    return {
      id: archivo.id,
      tipo: archivo.tipo,
      nombreOriginal: archivo.nombreOriginal,
      mimeType: archivo.mimeType,
      tamanoBytes: Number(archivo.tamanoBytes),
      createdAt: archivo.createdAt.toISOString(),
    };
  }

  private async resolveDetalles(productos: GreDetalleDto[], empresaId: string) {
    const detalles: Array<{
      productoId: string;
      codigoProducto: string;
      descripcion: string;
      cantidad: Prisma.Decimal;
      orden: number;
    }> = [];

    for (let index = 0; index < productos.length; index++) {
      const item = productos[index];
      const producto = await this.catalogRepo.findProductoById(item.productoId, empresaId);
      if (!producto) {
        throw new BadRequestException(`Producto no encontrado: ${item.productoId}`);
      }

      detalles.push({
        productoId: producto.id,
        codigoProducto: producto.codigo,
        descripcion: producto.nombre,
        cantidad: new Prisma.Decimal(item.cantidad),
        orden: index + 1,
      });
    }

    return detalles;
  }

  private toGreListResponse(gre: GreListRecord): GreListItem {
    return {
      id: gre.id,
      numero: gre.numero,
      serie: gre.serie.codigo,
      fecha: this.formatDate(gre.fechaEmision),
      empresa: gre.empresa.nombreComercial ?? gre.empresa.razonSocial,
      ruc: gre.rucEmisor,
      transportista: gre.transportista,
      origen: gre.origen,
      destino: gre.destino,
      estado: gre.estado,
      observaciones: gre.observacion,
      totalProductos: gre._count.detalles,
      createdAt: gre.createdAt.toISOString(),
      updatedAt: gre.updatedAt.toISOString(),
    };
  }

  private toGreResponse(gre: GreFullRecord): GreItem {
    return {
      id: gre.id,
      numero: gre.numero,
      serie: gre.serie.codigo,
      fecha: this.formatDate(gre.fechaEmision),
      empresa: gre.empresa.nombreComercial ?? gre.empresa.razonSocial,
      ruc: gre.rucEmisor,
      transportista: gre.transportista,
      origen: gre.origen,
      destino: gre.destino,
      estado: gre.estado,
      observaciones: gre.observacion,
      productos: gre.detalles.map(
        (detalle): GreDetalleItem => ({
          id: detalle.id,
          productoId: detalle.productoId,
          codigoProducto: detalle.codigoProducto,
          nombreProducto: detalle.descripcion,
          cantidad: Number(detalle.cantidad),
        }),
      ),
      archivos: gre.archivos.map(
        (archivo): GreArchivoItem => ({
          id: archivo.id,
          tipo: archivo.tipo,
          nombreOriginal: archivo.nombreOriginal,
          mimeType: archivo.mimeType,
          tamanoBytes: Number(archivo.tamanoBytes),
          createdAt: archivo.createdAt.toISOString(),
        }),
      ),
      createdAt: gre.createdAt.toISOString(),
      updatedAt: gre.updatedAt.toISOString(),
    };
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
