export type RequestError = Error & {status?: number};

export type UserCredentials = {email: string, password: string};
export function isUserCredentials(i: any): i is UserCredentials {
  return typeof i === 'object' && i.email && i.password && typeof i.email === 'string' && typeof i.password === 'string';
}

export type PasswordHash = {salt: string, hash: string};