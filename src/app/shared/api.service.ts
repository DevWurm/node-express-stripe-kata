import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { TokenService } from './token.service';


@Injectable()
export class ApiService {
  private apiUrl = `${env.apiSchema || 'http'}://${env.apiHost || 'localhost'}:${env.apiPort || 8080}/${env.apiPrefix || ''}`;

  constructor(private http: Http, private tokenService: TokenService) {
  }

  registerUser(user: User): Observable<void> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.apiUrl + '/user', JSON.stringify(user), options)
      .map(_ => null)
      .catch(this.handleError);
  }

  login(email: string, passwd: string): Observable<string> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.apiUrl + '/session', { email: email, password: passwd }, options)
      .map(res => res.json().token)
      .catch(this.handleError);
  }

  doPayment(amount: number, token: string): Observable<void> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.tokenService.token);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.apiUrl + '/payment', { token: token, amount: amount }, options)
      .map(_ => null)
      .catch(this.handleError);
  }

  getCredits(): Observable<number> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.tokenService.token);
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.apiUrl + '/status', options)
      .map(res => res.json().credits)
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
