// Comment list component
import React from 'react';
import { Calendar } from 'lucide-react';
import { Comment } from '../../types';

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
          <img
            src={comment.author?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
            alt={comment.author?.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                {comment.author?.username}
              </span>
              <span className="text-xs text-gray-500 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;