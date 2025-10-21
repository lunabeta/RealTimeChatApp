# Realtime Chat Application 💬

This project is a full-stack realtime chat application built with React, TypeScript, Vite, Socket.IO, and other modern technologies. It allows users to communicate with each other in real-time through text messages. The application features user authentication, chat rooms, online user presence, and a clean, intuitive user interface. It solves the problem of needing a modern, scalable, and feature-rich chat application.

## 🚀 Key Features

- **Realtime Messaging:** Send and receive messages instantly using WebSockets.
- **User Authentication:** Secure user registration and login.
- **Chat Rooms:** Create and join different chat rooms for organized conversations.
- **Online User Presence:** See which users are currently online.
- **React Frontend:** Modern and responsive user interface built with React.
- **TypeScript:** Enhanced code quality and maintainability with TypeScript.
- **Vite Build Tool:** Fast and efficient development experience with Vite.
- **State Management:** Zustand for managing frontend state.
- **Routing:** React Router for navigation.
- **Context Providers:** Auth, Socket, and Chat contexts for managing application state.
- **Protected Routes:** Ensure only authenticated users can access certain pages.

## 🛠️ Tech Stack

*   **Frontend:**
    *   React
    *   TypeScript
    *   Vite
    *   React Router DOM
    *   Zustand
    *   Axios
    *   Socket.IO Client
    *   Lucide React
    *   Tailwind CSS
    *   PostCSS
    *   Autoprefixer
*   **Backend:** (No specific backend files provided, assuming Node.js with Express)
    *   Node.js
    *   Express
    *   Socket.IO
*   **Linting/Formatting:**
    *   ESLint
    *   Prettier
*   **Other:**
    *   package.json (npm)

## 📦 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- Node.js (>=18)
- npm (>=8)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd realtime-chat-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    cd backend
    npm install
    cd ../frontend
    npm install
    cd ..
    ```
    Alternatively, use the provided script:
     ```bash
    npm run install:all
    ```

### Running Locally

1.  **Start the development servers:**

    ```bash
    npm run dev
    ```

    This command will start both the backend and frontend development servers concurrently.  Make sure your backend is configured correctly and running on the expected port.

2.  **Open the application in your browser:**

    Navigate to `http://localhost:5173` (or the port specified by your frontend configuration) to view the application.

## 📂 Project Structure

```
realtime-chat-app/
├── backend/
│   ├── ... (Backend files - e.g., server.js, routes, models)
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── ... (Static assets)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.jsx
│   │   │   ├── Chat.jsx
│   │   │   └── layout/
│   │   │       └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ChatContext.tsx
│   │   │   └── SocketContext.tsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   ├── chat/
│   │   │   │   └── ChatPage.jsx
│   │   │   ├── AuthDemo.jsx
│   │   │   └── CRUDDemo.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── tsconfig.json
│   │   └── ... (Other frontend files)
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
├── eslint.config.mjs
├── package.json
├── test-connection.js
└── ... (Other project files)
```

## 📸 Screenshots

(Add screenshots of the application here to showcase its features and UI)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

If you have any questions or suggestions, feel free to contact me at [your-email@example.com](mailto:your-email@example.com).

## 💖 Thanks

Thank you for checking out this project! I hope it's helpful and that you enjoy using it.

This README was written by [readme.ai](https://readme-generator-phi.vercel.app/), your go-to tool for generating beautiful and informative README files.
