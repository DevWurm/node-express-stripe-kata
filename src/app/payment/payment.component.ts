import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  private notification:string;

  cardNumber: string = "4242424242424242";
  expiryMonth: string = "12";
  expiryYear: string = "2017";
  cvc: string = "123";
  amount:string = "500";

  constructor(private authService: AuthService, private router: Router, private apiService:ApiService/*, private location:Location*/) {
    /*if (!authService.isLoggedIn()) {
      //this.location.replaceState('/'); // clears browser history so they can't navigate with back button
      console.log("navigate to login...");
      this.router.navigate(['login']);
    }*/

  }

  ngOnInit() {
  }

  onSubmit() {
    this.notification = "Loading...";

    (<any>window).Stripe.card.createToken({
      number: this.cardNumber,
      exp_month: this.expiryMonth,
      exp_year: this.expiryYear,
      cvc: this.cvc
    }, (status: number, response: any) => {
      if (status === 200) {
        console.log(`Success! Card token ${response.card.id}.`);
        this.notification = "Token created...";
        this.apiService.doPayment(this.amount, response.id).subscribe(
          user  => this.showNotification("success", 3000),
          error =>  this.showNotification("Error: "+error, 5000));
      } else {
        console.log(response.error.message);
      }
    });
  }

  showNotification(msg:string, duration:number) {
    this.notification=msg;
    setTimeout(() => this.notification = "", duration);
  }

}