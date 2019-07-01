import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../services/auth.service';
import { User } from './../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = new User();
  error: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() { }

  tryLogIn() {
    this.authService.logIn(this.user).subscribe(
      success => {
        this.router.navigate(['/'])
      },
      error => this.error = error
    );
  }

}
