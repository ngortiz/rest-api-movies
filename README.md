# Movies & Persons RESTful API

This is a RESTful API developed as part of a challenge to manage **Movies** and **Persons** (Actors, Directors, Producers) using **NestJS**, **Prisma ORM**, and **SQLite**.

## Features

- **Movies Management**: Create, read, update, and delete movies.
- **Persons Management**: Create, read, update, and delete people and link them to their roles in movies.
- **Roman Numeral Conversion**: Automatically converts the movie's release year into a Roman Numeral string on the fly without saving it to the database.
- **Authentication**: JWT-based authentication. Endpoints to modify or create data are protected by an `AuthGuard`.
- **API Documentation**: Automatically generated using Swagger.

## Running the App

```bash
# Install dependencies
$ npm install

# Run database migrations
$ npx prisma migrate deploy

# Start the application
$ npm run start:dev




#Register a New User
 curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "admin_user", "password": "SuperSecretPassword!"}'

#Log In a User (Returns Access Token)
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "admin_user", "password": "SuperSecretPassword!"}'

#Create a Person with a Movie Association

curl -X POST http://localhost:3000/persons \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
-d '{
  "firstName": "Christopher",
  "lastName": "Nolan",
  "aliases": "Chris",
  "moviesAsDirectorIds": [1]
}'

#Create a Movie with a Person Association
curl -X POST http://localhost:3000/movies \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
-d '{
  "title": "Inception",
  "releaseYear": 2010,
  "castingIds": [1],
  "directorIds": [1]
}'
```
