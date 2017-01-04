import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  private notification: string;
  private credits:number;

  cardNumber: string = "4242424242424242";
  expiryMonth: string = "12";
  expiryYear: string = "2017";
  cvc: string = "123";
  amount: number = 500;

  constructor(private apiService: ApiService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.apiService.getCredits().subscribe(
      credits => this.credits = credits.json().credits,
      error => this.showNotification("Error: " + error, 5000));
  }

  onSubmit() {
    this.notification = "Processing...";

    (<any>window).Stripe.card.createToken({
      number: this.cardNumber,
      exp_month: this.expiryMonth,
      exp_year: this.expiryYear,
      cvc: this.cvc
    }, (status: number, response: any) => {
      if (status === 200) {
        this.apiService.doPayment(this.amount, response.id).subscribe(
          user => this.showNotification("Payment successfully!", 3000),
          error => this.showNotification("Error: " + error, 5000));
      } else {
        this.showNotification("Error: " + response.error.message, 5000);
      }
    });
  }

  showNotification(msg: string, duration: number) {
    this.notification = msg;
    setTimeout(() => {
      this.notification = "";
      this.changeDetector.detectChanges();
    }, duration);

    this.changeDetector.detectChanges();
  }

}
