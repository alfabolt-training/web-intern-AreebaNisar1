import axios from 'axios';
import { Post, Comment } from '@/types';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Local storage keys
const NESTED_COMMENTS_KEY = 'nested_comments';
const LOCAL_POSTS_KEY = 'local_posts';

// Helper function to get nested comments from localStorage
const getLocalComments = (): Comment[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(NESTED_COMMENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper function to save nested comments to localStorage
const saveLocalComments = (comments: Comment[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NESTED_COMMENTS_KEY, JSON.stringify(comments));
};

// Helper function to get local posts from localStorage
const getLocalPosts = (): Post[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LOCAL_POSTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper function to save local posts to localStorage
const saveLocalPosts = (posts: Post[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
};

// Posts API with local storage support
export const getPosts = async (): Promise<Post[]> => {
  // Get API posts
  const response = await axios.get(`${API_BASE_URL}/posts`);
  const apiPosts = response.data;

  // Get local posts
  const localPosts = getLocalPosts();

  // Combine and return all posts (local posts first for visibility)
  return [...localPosts, ...apiPosts];
};

export const getPost = async (id: number): Promise<Post> => {
  // Check local posts first
  const localPosts = getLocalPosts();
  const localPost = localPosts.find(post => post.id === id);
  if (localPost) {
    return localPost;
  }

  // Fall back to API
  const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
  return response.data;
};

export const createPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  const localPosts = getLocalPosts();

  // Generate a unique ID (negative to distinguish from API posts)
  const newId = Math.min(-1, ...localPosts.map(p => p.id), -1) - 1;

  const newPost: Post = {
    ...post,
    id: newId,
  };

  // Add to local storage
  localPosts.push(newPost);
  saveLocalPosts(localPosts);

  return newPost;
};

export const updatePost = async (id: number, post: Partial<Post>): Promise<Post> => {
  const localPosts = getLocalPosts();
  const postIndex = localPosts.findIndex(p => p.id === id);

  if (postIndex !== -1) {
    // Update local post
    localPosts[postIndex] = { ...localPosts[postIndex], ...post };
    saveLocalPosts(localPosts);
    return localPosts[postIndex];
  } else {
    // Update API post (though API doesn't persist changes)
    const response = await axios.put(`${API_BASE_URL}/posts/${id}`, post);
    return response.data;
  }
};

export const deletePost = async (id: number): Promise<void> => {
  const localPosts = getLocalPosts();
  const filteredPosts = localPosts.filter(p => p.id !== id);

  if (filteredPosts.length !== localPosts.length) {
    // Post was local, remove from localStorage
    saveLocalPosts(filteredPosts);
  } else {
    // Post is from API, delete from API (though API doesn't persist)
    await axios.delete(`${API_BASE_URL}/posts/${id}`);
  }
};

// Comments API with local nesting support
export const getComments = async (postId: number): Promise<Comment[]> => {
  // Get API comments
  const response = await axios.get(`${API_BASE_URL}/posts/${postId}/comments`);
  const apiComments = response.data;

  // Get local nested comments for this post
  const localComments = getLocalComments().filter(comment => comment.postId === postId);

  // Combine and return all comments
  return [...apiComments, ...localComments];
};

export const createComment = async (comment: Omit<Comment, 'id'>): Promise<Comment> => {
  const localComments = getLocalComments();

  // Generate a unique ID (negative to distinguish from API comments)
  const newId = Math.min(-1, ...localComments.map(c => c.id), -1) - 1;

  const newComment: Comment = {
    ...comment,
    id: newId,
  };

  // Add to local storage
  localComments.push(newComment);
  saveLocalComments(localComments);

  return newComment;
};

export const updateComment = async (id: number, comment: Partial<Comment>): Promise<Comment> => {
  const localComments = getLocalComments();
  const commentIndex = localComments.findIndex(c => c.id === id);

  if (commentIndex !== -1) {
    // Update local comment
    localComments[commentIndex] = { ...localComments[commentIndex], ...comment };
    saveLocalComments(localComments);
    return localComments[commentIndex];
  } else {
    // Update API comment (though API doesn't persist changes)
    const response = await axios.put(`${API_BASE_URL}/comments/${id}`, comment);
    return response.data;
  }
};

export const deleteComment = async (id: number): Promise<void> => {
  const localComments = getLocalComments();
  const filteredComments = localComments.filter(c => c.id !== id);

  if (filteredComments.length !== localComments.length) {
    // Comment was local, remove from localStorage
    saveLocalComments(filteredComments);
  } else {
    // Comment is from API, delete from API (though API doesn't persist)
    await axios.delete(`${API_BASE_URL}/comments/${id}`);
  }
};
