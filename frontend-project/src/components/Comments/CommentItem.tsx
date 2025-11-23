'use client';

import React, { useState } from 'react';
import { Comment as CommentType } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { deleteComment } from '@/lib/api';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: CommentType;
  onUpdate: () => void;
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onUpdate,
  level = 0,
}) => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const isOwner = user?.email === comment.email;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      setDeleting(true);
      try {
        await deleteComment(comment.id);
        onUpdate();
      } catch (error) {
        alert('Failed to delete comment');
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleEditSuccess = () => {
    setEditing(false);
    onUpdate();
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onUpdate();
  };

  const marginLeft = level * 20; // Indentation for nested comments

  return (
    <div style={{ marginLeft }} className="border-l-2 border-gray-200 pl-4 py-2">
      {editing ? (
        <CommentForm
          postId={comment.postId}
          comment={comment}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-medium text-gray-900">{comment.name}</span>
              <span className="text-gray-500 text-sm ml-2">{comment.email}</span>
            </div>
            {isOwner && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditing(true)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-700 mb-2">{comment.body}</p>
          {user && (
            <button
              onClick={() => setShowReplyForm(true)}
              className="text-indigo-600 hover:text-indigo-900 text-sm"
            >
              Reply
            </button>
          )}
        </div>
      )}

      {showReplyForm && (
        <div className="mt-4">
          <CommentForm
            postId={comment.postId}
            parentId={comment.id}
            onSuccess={handleReplySuccess}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
