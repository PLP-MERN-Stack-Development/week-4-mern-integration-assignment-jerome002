import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import PostList from './components/posts/PostList';
import PostDetail from './components/posts/PostDetail';
import PostForm from './components/posts/PostForm';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PostList />} />
            <Route path="post/:id" element={<PostDetail />} />
            <Route path="create" element={
              <ProtectedRoute>
                <PostForm />
              </ProtectedRoute>
            } />
            <Route path="edit/:id" element={
              <ProtectedRoute>
                <PostForm />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;