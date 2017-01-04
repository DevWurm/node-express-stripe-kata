import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {

  constructor(private apiService: ApiService, private tokenService: TokenService, private router: Router) {
  }

  register(email: string, password: string): Observable<void> {
    return this.apiService.registerUser(new User(email, password)).flatMap(_ => this.login(email, password));
  }

  login(email: string, password: string): Observable<void> {
    return this.apiService.login(email, password)
      .do(
        token => {
          this.tokenService.token = token;
          this.router.navigate(['']);
        }
      )
      .map(_ => null);
  }

  logout() {
    this.tokenService.deleteToken();
  }

  isLoggedIn() {
    return Boolean(this.tokenService.token);
  }
}
