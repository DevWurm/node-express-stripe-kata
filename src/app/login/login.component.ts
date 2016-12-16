import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { 
    if(this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

  }

  ngOnInit() {


  }

  onSubmit(email, password) {
    console.log("Login: "+email+password);

    let login = this.authService.login(email, password);
    if(login) {
      this.router.navigate(['']);
    }

    /*this.authService.login(email, password).subscribe((result) => {
      if (result) {
        this.router.navigate(['']);
      }
    });*/

  }

}
