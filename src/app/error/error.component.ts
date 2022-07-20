import { Component, Inject } from '@angular/core';
import { ErrorInterceptor } from '../error.interceptor';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './error.component.html',
})
export class ErrorComponent {
  // message = "An unknown error occurred!";
  /** Retrieving error message data from ErrorInterceptor */
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
