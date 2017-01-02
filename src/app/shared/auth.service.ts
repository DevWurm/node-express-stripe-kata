import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ApiService } from './api.service';

@Injectable()
export class AuthService {
  private loggedIn = false;

  constructor(private http: Http, private apiService:ApiService) {
    this.loggedIn = !!localStorage.getItem('auth_token');
    this.apiService.setToken(localStorage.getItem('auth_token'));
  }

  login(token:string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    localStorage.setItem('auth_token', token);
    this.loggedIn = true;

    return true;
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
