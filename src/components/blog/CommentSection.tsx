'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/contexts/AuthContext';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    name: string | null;
    email: string;
  };
}

interface CommentSectionProps {
  blogId: number;
  initialCommentCount: number;
}

export function CommentSection({ blogId, initialCommentCount }: CommentSectionProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/blog/${blogId}/comments`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setComments(data.data);
            setCommentCount(data.pagination.total);
          }
        }
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();
  }, [blogId]);

  // Submit new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/blog/${blogId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setComments(prev => [data.data, ...prev]);
        setNewComment('');
        setCommentCount(prev => prev + 1);
      } else {
        setError(data.error || 'Failed to post comment');
      }
    } catch {
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAuthorInitial = (author: Comment['author']) => {
    return author.name?.charAt(0).toUpperCase() || author.email.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-neutral-100 mb-8 flex items-center gap-3">
        <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Comments ({commentCount})
      </h2>

      {/* Comment Form */}
      {authLoading ? (
        <div className="p-6 rounded-2xl bg-dark-100 border border-dark-100 mb-8">
          <div className="animate-pulse h-20 bg-dark-200 rounded-lg"></div>
        </div>
      ) : isAuthenticated ? (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-gradient-to-br from-dark-100 to-dark-200 border border-dark-100 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="mb-4"
              />
              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newComment.trim()}
                  size="sm"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-6 rounded-2xl bg-dark-100 border border-dark-100 mb-8 text-center">
          <p className="text-neutral-400 mb-4">You must be logged in to comment.</p>
          <Button href="/login" variant="primary" size="sm">
            Log In to Comment
          </Button>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-6 rounded-2xl bg-dark-100 border border-dark-100 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-dark-200"></div>
                <div className="flex-1">
                  <div className="h-4 bg-dark-200 rounded w-32 mb-2"></div>
                  <div className="h-16 bg-dark-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="p-8 rounded-2xl bg-dark-100 border border-dark-100 text-center">
          <svg className="w-12 h-12 text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-neutral-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="p-6 rounded-2xl bg-dark-100 border border-dark-100 hover:border-primary-500/20 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/50 to-accent-500/50 flex items-center justify-center text-white font-medium flex-shrink-0">
                  {getAuthorInitial(comment.author)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-neutral-200">{comment.author.name || 'Anonymous'}</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-sm text-neutral-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-neutral-400 whitespace-pre-wrap break-words">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
