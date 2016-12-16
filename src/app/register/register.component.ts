import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user : User = new User(null, null);

  constructor(private apiService:ApiService) { }

  ngOnInit() {
  }

  register(email:string, passwd:string) {
    console.log("register");
    this.user = new User(email, passwd);
    this.apiService.registerUser(this.user);
  }
}
