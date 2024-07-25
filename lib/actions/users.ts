import { updateUserProfile, sendFriendRequest, removeFriend, UpdateUserInput } from './api/users';

// In your component
export const handleUpdateProfile = async (userData: UpdateUserInput) => {
  try {
    // const response = await updateUserProfile( userData);
    // const result = await response.json();
    // console.log('Profile updated:', result.user);
    // Update UI to reflect the changes
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
};

export const handleSendFriendRequest = async (targetUserId: string) => {
  try {
    // const response = await sendFriendRequest( targetUserId);
    // const result = await response.json();
    // console.log('Friend request sent:', result.user);
    // Update UI to reflect the friend request
  } catch (error) {
    console.error('Failed to send friend request:', error);
  }
};
 
export const handleRemoveFriend = async (targetUserId: string) => {
  try {
    // const response = await removeFriend( targetUserId);
    // const result = await response.json();
    // console.log('Friend removed:', result.user);
    // Update UI to reflect the friend removal
  } catch (error) {
    console.error('Failed to remove friend:', error);
  }
};