'use client';

import React, { useState } from 'react';
import { Post } from '@/types';
import { deletePost } from '@/lib/api';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
  onUpdate: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      setDeleting(true);
      try {
        await deletePost(post.id);
        onUpdate();
      } catch (error) {
        alert('Failed to delete post');
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          <Link href={`/posts/${post.id}`} className="hover:text-indigo-600">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.body}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">User ID: {post.userId}</span>
          <div className="flex space-x-2">
            <Link
              href={`/posts/${post.id}`}
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              View
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
