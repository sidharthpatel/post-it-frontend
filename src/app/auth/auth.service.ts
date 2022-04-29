import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAutenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAutenticated;
  }

  getAuthStatusListener() {
    /** observable prevents us from removing values from the listener. */
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/login', authData)
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        // Checks if the token exists
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(() => { this.logout(); }, expiresInDuration * 1000);
          this.isAutenticated = true;
          /** Notifies auth services dependencies that the user is authenticated. */
          this.authStatusListener.next(true);
          // Navigates back to the home page
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    // Cleared the token
    this.token = null;
    this.isAutenticated = false;
    /* Notifies auth service dependencies that the user is not authenticated. */
    this.authStatusListener.next(false);
    // Navigates back to the home page
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }
}
