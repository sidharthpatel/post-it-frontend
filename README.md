# SocialNetwork

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.5.

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
You can add `--open` to automatically navigate to the `http://localhost:4200/` address.

## Backend Database

### Connecting Node/ Express App to MongoDB

1. Create an account in MongoDB. (Note: The MongoDB Atlas should be free to a certain extent.)
2. Generate a cluster to store collections of database.
   - A cluster can be thought of as a server dedicated to your DB collection.
3. Click `connect`
4. Click `connect your application`
5. Select your choice of Driver. Recommended is `Node.js`
6. Add your connection string to the application code. Don't forget to replace `password` with the user's password.

## Backend Server

Run `npm run start:server` to run the backend nodemon server.
This server will automatically connect to an active mongoDB database and return `connection successful` in the terminal.
If the database connection fails, it will return `connection failed`.

## SPA Auth Explained

SPA contains backend with some routes. Typically you'd send request as an Http request. Some of the routes to which I send request to will be protected. For example, you can get a list of products but cannot create a new product using the http request, not if you aren't authenticated. For a full stack application, I would create a session when the user logs in which will authenticate and allow the user to send proper http request with full access to routes. Since SPAs' backend are stateless and decoupled  from frontend, we cannot create a session because backend is not connected to front-end/ does not care about that app (Reason why we have two separate servers: node and angular).

### How do we store autentication then?

* I will store auth information using token, specifically `Json Web Token (JWT)`.
* Think of JWT as `package of information` generated on a server upon successful login.
* The token is then sent back to the browser where you can store it in the angular app (cookie/local storage).
* This token is then attached to all future requests.
* Token is hashed so it will not be faked. Now the requests with the valid token will only be allowed access.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
