import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAutenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {}

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
      .post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        // Checks if the token exists
        if (token) {
          this.isAutenticated = true;
          /** Notifies auth services dependencies that the user is authenticated. */
          this.authStatusListener.next(true);
        }
      });
  }
}
