import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { GRE_CONSTANTS, GreFileTypeMvp } from '../constants';

@Injectable()
export class GreStorageService {
  constructor(private readonly config: ConfigService) {}

  get maxFileSize(): number {
    return this.config.get<number>('upload.maxFileSize', 10485760);
  }

  get uploadDir(): string {
    return this.config.get<string>('upload.dir', './uploads');
  }

  resolveFileType(
    originalName: string,
    mimeType: string,
  ): GreFileTypeMvp | null {
    const ext = extname(originalName).toLowerCase();

    if (
      ext === GRE_CONSTANTS.EXT_XML ||
      GRE_CONSTANTS.MIME_XML.includes(mimeType)
    ) {
      return 'XML';
    }

    if (
      ext === GRE_CONSTANTS.EXT_PDF ||
      GRE_CONSTANTS.MIME_PDF.includes(mimeType)
    ) {
      return 'PDF';
    }

    return null;
  }

  async saveGreFile(
    greId: string,
    originalName: string,
    buffer: Buffer,
    tipo: GreFileTypeMvp,
  ) {
    const ext = tipo === 'XML' ? GRE_CONSTANTS.EXT_XML : GRE_CONSTANTS.EXT_PDF;
    const storedName = `${randomUUID()}${ext}`;
    const relativeDir = join('gre', greId);
    const absoluteDir = join(this.uploadDir, relativeDir);
    const absolutePath = join(absoluteDir, storedName);
    const relativePath = join(relativeDir, storedName).replace(/\\/g, '/');
    const hashSha256 = createHash('sha256').update(buffer).digest('hex');

    await mkdir(absoluteDir, { recursive: true });
    await writeFile(absolutePath, buffer);

    return {
      nombreAlmacenado: storedName,
      ruta: `./uploads/${relativePath}`,
      hashSha256,
      tamanoBytes: BigInt(buffer.length),
    };
  }
}
