import React from 'react';
import { Link } from 'react-router-dom';

function PostList({ posts = [] }) {
  if (!posts.length) return <p className="text-gray-600 text-center mt-10">No posts available.</p>;

  return (
    <div className="grid gap-6 mt-6">
      {posts.map(post => (
        <div
          key={post._id}
          className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
          <p className="text-gray-600 mb-4">
            {post.excerpt || post.content.slice(0, 100)}...
          </p>
          <Link
            to={`/posts/${post._id}`}
            className="text-blue-600 hover:underline font-medium"
          >
            Read more →
          </Link>
        </div>
      ))}
    </div>
  );
}

export default PostList;
