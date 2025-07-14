📝 MERN Blog Application
A full-stack MERN (MongoDB, Express.js, React.js, Node.js) blog platform that supports creating, viewing, editing, and deleting blog posts with category management.

🚀 Features
🗂 View all blog posts

📝 Create and edit posts with category selection

❌ Delete posts

📚 Category management

📡 RESTful API using Express & MongoDB

⚛️ Front-end built with React + Vite

📦 State management with React Hooks

✅ Form validation using express-validator

⚠️ Error handling middleware

(Optional Advanced Feature – to be added: e.g. Comments or Auth)

📁 Project Structure
bash
Copy
Edit
mern-blog/
├── client/               # React Frontend
│   ├── src/
│   │   ├── components/   # Reusable components (PostList, PostForm)
│   │   ├── pages/        # Route views (Home, CreatePost, etc.)
│   │   ├── services/     # Axios API handler
│   │   ├── App.jsx       # App layout & routes
│   │   └── main.jsx      # Vite entry point
│   └── .env.example
├── server/               # Express + MongoDB backend
│   ├── models/           # Mongoose models (Post, Category)
│   ├── routes/           # Express route handlers
│   ├── server.js         # Entry point & MongoDB connection
│   └── .env.example
└── README.md
🔧 Setup Instructions
📦 Prerequisites
Node.js v18+

MongoDB installed & running

Git

⚙️ Installation
bash
Copy
Edit
# Clone the repository
git clone https://github.com/YOUR_GITHUB_USERNAME/mern-blog.git
cd mern-blog

# Set up server
cd server
cp .env.example .env
npm install
npm run dev
bash
Copy
Edit
# Set up client
cd ../client
cp .env.example .env
npm install
npm run dev
🌐 Environment Variables
/server/.env.example
ini
Copy
Edit
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-blog
NODE_ENV=development
/client/.env.example
bash
Copy
Edit
VITE_API_URL=http://localhost:5000/api
🧪 API Documentation
📄 Posts API
Method	Endpoint	Description
GET	/api/posts	Get all posts
GET	/api/posts/:id	Get a post by ID
POST	/api/posts	Create a new post
PUT	/api/posts/:id	Update a post by ID
DELETE	/api/posts/:id	Delete a post by ID

🗂 Categories API
Method	Endpoint	Description
GET	/api/categories	Get all categories
POST	/api/categories	Create a new category



✅ Status
✅ Basic features implemented
🚧 Advanced features pending (e.g. comments, auth, image upload)

👨‍💻 Author
Jerome Kapkor Kimosop