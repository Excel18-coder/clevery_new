import { CreatePostInput } from "@/validations";

type InteractionType = 'like' | 'save' | 'comment';

interface InteractionInput {
  action: InteractionType;
  comment?: string;
  commentId?: string;
}

/**
 * Represents a post in the application
 */
export interface Post {
  id: string;
  content: string;
  authorId: string;
  images: PostImage[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents an image associated with a post
 */
export interface PostImage {
  id: string;
  url: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
}
export type UpdatePostInput = Partial<CreatePostInput>;


/**
 * Creates a new post
 * @param {CreatePostInput} data - The data for creating a new post
 * @returns {Promise<Post>} The created post
 */
export async function createPost(data: CreatePostInput): Promise<Post> {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return response.json();
}

/**
 * Updates an existing post
 * @param {string} id - The ID of the post to update
 * @param {UpdatePostInput} data - The data to update in the post
 * @returns {Promise<Post>} The updated post
 */
export async function updatePost(id: string, data: UpdatePostInput): Promise<Post> {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update post');
  }

  return response.json();
}


/**
 * Interacts with a post (like, save, comment)
 * @param {string} postId - The ID of the post to interact with
 * @param {InteractionInput} data - The interaction data
 * @returns {Promise<Post | Comment>} The updated post or created/deleted comment
 */
export async function interactWithPost(postId: string, data: InteractionInput): Promise<Post | Comment> {
  const response = await fetch(`/api/posts/${postId}/interact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to interact with post');
  } 

  return response.json();
}
