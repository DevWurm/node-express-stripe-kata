import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Headers, Http } from '@angular/http';

@Injectable()
export class ApiService {
  private apiUrl = 'api/';  // URL to web api

  constructor(private http: Http) { }

  registerUser(user:User) {
    let headers = new Headers({'Content-Type': 'application/json'});

    /*return this.http
      .post(this.apiUrl, JSON.stringify(user), {headers:headers})
      .toPromise()
      .then(response => response.json().data)
      .catch(this.handleError);*/
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
