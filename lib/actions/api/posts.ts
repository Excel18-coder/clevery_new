// utils/postActions.ts

/**
 * Represents the possible actions that can be performed on a post.
 */
type PostAction = 'like' | 'unlike' | 'comment' | 'save' | 'unsave';

/**
 * Interface for the request payload when performing a post action.
 */
interface PostActionPayload {
  /**
   * The ID of the user performing the action.
   */
  userId: string;
  /**
   * The action to be performed on the post.
   */
  action: PostAction;
  /**
   * The content of the comment (only required for 'comment' action).
   */
  content?: string;
}

/**
 * Constructs and sends a request to perform an action on a post.
 * @param postId - The ID of the post to perform the action on.
 * @param payload - The payload containing the action details.
 * @returns A promise that resolves to the response from the server.
 */
export async function performPostAction(postId: string, payload: PostActionPayload): Promise<Response> {
  const response = await fetch(`/api/post/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to perform post action');
  }

  return response;
}

/**
 * Likes a post.
 * @param postId - The ID of the post to like.
 * @param userId - The ID of the user liking the post.
 */
export function likePost(postId: string, userId: string): Promise<Response> {
  return performPostAction(postId, { userId, action: 'like' });
}

/**
 * Unlikes a post.
 * @param postId - The ID of the post to unlike.
 * @param userId - The ID of the user unliking the post.
 */
export function unlikePost(postId: string, userId: string): Promise<Response> {
  return performPostAction(postId, { userId, action: 'unlike' });
}

/**
 * Adds a comment to a post.
 * @param postId - The ID of the post to comment on.
 * @param userId - The ID of the user adding the comment.
 * @param content - The content of the comment.
 */
export function commentOnPost(postId: string, userId: string, content: string): Promise<Response> {
  return performPostAction(postId, { userId, action: 'comment', content });
}

/**
 * Saves a post.
 * @param postId - The ID of the post to save.
 * @param userId - The ID of the user saving the post.
 */
export function savePost(postId: string, userId: string): Promise<Response> {
  return performPostAction(postId, { userId, action: 'save' });
}

/**
 * Unsaves a post.
 * @param postId - The ID of the post to unsave.
 * @param userId - The ID of the user unsaving the post.
 */
export function unsavePost(postId: string, userId: string): Promise<Response> {
  return performPostAction(postId, { userId, action: 'unsave' });
}