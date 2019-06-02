import { Component, OnInit } from '@angular/core';

import { AuthService } from './../services/auth.service';
import { User } from './../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private user: User = new User();

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  tryLogIn() {
    this.authService.logIn(this.user);
  }

}
