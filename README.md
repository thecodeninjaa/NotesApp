# My Notes App

A modern, intuitive, and feature-rich note-taking application built with React, Vite, and Supabase.

## Features

- **📝 Create, Edit, and Delete Notes:** Easily manage your notes with a simple and intuitive interface.
- **🗂️ Organize with Folders:** Group your notes into folders for better organization.
- **🎨 Light & Dark Mode:** Switch between light and dark themes for your comfort.
- **🔐 Authentication:** Secure your notes with email/password authentication.
- **🚀 Fast and Responsive:** Built with Vite for a lightning-fast development experience and a responsive design that works on all devices.

## Tech Stack

- **Frontend:**
  - [React](https://reactjs.org/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
- **Backend:**
  - [Supabase](https://supabase.io/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/your_username/my-notes-app.git
    ```
2.  **Navigate to the frontend directory:**
    ```sh
    cd my-notes-app/frontend
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Set up your environment variables:**

    Create a `.env` file in the `frontend` directory and add your Supabase project URL and anon key:

    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

5.  **Run the development server:**

    ```sh
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

## License

Distributed under the MIT License. See `LICENSE` for more information.
