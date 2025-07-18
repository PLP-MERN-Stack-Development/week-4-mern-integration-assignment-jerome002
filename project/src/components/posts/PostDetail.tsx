// Detailed post view component
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, User, MessageCircle, Tag, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { ApiService } from '../../services/api';
import { PostWithDetails, Comment } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import CommentForm from '../comments/CommentForm';
import CommentList from '../comments/CommentList';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getPostById(id);
      
      if (response.success && response.data) {
        setPost(response.data);
      } else {
        setError(response.error || 'Post not found');
      }
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await ApiService.deletePost(post.id);
      
      if (response.success) {
        navigate('/');
      } else {
        alert(response.error || 'Failed to delete post');
      }
    } catch (err) {
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    if (post) {
      setPost({
        ...post,
        comments: [newComment, ...post.comments]
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={fetchPost} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link to="/" className="text-indigo-600 hover:text-indigo-500">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = auth.isAuthenticated && auth.user?.id === post.authorId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>

        {/* Post Header */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {post.featuredImage && (
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  <Tag className="h-4 w-4 mr-1" />
                  {post.category.name}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(post.createdAt)}
                </span>
              </div>

              {canEdit && (
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/edit/${post.id}`}
                    className="flex items-center px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center px-3 py-1 text-sm font-medium text-red-600 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="flex items-center mb-6">
              <img
                src={post.author.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                alt={post.author.username}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{post.author.username}</p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Comments ({post.comments.length})
          </h3>

          {auth.isAuthenticated ? (
            <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                Please{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
                  login
                </Link>{' '}
                to leave a comment.
              </p>
            </div>
          )}

          <CommentList comments={post.comments} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;