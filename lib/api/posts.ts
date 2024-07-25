import { CreatePostInput } from '@/validations';
import { createPost, interactWithPost, updatePost, UpdatePostInput } from '../actions/api/post';
import axios from 'axios';
import { endpoint } from '../env';


export async function getPosts() {
  try {
   const response = await fetch('/api/posts?page=1&limit=10&search=nextjs&sortBy=likes&sortOrder=desc');
   const data = await response.json();
   console.log(data);
  } catch (error) {
   console.error("Failed to fetch posts:", error);
  }
} 

// Creating a new post
/**
 * 
 * @param post - The data for creating a new post.
 * @returns Promise<Post>
 * @throws Error
 * @example
 * createNewPost({ title: 'My new post', content: 'This is my new post' })  
 **/
export async function createNewPost(post:CreatePostInput) {
  try {
    const newPost = await createPost(post);
    return newPost;
    console.log(newPost);
  } catch (error) {
    console.error("Failed to create post:", error);
  }
}

export const getPostById = async (postId:string)=> {
  try {
    console.log(postId)
    const response = await axios.get(`${endpoint}/posts/${postId}`)
    return response.data; 
  } catch (error:any) {
    console.log(error.message)
  }
}


export const getUserPosts = async (authorId:string) => {
  try {
    const response = await axios.get(`${endpoint}/posts/author/${authorId}`)
    return response.data;
  } catch (error:any) {
    console.log(error.message)
    throw error
  }
};

// Updating an existing post
/**
 * 
 * @param post - The data for updating an existing post.
 * @param postId - The ID of the post to update.
 * @returns Promise<Post>
 * @throws Error
 * @example
 * updateExistingPost({ title: 'My updated post', content: 'This is my updated post' }, 'my-post-id')
 */
export async function updateExistingPost({ post, postId}:{post:UpdatePostInput, postId: string}) {
  try {
    const updatedPost = await updatePost(postId, post);
    console.log(updatedPost);
  } catch (error) {
    console.error("Failed to update post:", error);
  }
}


// Toggle like on a post
/**
 * 
 * @param postId - The ID of the post to like.
 * @returns Promise<Post | Comment>
 * @throws Error
 **/
export async function likePost(postId: string) {
  try {
    const updatedPost = await interactWithPost(postId, { action: 'like' });
    console.log(updatedPost);
  } catch (error) {
    console.error("Failed to toggle like on post:", error);
  }
}

// Toggle save on a post
export async function savePost(postId: string) {
  try {
    const updatedPost = await interactWithPost(postId, { action: 'save' });
    console.log(updatedPost);
  } catch (error) {
    console.error("Failed to toggle save on post:", error);
  }
}

// Add a comment to a post
/**
 * 
 * @param commentObj - {postId: string, comment: string}
 * @returns Promise<Post | Comment>
 */
export async function commentPost( commentObj :{postId: string, comment: string}) {
  try {
    const newComment = await interactWithPost(commentObj.postId, { 
      action: 'comment', 
      comment: commentObj.comment
    });
    console.log(newComment);
  } catch (error) {
    console.error("Failed to add comment to post:", error);
  }
}

// Delete a comment from a post
/**
 * 
 * @param postId - The ID of the post to delete a comment from
 * @param commentId - The ID of the comment to delete
 */
export async function deleteComment(postId: string, commentId: string) {
  try {
    const updatedPost = await interactWithPost(postId, { action: 'comment', commentId });
    console.log(updatedPost);
  } catch (error) {
    console.error("Failed to delete comment from post:", error);
  }
}
