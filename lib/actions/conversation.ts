import { createConversation, sendMessage, markMessagesAsSeen, getConversation } from './api/conversation';

// In your component
const handleCreateConversation = async (user1Id: string, user2Id: string) => {
  try {
    const response = await createConversation(user1Id, user2Id);
    const { conversation } = await response.json();
    console.log('New conversation created:', conversation);
    // Update UI to show the new conversation
  } catch (error) {
    console.error('Failed to create conversation:', error);
  }
};

const handleSendMessage = async (userId: string, conversationId: string, messageText: string, file?: string) => {
  try {
    const response = await sendMessage(userId, conversationId, messageText, file);
    return response;
    // Update UI to show the new message
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};

const handleMarkAsSeen = async (messageId: string[]) => {
  try {
    const response = await markMessagesAsSeen(messageId);
    return response;
    // Update UI to reflect the seen status
  } catch (error) {
    console.error('Failed to mark message as seen:', error);
  }
};

const handleGetConversation = async (conversationId: string) => {
  try {
    const response = await getConversation(conversationId);
    return response;
    // Update UI to display the conversation and its messages
  } catch (error) {
    console.error('Failed to fetch conversation:', error);
  }
};