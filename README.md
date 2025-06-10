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

