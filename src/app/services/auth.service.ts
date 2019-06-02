import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticated = false;

  showMenu = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  logIn(user: User) {
    if (user.name === 'admin' && user.password === '1234') {
      this.authenticated = true;
      this.showMenu.emit(true);
      this.router.navigate(['/']);
    } else {
      this.showMenu.emit(false);
      this.authenticated = false;
    }
  }

  logOut() {
    this.showMenu.emit(false);
    this.authenticated = false;
  }
}
