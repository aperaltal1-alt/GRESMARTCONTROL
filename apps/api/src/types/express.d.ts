import { AuthenticatedUser } from '../common/interfaces/jwt-payload.interface';

declare namespace Express {
  interface Request {
    id?: string;
    user?: AuthenticatedUser;
  }
}

export {};
