import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ApiService } from './api.service';

@Injectable()
export class AuthService {
  private _token:string;

  constructor() {
    this._token = localStorage.getItem('auth_token');
  }

  login(token:string) {
    this._token = token;

    localStorage.setItem('auth_token', token);

    return true;
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  isLoggedIn() {
    return Boolean(localStorage.getItem('auth_token'));
  }

  get token(): string {
    return this._token;
  }
}
