import { Role } from 'src/roles/roles.enum';

export type Maybe<T> = [null, T] | [Error, null];

export type MaybeAsync<T> = Promise<Maybe<T>>;

export type JwtUserDto = {
  id: string;
  email: string;
  roles: Role[];
};

export type JwtPayload = {
  // These fields are set by the JWT library
  iat: number;
  exp: number;
} & JwtUserDto;
