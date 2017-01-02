import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private user : User = new User(null, null);
  private notification:string;

  constructor(private apiService:ApiService) { }

  ngOnInit() {
  }

  register(email:string, passwd:string, passwdAgain:string) {
    if(passwd == passwdAgain) {
      this.user = new User(email, passwd);

      this.apiService.registerUser(this.user).subscribe(
        user  => this.showNotification("User with email "+this.user.email+" created!", 3000),
        error =>  this.showNotification("Error: "+error, 5000));
    } else {
      this.showNotification("Error: Passwords not equal!", 5000);
    }

  }

  showNotification(msg:string, duration:number) {
    this.notification=msg;
    setTimeout(() => this.notification = "", duration);
  }
}
