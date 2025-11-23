'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createComment, updateComment } from '@/lib/api';
import { Comment } from '@/types';

interface CommentFormProps {
  postId: number;
  parentId?: number;
  comment?: Comment;
  onSuccess: () => void;
  onCancel: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  parentId,
  comment,
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();
  const [body, setBody] = useState(comment?.body || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      if (comment) {
        await updateComment(comment.id, { body });
      } else {
        await createComment({
          postId,
          name: user.name,
          email: user.email,
          body,
          parentId,
        });
      }
      onSuccess();
    } catch (err) {
      setError('Failed to save comment');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Please sign in to comment.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700">
          Comment
        </label>
        <textarea
          id="body"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white placeholder-gray-500"
          placeholder="Write your comment..."
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : comment ? 'Update' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
