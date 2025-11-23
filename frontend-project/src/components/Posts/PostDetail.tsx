'use client';

import React, { useState, useEffect } from 'react';
import { Post } from '@/types';
import { getPost, updatePost, deletePost } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CommentsList from '@/components/Comments/CommentsList';

interface PostDetailProps {
  postId: number;
}

const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const data = await getPost(postId);
      setPost(data);
      setEditTitle(data.title);
      setEditBody(data.body);
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    if (!post) return;
    setSaving(true);
    try {
      await updatePost(post.id, { title: editTitle, body: editBody, userId: post.userId });
      setPost({ ...post, title: editTitle, body: editBody });
      setEditing(false);
    } catch (error) {
      alert('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post.id);
        router.push('/');
      } catch (error) {
        alert('Failed to delete post');
      }
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (post) {
      setEditTitle(post.title);
      setEditBody(post.body);
    }
  };

  if (loading) return <div className="text-center py-8">Loading post...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!post) return <div className="text-center py-8">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        ← Back to Posts
      </Link>

      <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
        <div className="p-6">
          {editing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black placeholder-gray-500"
                placeholder="Post title"
              />
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black placeholder-gray-500"
                placeholder="Post content"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                {isAuthenticated && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEdit}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{post.body}</p>
              <div className="pt-6 border-t border-gray-200">
                <span className="text-sm text-gray-500">User ID: {post.userId}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <CommentsList postId={postId} />
    </div>
  );
};

export default PostDetail;
