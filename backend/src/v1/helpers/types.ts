export type RequestError = Error & {status?: number};

export type UserCredentials = {email: string, password: string};
export function isUserCredentials(i: any): i is UserCredentials {
  return typeof i === 'object' && i.email && i.password && typeof i.email === 'string' && typeof i.password === 'string';
}

export type PasswordHash = {salt: string, hash: string};

export type JWTVerificationResult = string | TokenExpired | TokenInvalid
export class TokenExpired {
  private tokenexpired = true; // property for DuckTyping
  constructor(public expiredAt: Date) {}
}

export class TokenInvalid {
  private tokeninvalid = true; // property for DuckTyping
  constructor(public reason: string) {}
}
