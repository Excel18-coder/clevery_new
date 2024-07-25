import { Conversation, ConversationSchema, Payload, payloadSchema,sendMessageSchema, updateMessageSchema } from '@/validations';
import axios from 'axios';

// Action types for conversations and messages
type ConversationAction = 'createConversation' | 'sendMessage' | 'editMessage' | 'markAsSeen' | 'getConversation';
type MessageAction = 'sendMessage' | 'updateMessage' | 'deleteMessage' | 'markAsSeen';
type Action = ConversationAction | MessageAction;

// Interfaces for payloads
interface BasePayload {
  action: Action;
}

interface ConversationPayload extends BasePayload {
  action: ConversationAction;
  user1Id?: string;
  user2Id?: string;
  messageText?: string;
  messageId?: string;
  conversationId?: string;
  file?: string;
  editedText?: string;
}

interface MessagePayload extends BasePayload {
  conversationId: string;
  message: Message;
}

interface UpdateMessagePayload{
  messageId: string;
  text?: string;
  file?: string;
}
// Message interface
interface Message {
  id: string;
  text: string;
  file?: string;
  conversationId: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Performs various operations on conversations and messages.
 * @param payload - The payload containing the action and necessary data.
 * @returns A promise that resolves to the response from the server.
 * @throws Will throw an error if the server responds with a non-2xx status code.
 */
async function performAction(payload: Payload): Promise<Response> {
  payloadSchema.parse(payload);
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to perform action: ${payload.action}`);
  }

  return response;
}


/**
 * Gets or creates a conversation with another user
 * @param {string} otherUserId - The ID of the user to start/get a conversation with
 * @returns {Promise<Conversation>} The conversation object
 */
export async function getOrCreateConversation(otherUserId: string): Promise<Conversation> {
  const response = await axios.post('/api/conversations', {otherUserId })

  if (!response.data) {
    throw new Error('Failed to get or create conversation');
  }

  return await response.data;
}

/**
 * Creates a new conversation between two users.
 * @param user1Id - The ID of the first user.
 * @param user2Id - The ID of the second user.
 * @returns A promise that resolves to the created conversation.
 */
export function createConversation(user1Id: string, user2Id: string): Promise<Response> {
  return performAction({ action: 'createConversation', user1Id, user2Id });
}

/**
 * Fetches the details of a conversation, including messages.
 * @param conversationId - The ID of the conversation to fetch.
 * @returns A promise that resolves to the conversation details.
 */
export function getConversation(conversationId: string): Promise<Response> {
  return performAction({ action: 'getConversation', conversationId });
}

/**
 * Sends a message in a conversation.
 * @param conversationId - The ID of the conversation.
 * @example sendMessage({ conversationId: '456', text: 'Hello!' })
 * @returns A promise that resolves to the sent message.
 */
export async function sendMessage(payload: MessagePayload): Promise<Message> {
  const response = await performAction({...payload, action: 'sendMessage'});
  const data = await response.json();
  return await data
}

/**
 * Updates an existing message.
 * @param message - The updated message data.
 * @example updateMessage({ messageId: '123', text: 'New message text' })
 * @returns A promise that resolves to the updated message.
 */
export async function updateMessage(message: UpdateMessagePayload): Promise<Message> {
  const response = await performAction({action: 'updateMessage',...message});
  const data = await response.json();
  return await data
}

/**
 * Deletes a message.
 * @param messageId - The ID of the message to delete.
 * @returns A promise that resolves when the message is deleted.
 */
export async function deleteMessage(messageId: string): Promise<void> {
  await performAction({ action: 'deleteMessage', messageId });
}

/**
 * Marks messages as seen.
 * @param messageIds - An array of message IDs to mark as seen.
 * @returns A promise that resolves when the messages are marked as seen.
 */
export async function markMessagesAsSeen(messageIds: string[]): Promise<void> {
  await performAction({ action: 'markAsSeen', messageIds });
}

/**
 * Edits an existing message in a conversation.
 * @param messageId - The ID of the message to edit.
 * @param conversationId - The ID of the conversation.
 * @param editedText - The new text content of the message.
 */
export function editMessage(messageId: string, conversationId: string, editedText: string): Promise<Response> {
  return performAction({ action: 'editMessage', messageId, conversationId, editedText });
}