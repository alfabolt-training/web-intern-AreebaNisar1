'use client';

import React, { useState, useEffect } from 'react';
import { Comment } from '@/types';
import { getComments } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

interface CommentsListProps {
  postId: number;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId }) => {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (err) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const buildCommentTree = (comments: Comment[]): (Comment & { replies: Comment[] })[] => {
    const commentMap = new Map<number, Comment & { replies: Comment[] }>();
    const rootComments: (Comment & { replies: Comment[] })[] = [];

    // Initialize all comments with replies array
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Build the tree
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const renderComments = (comments: (Comment & { replies: Comment[] })[], level = 0): React.JSX.Element[] => {
    return comments.flatMap(comment => [
      <CommentItem
        key={comment.id}
        comment={comment}
        onUpdate={fetchComments}
        level={level}
      />,
      ...renderComments(comment.replies as (Comment & { replies: Comment[] })[], level + 1),
    ]);
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view and post comments.</p>
      </div>
    );
  }

  if (loading) return <div className="text-center py-4">Loading comments...</div>;
  if (error) return <div className="text-center py-4 text-red-600">{error}</div>;

  const commentTree = buildCommentTree(comments);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Comments ({comments.length})</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
        >
          Add Comment
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 border">
          <CommentForm
            postId={postId}
            onSuccess={() => {
              setShowForm(false);
              fetchComments();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="space-y-4">
        {commentTree.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          renderComments(commentTree)
        )}
      </div>
    </div>
  );
};

export default CommentsList;
