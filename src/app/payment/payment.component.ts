import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router/*, private location:Location*/) { 
    /*if (!authService.isLoggedIn()) {
      //this.location.replaceState('/'); // clears browser history so they can't navigate with back button
      console.log("navigate to login...");
      this.router.navigate(['login']);
    }*/

  }

  ngOnInit() {
  }
  
  
}
