import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private notification: string;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
  }

  onSubmit(email, password) {
    console.log("Login: " + email + password);

    this.authService.login(email, password)
      .subscribe(
        _ => null,
        _ => {
        this.showNotification('Login failed', 5000);
        return Observable.throw(false);
      });
  }

  showNotification(msg: string, duration: number) {
    this.notification = msg;
    setTimeout(() => this.notification = "", duration);
  }

}
