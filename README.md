# AI Chat UI

This project is a simple React-based UI for a chat application. It features a basic login screen and a chat interface for sending messages and displaying responses.

## Backend API

This UI is intended to be used for testing the AI Chat backend API available at:
`https://ai-chat-backend-git-main-rehagursels-projects.vercel.app`

## Project Setup

This project was bootstrapped with [Vite](https://vitejs.dev/).

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rehagursel/ai-chat-ui.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ai-chat-ui
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   # yarn install
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
# or
# yarn dev
```

This will typically start the application on `http://localhost:5173` (or another port if 5173 is in use).

## Key Features

- **Login Page**: A simple username/password login. (Currently, any non-empty username and password will allow login for testing purposes).
- **Chat Page**: An interface to send messages and view responses. AI responses are currently simulated with a delay.

## Technologies Used

- React
- TypeScript
- Vite
- React Router DOM for navigation

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run lint`: Lints the project files.
- `npm run preview`: Serves the production build locally for preview.
