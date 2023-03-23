# Chancli-Users

## Simple users api built with NodeJS + Express + TypeORM + PostgreSQL

This project uses express-session for user session management

### Steps to run

Copy .env.example file to .env and configure the variables.

If you want to enable user registration, set REGISTER_OPEN to `yes`

Execute: 

```npm run install``` 

Run with 

Dev: ```npm run dev```

Prod: ```npm run prod```

### Available routes:

**GET**: `/users/api/`

Auth required: Admin user

Returns the user list

-----

**GET**: `/users/api/:userId`

Auth required: Admin user
Parameters: user id

Returns specific user

-----

**GET**: `/users/api/logout`

Auth required: User authenticated

Logout

-----

**GET**: `/users/api/profile`

Auth required: User authenticated

Get own user profile

-----

**POST**: `/users/api/updateOwnEmail`

Auth required: User authenticated

Parameters: 
- `email` : New user email 

Update user email

-----

**POST**: `/users/api/updateOwnPassword`

Auth required: User authenticated

Parameters: 
- `password` : New user password

Update user password

-----

**POST**: `/users/api/login`

Auth required: None

Parameters: 
- `email` : User email 
- `password` : User password

Login the user

-----

**POST**: `/users/api/register`

Auth required: None

Parameters: 
- `email` : User email 
- `password` : User password

Register new user
