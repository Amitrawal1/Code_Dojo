# Code Dojo

This repository contains the Code Dojo full-stack application with a React frontend and Express backend.

## Project Structure

- `Backend/` – Node.js/Express API server
- `Frontend/` – Vite + React SPA

## Requirements

- Node.js 18+ / npm
- MongoDB running locally if you want data persistence for the backend

## Backend Setup

1. Open a terminal and go to the backend folder:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `Backend/` with the following values:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/amitapp
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
CLIENT_ID=KVzt3y4sas4eXHHjuUfTaddU60ZEO3ym
CLIENT_SECRET=GOCSPX-9s8n2m1a3j5v6w7x8y9z0a1b2c3
```

- `PORT` is the backend server port.
- `MONGO_URI` is the MongoDB connection string.
- `GEMINI_API_KEY` is the API key used by the backend if configured.
- `CLIENT_ID` and `CLIENT_SECRET` are currently configured for the Auth0 application.

4. Start the backend:

```bash
npm run dev
```

## Frontend Setup

1. Open a separate terminal and go to the frontend folder:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `Frontend/` with the following values:

```env
VITE_GOOGLE_CLIENT_ID=KVzt3y4sas4eXHHjuUfTaddU60ZEO3ym
```

This value is currently used for the Auth0/Google login button in the frontend.

4. Start the frontend on the fixed port used by Auth0 configuration:

```bash
npm run dev -- --port 5173 --strictPort
```

## Auth0 / Login Flow Notes

The frontend uses `@auth0/auth0-react` and the Auth0Provider is configured in `Frontend/src/main.jsx`.

The login page currently supports:

- local email/password signup and login using `localStorage`
- Auth0 Google login via a direct provider redirect

### Auth0 configuration requirements

In the Auth0 application settings, make sure the following values are set:

- Callback URL: `http://localhost:5173/`
- Logout URL: `http://localhost:5173/`
- Web Origin: `http://localhost:5173`
- Application Type: `SPA`
- Token Endpoint Auth Method: `none`

The Google login button in `Frontend/src/assets/pages/LoginPage.jsx` uses:

```js
loginWithRedirect({
  authorizationParams: {
    connection: 'google-oauth2'
  }
});
```

This should take the user directly to the Google sign-in provider instead of first rendering the intermediate Auth0 login page.

## How to Use

1. Run the backend: `cd Backend && npm run dev`
2. Run the frontend: `cd Frontend && npm run dev -- --port 5173 --strictPort`
3. Open `http://localhost:5173`
4. Go to the login page. Use:
   - **local email/password** for local auth
   - **Login with Auth0** for Google login

## Important Notes

- If you change the frontend port, update the Auth0 app settings to match exactly.
- If your Google login still goes to the Auth0 intermediate screen, verify that the Auth0 application has the Google connection enabled and the correct redirect URLs.
- The backend `.env` values can be adjusted for your own MongoDB and API key.
