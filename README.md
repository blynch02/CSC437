# NFL Dynasty Tracker

This is a web application for showcasing NFL dynasty information, with a focus on a few of the most storied franchises in league history. The project is a monorepo containing a frontend application (`app`), a backend server (`server`), and a legacy frontend application (`proto`).

## Architecture Overview

-   **Workspace Structure**: Uses npm workspaces with packages for the modern frontend (`app`), legacy frontend (`proto`) and backend (`server`).
-   **Database**: MongoDB with Mongoose ODM.
-   **Authentication**: JWT-based authentication with bcrypt password hashing.
-   **Frontend**: Lit web components with TypeScript and Vite. It follows an MVU (Model-View-Update) architecture.
-   **Backend**: Express.js REST API server with TypeScript.

## Features

-   **Franchise Dynasties**: View detailed pages for the 49ers, Patriots, and Broncos dynasties, including summaries, key players, and legendary games.
-   **Player Information**: View pages for key players with their stats and information.
-   **Legendary Games**: Read about some of the most iconic games in NFL history.
-   **Team Colors**: Dynasty and player pages are styled with the appropriate team colors.
-   **User Authentication**: A complete registration and login system with JWT is implemented to protect certain routes.

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm (v8 or later)
-   MongoDB instance running

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project root and install the dependencies for all packages:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `packages/server` directory and add a `TOKEN_SECRET` for JWT signing:
    ```
    TOKEN_SECRET=your_super_secret_key_here
    ```

## Running the Application

You will need to run the `server` and `app` packages in separate terminals.

### Backend (`server`)

1.  Navigate to the server directory:
    ```bash
    cd packages/server
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
    The server will be running at `http://localhost:3000`.

### Frontend (`app`)

1.  Navigate to the app directory:
    ```bash
    cd packages/app
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173`.

## Building for Production

To build the frontend and backend applications, run the following command from the root directory:

```bash
npm run build --workspaces
```

The production-ready files will be located in the `dist` directory of each package.
