import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private notification: string;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  register(email: string, password: string, passwordAgain: string) {
    if (password == passwordAgain) {
      this.authService.register(email, password).subscribe(
        _ => this.showNotification('User created!', 3000),
        error => this.showNotification('Error: ' + error, 5000));
    } else {
      this.showNotification('Error: Passwords not equal!', 5000);
    }

  }

  showNotification(msg: string, duration: number) {
    this.notification = msg;
    setTimeout(() => this.notification = '', duration);
  }
}
