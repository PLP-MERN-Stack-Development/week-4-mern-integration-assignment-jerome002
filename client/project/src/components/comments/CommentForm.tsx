// Comment form component
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { ApiService } from '../../services/api';
import { Comment } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface CommentFormProps {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { auth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !auth.user) return;

    try {
      setSubmitting(true);
      const response = await ApiService.createComment({
        postId,
        authorId: auth.user.id,
        content: content.trim()
      });

      if (response.success && response.data) {
        onCommentAdded(response.data);
        setContent('');
      } else {
        alert(response.error || 'Failed to add comment');
      }
    } catch (err) {
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex space-x-3">
        <img
          src={auth.user?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
          alt={auth.user?.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            required
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;