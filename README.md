# 📚 BookBurst - Social Reading Tracker

**BookBurst** is a full-stack web application for tracking your reading journey and discovering new books through a social community.  
Keep track of what you're reading, want to read, or have finished — all while discovering trending books via community activity.

---

<img align="center" alt="coding" width="600" height="350" src="https://raw.githubusercontent.com/dk-talks/pwLabsCheckRepo/refs/heads/main/WeatherAppPhotos/Screenshot%202025-04-26%20at%206.49.18%20PM.png">

---

## ✨ Features

### 📚 Personal Bookshelf Management
- Track books with three status options: **Reading**, **Finished**, **Want to Read**
- Rate books and add personal notes
- Organize books in a tabbed interface

### 🔍 Book Discovery
- Search and add books via **Google Books API**
- Explore trending and popular books in the community
- View public bookshelves of other users

### 👤 User Authentication
- Secure login/signup with email and password
- Protected routes for authenticated users
- Session management with JWT

### 📱 Responsive Design
- Fully responsive UI that works on desktop and mobile devices

### 🍪 Smart Preferences
- Remembers your last selected bookshelf tab

---

## 🛠 Tech Stack

### Frontend:
- **Next.js 15.3** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Context** for state management

### Backend:
- **Next.js API Routes**
- **MongoDB** with **Mongoose** for data storage
- **Google Books API** for book data

### Authentication:
- **NextAuth.js** for secure authentication
- **JWT** for session management

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account or local MongoDB instance
- Google Books API key

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/bookburst.git
    cd bookburst
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env.local` file in the root directory with the following variables:
    ```plaintext
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_SECRET=your_random_secret_key
    NEXTAUTH_URL=http://localhost:3000
    GOOGLE_BOOKS_API_KEY=your_google_books_api_key
    ```

4. Run the development server:
    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---


---

## 📦 Deployment

The application is deployed on **Vercel**: [https://book-burst-dinesh-sharmas-projects-3334b3bb.vercel.app/](https://book-burst-dinesh-sharmas-projects-3334b3bb.vercel.app/)

### To deploy your own instance:
- Push your code to GitHub
- Import the project to Vercel
- Configure the required environment variables
- Deploy!

---

## 🧠 Challenges and Learnings

- Integrating Google Books API for book search
- Setting up TypeScript types across the application
- Building a secure authentication flow with NextAuth.js
- Creating a responsive UI that works well across devices

---

## 🔮 Future Enhancements

- Reading progress tracking (page numbers or percentages)
- Book clubs and group reading features
- Reading challenges and goals
- Advanced book recommendations based on reading history
- Dark mode support

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [MongoDB](https://www.mongodb.com/)
- [Google Books API](https://developers.google.com/books)

---

## ⭐ Support

If you found this project interesting, please consider giving it a ⭐ on GitHub!

---
