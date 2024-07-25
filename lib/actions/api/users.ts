
import { TopCreator, TopCreatorSchema, User } from "@/validations";
import { z } from "zod";


export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'bannerImage' | 'bio' | 'password' | 'emailVerified' | 'phone'>;
export type UpdateUserInput = Partial<CreateUserInput>;

/**
 * Creates a new user
 * @param {CreateUserInput} data - The data for creating a new user
 * @returns {Promise<User>} The created user object
 */
export async function createUser(data: CreateUserInput): Promise<User> {

  const response = await fetch('http://localhost:3000/api/users/me', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  const userData = await response.json();
  return await userData;
}

/**
 * Updates a user's information or performs friend-related actions.
 * @param userId - The ID of the user to update.
 * @param payload - The payload containing the update data or action details.
 * @returns A promise that resolves to the response from the server.
 */
export async function updateUser(payload: UpdateUserInput): Promise<Response> {
  const response = await fetch(`/api/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response;
}

/**
 * Updates a user's profile information.
 * @param data - The user data to update.
 */
export async function updateUserProfile(data: UpdateUserInput) {
  
}

/**
 * Sends a friend request to another user.
 * @param userId - The ID of the user sending the request.
 * @param targetUserId - The ID of the user to send the request to.
 */
export async function sendFriendRequest(targetUserId: string) {
  
}

/**
 * Removes a friend from the user's friend list.
 * @param userId - The ID of the user removing the friend.
 * @param targetUserId - The ID of the user to be removed from the friend list.
 */
export async function removeFriend(targetUserId: string){
  
}


/**
 * Gets the top creators
 * @param {number} [limit=3] - The number of top creators to retrieve
 * @returns {Promise<TopCreator[]>} An array of top creators
 */
export async function getTopCreators(limit: number = 3): Promise<TopCreator[]> {
  const response = await fetch(`/api/users/creators?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch top creators');
  }

  const data = await response.json();
  return z.array(TopCreatorSchema).parse(data);
}