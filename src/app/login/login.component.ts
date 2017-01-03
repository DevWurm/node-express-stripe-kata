import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private notification:string;

  constructor(private authService: AuthService, private router: Router, private apiService:ApiService) {
    if(this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
  }

  onSubmit(email, password) {
    console.log("Login: "+email+password);

    this.apiService.login(email, password)
      .subscribe(
        token => {
          if(this.authService.login(token.json().token)) {
            this.router.navigate(['']);
          }  else {
            this.showNotification("Authentication failed", 5000)
          }
        },
        error => this.showNotification("Error: "+error, 5000)
    );
  }

  showNotification(msg:string, duration:number) {
    this.notification=msg;
    setTimeout(() => this.notification = "", duration);
  }

}
