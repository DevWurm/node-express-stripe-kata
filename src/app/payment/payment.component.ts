import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { StripeService } from '../shared/stripe.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  private notification: string;
  private credits: number;

  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  amount: number;

  constructor(private apiService: ApiService, private stripeService: StripeService) {
  }

  ngOnInit() {
    this.updateCredits();
  }

  updateCredits() {
    this.apiService.getCredits().subscribe(
      credits => this.credits = credits,
      error => this.showNotification("Error: " + error, 5000));
  }

  onSubmit() {
    this.notification = "Processing...";

    this.stripeService.createCardToken(this.cardNumber, this.expiryMonth, this.expiryYear, this.cvc)
      .flatMap(token => this.stripeService.doPayment(token, this.amount))
      .subscribe(
        _ => {console.log("here"); this.updateCredits(); this.showNotification('Payment succeeded', 3000)},
        err => this.showNotification(`Error: ${err}`, 5000)
      );

  }

  showNotification(msg: string, duration: number) {
    this.notification = msg;
    setTimeout(() => {
      this.notification = "";
    }, duration);
  }

}
