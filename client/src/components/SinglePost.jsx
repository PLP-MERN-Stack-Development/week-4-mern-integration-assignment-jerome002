import React from 'react';

function SinglePost({ post }) {
  if (!post) return <p className="text-center text-gray-600 mt-10">Loading post...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow mt-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
      
      <p className="text-gray-500 text-sm mb-6">
        {new Date(post.createdAt).toLocaleDateString()}
      </p>

      <div className="text-gray-800 leading-relaxed space-y-4">
        {post.content.split('\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

export default SinglePost;
