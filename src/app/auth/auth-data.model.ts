/**
 * AuthData: Submitting password and such data through the backend. In case any users are later needed, then AuthData will add a separate model.c
 * Note: we can create a user model, but user should not have his password attached to the front-end since it is unsafe.
 */

export interface AuthData {
  email: string;
  password: string;
}
