import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {
  constructor() { }

  set token(token: string) {
    localStorage.setItem('auth_token', token);
  }

  get token(): string {
    return localStorage.getItem('auth_token');
  }

  deleteToken() {
    localStorage.removeItem('auth_token');
  }
}
