// Post card component for the post list
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, MessageCircle, Tag } from 'lucide-react';
import { PostWithDetails } from '../../types';

interface PostCardProps {
  post: PostWithDetails;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.featuredImage && (
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <Tag className="h-3 w-3 mr-1" />
            {post.category.name}
          </span>
          <span className="text-sm text-gray-500 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(post.createdAt)}
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={post.author.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
              alt={post.author.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author.username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments.length}
            </span>
            <Link
              to={`/post/${post.id}`}
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Read more
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;