import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants';

/** Marca un endpoint como público (sin JWT). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
