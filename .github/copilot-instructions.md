# AI Coding Agent Instructions for `nodejs-hw-mongodb`

## Project Overview

This project is a Node.js application that uses Express.js for building RESTful APIs and MongoDB as the database. The application is structured to handle user authentication, contact management, and other related services. It includes middleware for validation, error handling, and authentication.

### Key Components

- **`src/server.js`**: Entry point for the application. Configures middleware, routes, and starts the server.
- **`src/routers/`**: Contains route definitions for different API endpoints.
- **`src/controllers/`**: Implements the business logic for handling requests.
- **`src/middlewares/`**: Includes reusable middleware for validation, authentication, and error handling.
- **`src/db/`**: Manages database connections and defines Mongoose models.
- **`src/services/`**: Contains service logic for interacting with external APIs or encapsulating complex operations.
- **`docs/`**: Contains API documentation files, including OpenAPI specifications.

## Developer Workflows

### Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   This uses `nodemon` to watch for file changes.

### Testing API Endpoints

- Use **Postman** to test API endpoints. Ensure the `Content-Type` header is set to `application/json` for requests with a body.
- Example endpoints:
  - `POST /api/contacts`: Create a new contact.
  - `GET /api/contacts`: Retrieve all contacts.

### Debugging

- Use `console.log` statements for debugging middleware and controllers.
- Check the `validateBody` middleware for issues with `req.body`.

### MongoDB Integration

- MongoDB connection is initialized in `src/db/initMongoConnection.js`.
- Models are defined in `src/db/models/`.

### API Documentation

- OpenAPI specification is located in `docs/openapi.yaml`.
- Swagger UI is served at `/api-docs`.

## Project-Specific Conventions

### Middleware

- Middleware functions are located in `src/middlewares/`.
- Always ensure `next` is called to pass control to the next middleware.

### Error Handling

- Use the `errorHandler` middleware to handle errors globally.
- Throw errors using `http-errors` for consistent error responses.

### Controller Wrapping

- Use the `ctrlWrapper` utility in `src/utils/ctrlWrapper.js` to handle async errors in controllers.

### Validation

- Request validation is handled by middleware like `validateBody`.
- Ensure `express.json()` is used before validation middleware.

## External Dependencies

- **MongoDB**: Database for storing application data.
- **Swagger UI**: For API documentation.
- **Pino**: HTTP request logging.
- **Cloudinary**: For handling file uploads.

## Examples

### Adding a New Route

1. Define the route in `src/routers/`.
2. Implement the controller in `src/controllers/`.
3. Add validation middleware in `src/middlewares/` if needed.

### Debugging Middleware

- Add `console.log` statements to log `req`, `res`, and `next`.
- Example:
  ```javascript
  const validateBody = (req, res, next) => {
    console.log('Request Body:', req.body);
    next();
  };
  ```

### Common Issues

- **`req.body` is undefined**: Ensure `express.json()` is used before any middleware that accesses `req.body`.
- **Middleware errors**: Check if `next` is being called correctly.

---

This guide is a living document. Update it as the project evolves.
