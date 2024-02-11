# Project Title: node server App

## Description

The project is a Node.js-based application designed for managing user and business-related data. It involves building a REST API, emphasizing on server-side development with a deep understanding of relevant technologies and libraries like Express.js, MongoDB, and others. Key features include user registration, login, content publication, and editing. The project also incorporates advanced features like a file logger for tracking errors and a security mechanism for temporary user account lockout. The application is structured to provide a comprehensive and secure user experience, focusing on clean, well-organized code and efficient data handling.

## Technologies Used

- Node.js
- Express
- MongoDB

## Used Packages

1. **bcrypt (5.1.1)**: A library to help hash passwords for secure storage.
2. **chalk (4.1.2)**: Enables styling of terminal string output with colors.
3. **cors (2.8.5)**: Middleware to enable Cross-Origin Resource Sharing in your Express app.
4. **cross-env (7.0.3)**: Sets and uses environment variables across platforms.
5. **dotenv (16.3.2)**: Loads environment variables from a .env file into process.env.
6. **express (4.18.2)**: Web framework for creating server-side applications in Node.js.
7. **joi (17.12.0)**: Object schema validation tool.
8. **jsonwebtoken (9.0.2)**: Implements JSON Web Tokens for secure data transmission.
9. **lodash (4.17.21)**: Utility library providing convenience functions for common programming tasks.
10. **mongoose (8.1.0)**: MongoDB object modeling tool designed to work in an asynchronous environment.
11. **morgan (1.10.0)**: HTTP request logger middleware for Node.js.
12. **uuid (9.0.1)**: Creates unique identifiers (UUIDs).

## Installation

Install the node_modules

```shell
npm install
```

You will need 2 .env files:

1. .env.development
2. .env.production

## Running the Project

- To start the application in production mode:

```shell

  npm start
```

This sets NODE_ENV to 'production' and runs the app using Node.js.

- For development mode with auto-restart:

```shell

npm run dev
```

This sets NODE_ENV to 'development' and runs the app with nodemon for hot reloading.

## Available Routes

- Here you can find API addresses that the server will respond to:

### users api

| No. | Method | Route | Description | Access Control |
| :---: | :---: | :---: | :---: | :---: |
| 1. | `POST` | /api/users |  Register a user  |  All |
| 2. | `POST` | /api/login |  Log in |  All |
| 3. | `GET`  | /api/users |  Get all users |  Only Administrator |
| 4. | `GET`  | /api/users/me |  Get user self data | 1. Registered users 2. Need to provide (JWT) token |
| 5. | `GET`  | /api/users/:id |  Get user by id | 1. This registered user or admin 2. Need to provide (JWT) token |
| 6. | `PUT`  | /api/users/:id |  Update user data by id | 1. This registered user or admin 2. Need to provide (JWT) token |
| 7. | `PATCH` | /api/users/release/:id |  Release locked user by id |  Only administrator |
| 8. | `PATCH` | /api/users/user/:id |  Update any user params by send them in body include (isBusiness) | 1. This registered user or admin 2. Need to provide (JWT) token 3. isAdmin param can be changed only by admin |
| 9. | `PATCH` | /api/users/isBusiness/:id |  Toggle user business status (isBusiness) | 1. This registered user or admin 2. Need to provide (JWT) token |
| 10. | `DELETE` | /api/users/:id |  Delete user by id | 1. This registered user or admin 2. Need to provide (JWT) token |

### cards api

| No. | Method | Route | Description | Access Control |
| :---: | :---: | :---: | :---: | :---: |
| 1. | `POST` | /api/cards |  Create new Business card  | 1. Need to be Business register user 2. Need to provide (JWT) token |
| 2. | `GET`  | /api/cards |  Get all cards |  All |
| 3. | `GET`  | /api/cards/my-cards |  Get all user cards | 1. Need to be business register user 2. Need to provide (JWT) token |
| 4. | `GET`  | /api/cards/:id |  Get card by id |  All |
| 5. | `PUT`  | /api/cards/:id |  Update card data | 1. Need to be owner of this card 2. Need to provide (JWT) token |
| 6. | `PATCH`  | /api/cards/:id |  Toggle like of user for the card | 1. registered user 2. Need to provide (JWT) token |
| 7. | `PATCH` | /api/cards/business/:id |  Change card business number by provide in the body |  Only administrator |
| 8. | `DELETE` | /api/cards/:id |  Delete business card | 1. User that is owner of this card or admin 2. Need to provide (JWT) token |


### A link to requests in Postman includes a description of what should be put in the body of the request and examples

### [API Documentation](https://documenter.getpostman.com/view/28260165/2s9YyzeJyB)

## Security Features

### Temporary Account Lock

If a user attempts to log in with the same email address and fails due to incorrect password entry three consecutive times, their account will be temporarily locked for a period of 24 hours. This measure is designed to prevent unauthorized access attempts and safeguard user data.

#### How it Works:

- **Lockout Trigger**: After three consecutive failed login attempts with the same email.
- **Lockout Duration**: The user's account will be locked for 24 hours.
- **Account Recovery**: Users can contact support for assistance or wait until the lockout period expires to regain access.
- **Unlock by admin**: Admin can unlock user's account manually through `/users/release/:id`.

## Application Logging

### Error Logging

Our application includes an advanced error logging system to enhance monitoring and debugging. This system automatically captures and logs all requests that result in a status code of 400 or higher.

#### Features:

- **Log File Creation**: For each day, the logger creates a new log file in the `logs` directory. The log file is named after the current date (e.g., `2024-02-10.log`). If a file with that date already exists, the logger appends to the existing file.
- **Log Content**: Each log entry includes:
  - the date and time of the request
  - method
  - URL route
  - response status code
  - error message.
- **Log Directory**: All logs are stored in the `logs` directory at the root of the application.

This logging system ensures that all critical errors are recorded, aiding in quick identification and resolution of issues affecting our users.