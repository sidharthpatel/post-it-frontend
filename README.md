# Post-it

Post-it is a simple MEAN stack application that allows users to add public notes with images. Each user can create, read, update, and delete their posts. However, they cannot alter other users' posts.

Created By: <b> Siddharth Patel </b>

[![wakatime](https://wakatime.com/badge/user/1b6035ce-66c3-490e-bccd-740880a46a30/project/cdb977e1-2f3c-4ac7-b6cf-f1c5a8dfe6a4.svg)](https://wakatime.com/badge/user/1b6035ce-66c3-490e-bccd-740880a46a30/project/cdb977e1-2f3c-4ac7-b6cf-f1c5a8dfe6a4)

## Functionality

The following <b>required</b> functionality is completed:

* [x] Set up NodeJS + Express + MongoDB + Angular application through Angular CLI
* [x] Use NodeJS and Express efficiently
* [x] Build resuable components in Angular and create a reactive user experience with the tools provided by Angular
- [x] Connect NodeJS backend with the Angular App through Angular's HttpClient service
- [x] Provide appropriate endpoints on your backend for your frontend to consume
- [x] Add advanced features like image uploads and pagination
- [x] Make your application more secure by implementing user authentication and authorization
- [x] Handle errors gracefully

The following <b>additional</b> features are implemented:

- [x] Add a dynamic header in the UI that will display the page user navigates to.
- [x] Configure multer to connect to AWS S3 bucket
- [x] Rewrite MongoDB schema to add paths to image
- [x] Re-navigate image paths (initially stored locally) to upload or delete from the S3 bucket
- [x] Add S3 access key, s3 bucket region, and s3 secret key
- [x] Two-step app deployment with separate client, server application.

## Production Environment

Click on the `Post-it` header to navigate to the remote deployed front-end application.

## Development Environment

### Front-end Development

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
You can add `--open` to automatically navigate to the `http://localhost:4200/` address.

### Backend Development

Run `npm run start:server` to run the backend nodemon server.
This server will automatically connect to an active mongoDB database and return `connection successful` in the terminal.
If the database connection fails, it will return `connection failed`.

## Database

### Connecting Node/ Express App to MongoDB

1. Create an account in MongoDB. (Note: The MongoDB Atlas should be free to a certain extent.)
2. Generate a cluster to store collections of database.
   - A cluster can be thought of as a server dedicated to your DB collection.
3. Click `connect`
4. Click `connect your application`
5. Select your choice of Driver. Recommended is `Node.js`
6. Add your connection string to the application code. Don't forget to replace `password` with the user's password.

## SPA Auth Explained

SPA contains backend with some routes. Typically you'd send request as an Http request. Some of the routes to which I send request to will be protected. For example, you can get a list of products but cannot create a new product using the http request, not if you aren't authenticated. For a full stack application, I would create a session when the user logs in which will authenticate and allow the user to send proper http request with full access to routes. Since SPAs' backend are stateless and decoupled from frontend, we cannot create a session because backend is not connected to front-end/ does not care about that app (Reason why we have two separate servers: node and angular).

### How do we store autentication then?

- I will store auth information using token, specifically `Json Web Token (JWT)`.
- Think of JWT as `package of information` generated on a server upon successful login.
- The token is then sent back to the browser where you can store it in the angular app (cookie/local storage).
- This token is then attached to all future requests.
- Token is hashed so it will not be faked. Now the requests with the valid token will only be allowed access.
