import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAutenticated = false;
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAutenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    /** observable prevents us from removing values from the listener. */
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(BACKEND_URL + '/signup', authData).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + '/login',
        authData
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          // Checks if the token exists
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAutenticated = true;
            this.userId = response.userId;
            /** Notifies auth services dependencies that the user is authenticated. */
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            // Navigates back to the home page
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    /**
     * We cannot validate whether the token is valid using the 'token' item in the authInformation since the token is encrypted and only the server can do that (not service).
     * We can atleast check using the date
     */
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime(); //duration in ms
    /** If expiresIn is > 0 then the expiry date is in the future. Hence allow the user to be logged in until expiration. */
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAutenticated = true;
      this.userId = authInformation.userId;
      // auth timer works in seconds
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    // Cleared the token
    this.token = null;
    this.isAutenticated = false;
    /* Notifies auth service dependencies that the user is not authenticated. */
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    // Navigates back to the home page
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting Timer: ' + duration);
    /** Takes two arguments: function that will execute after duration, Duration (in ms) */
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
