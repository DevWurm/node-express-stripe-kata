import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable, AsyncSubject } from 'rxjs';


@Injectable()
export class ApiService {
  private port = process.env.HTTP_PORT || 4300;

  private apiUrl = 'http://localhost:'+this.port+'/api/v1';  // URL to web api
  private currentToken:string;

  constructor(private http: Http) { }

  registerUser(user:User): Observable<User> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.apiUrl+'/user', JSON.stringify(user), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  login(email:string, passwd:string): Observable<Response> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.apiUrl+'/session', {email:email, password:passwd}, options)
      .catch(this.handleError);
  }

  doPayment(amount:string, token:string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append("Authorization", "Bearer "+this.currentToken);
    let options = new RequestOptions({ headers: headers });
    console.log("sess "+this.currentToken);

    return this.http.post(this.apiUrl+'/payment', {token: token, amount:amount}, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
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

  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  public setToken(token:string) {
    this.currentToken = token;
    console.log("Setting token to "+this.currentToken);
  }
}
