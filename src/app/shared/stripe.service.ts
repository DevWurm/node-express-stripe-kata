import { Injectable, NgZone } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { ApiService } from './api.service';
import { ReplaySubject, Observable } from 'rxjs';

@Injectable()
export class StripeService {

  constructor(private apiService: ApiService, private zone: NgZone) {
  }

  createCardToken(cardNumber: string, expiryMonth: string, expiryYear: string, cvc: string): Observable<string> {
    const requestSubject = new ReplaySubject<string>(1);

    (<any>window).Stripe.setPublishableKey(env.stripePubKey);

    // TODO: Create the card token and emit it via the requestSubject

    return requestSubject;
  }

  doPayment(token: string, amount: number): Observable<void> {
    return this.apiService.doPayment(amount, token);
  }

}
