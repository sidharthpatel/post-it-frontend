/**
 * INTERCEPTOR CLASS
 *
 * Interceptors check every incoming and outgoing request to the server and is able to manipulate requests prior to sending.
 *
 * Example: Imagine we need to send user authentication token each and every time with the http request. Instead of writing/fetching token for every request we can simply create the inceptors, which'll inspect the http request, manipulate/add token,, and pass it to the server.
 */

import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', "Bearer " + authToken),
    });
    return next.handle(authRequest);
  }
}
