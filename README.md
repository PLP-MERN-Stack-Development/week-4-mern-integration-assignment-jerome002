📝 Full Stack Blog Application

A modern MERN-style full stack blog application with categories and posts functionality.  
Frontend built with **React + Vite + Tailwind CSS**, and backend using **Node.js + Express + MongoDB**.

## 🌐 Live Demo

- 🔗 Frontend: [https://myblog-frontend.netlify.app](https://myblog-frontend.netlify.app)  
- 🔗 Backend API: [https://blog-backend-kqju.onrender.com](https://blog-backend-kqju.onrender.com)

---

## 📁 Project Structure

myblog/
│
├── frontend/ # React + Vite + Tailwind app
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── api/ # Axios API setup
│ └── .env # VITE_API_URL=...
│
└── server/ # Express + MongoDB backend
├── models/
├── routes/
├── .env
└── index.js

yaml
Copy
Edit

---

## 🚀 Features

- 🔐 Category and post management (CRUD)
- 🌐 RESTful API with Express.js
- 📦 MongoDB database (hosted on MongoDB Atlas)
- ⚡ Fast frontend with Vite and Tailwind CSS
- 🌍 Deployed backend on Render
- 🌐 Deployed frontend on Netlify

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd your-repo-name
2. Backend Setup (/server)
bash
Copy
Edit
cd server
npm install
👉 Create .env file in /server:
env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_atlas_connection
Run backend
bash
Copy
Edit
npm start
3. Frontend Setup (/frontend)
bash
Copy
Edit
cd frontend
npm install
👉 Create .env file in /frontend:
env
Copy
Edit
VITE_API_URL=https://blog-backend-kqju.onrender.com/api
Run frontend
bash
Copy
Edit
npm run dev
📦 Deployment
Frontend (Netlify)
Setup VITE_API_URL environment variable in Netlify settings.

Connect to GitHub repo and deploy.

Backend (Render)
Setup MONGO_URI environment variable in Render service settings.

Use a web service with npm start as the start command.

🧠 Technologies Used
Frontend: React, Vite, Tailwind CSS, Axios

Backend: Node.js, Express.js, MongoDB, Mongoose

Validation: express-validator

Hosting: Netlify (frontend), Render (backend)

📷 Screenshots
Add screenshots of your blog UI (homepage, post page, create form, etc.) here.

🧑‍💻 Author
Jerome Kapkor Kimosop
GitHub | LinkedIn

📄 License
MIT License - Feel free to use and modify.

yaml
Copy
Edit
