import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

function ViewPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error('Error fetching post', err));
  }, [id]);

  if (!post) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-600 text-lg">Loading post...</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h2>

      {post.category?.name && (
        <p className="text-sm text-blue-600 mb-4">
          <span className="font-semibold">Category:</span> {post.category.name}
        </p>
      )}

      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>
    </div>
  );
}

export default ViewPost;
