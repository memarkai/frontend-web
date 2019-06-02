import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap, shareReplay } from 'rxjs/operators';

import * as jwtDecode from 'jwt-decode';
import * as moment from 'moment';

import { User } from './../models/user';
import { JWTPayload } from '../models/jwt-payload';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiRoot = 'localhost:8080/api/';
  private tokenStorageKey = 'token';
  private expiresAtStorageKey = 'expires_at';

  showMenu = new EventEmitter<boolean>();

  constructor(private http: HttpClient) { }

  private setSession(authResult) {
    const token = authResult.token;
    const payload = jwtDecode(token) as JWTPayload;
    const expiresAt = moment.unix(payload.exp);

    localStorage.setItem(this.tokenStorageKey, authResult.token);
    localStorage.setItem(this.expiresAtStorageKey, JSON.stringify(expiresAt.valueOf()));
  }

  get token(): string {
    return localStorage.getItem(this.tokenStorageKey);
  }

  logIn(user: User) {
    return this.http.post(
      this.apiRoot.concat('login/'),
      {
        email: user.email,
        password: user.password
      }
    ).pipe(
      tap(response => this.setSession(response)),
      shareReplay(),
    );
  }

  logOut() {
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.expiresAtStorageKey);
  }

  refreshToken() {
    return;  // Just return for now.
    if (moment().isBetween(this.getExpiration().subtract(1, 'days'), this.getExpiration())) {
      return this.http.post(
        this.apiRoot.concat('refresh-token/'),
        { token: this.token }
      ).pipe(
        tap(response => this.setSession(response)),
        shareReplay(),
      ).subscribe();
    }
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);

    return moment(expiresAt);
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}
