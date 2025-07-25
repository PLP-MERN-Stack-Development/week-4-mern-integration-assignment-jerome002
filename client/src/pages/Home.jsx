import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get('/posts')
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          console.error('Unexpected API response:', data);
          setPosts([]);
        }
      })
      .catch((err) => console.error('Error fetching posts:', err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">All Blog Posts</h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        posts.map(post => (
          <div
            key={post._id}
            className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4">
              {post.excerpt || post.content?.slice(0, 100)}...
            </p>
            <Link
              to={`/posts/${post._id}`}
              className="inline-block text-blue-600 hover:text-blue-800 font-medium"
            >
              Read more →
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
