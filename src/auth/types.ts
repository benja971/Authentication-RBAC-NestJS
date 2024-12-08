import { Role } from 'src/roles/roles.enum';

export type UserJwtPayload = {
  id: string;
  email: string;
  roles: Role[];
};

export type JwtPayload = {
  // These fields are set by the JWT library
  iat: number;
  exp: number;
} & UserJwtPayload;

export type AuthenticatedRequest = Request & { user: JwtPayload };
