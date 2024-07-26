import axios, { AxiosError } from 'axios';
import { Server, CreateServer, UpdateServer, Channel, CreateChannel, UpdateChannel, Member, Message } from '@/validations';
import { endpoint } from '../env';

export interface UpdateMessagePayload {
  serverId: string;
  channelId: string;
  messageId: string;
  text?: string;
  image?: string;
}

export interface DeleteMessagePayload {
  serverId: string;
  channelId: string;
  messageId: string;
}

export interface ChannelMessagePayload {
  serverId: string;
  channelId: string;
  text?: string;
  image?: string;
}

/**
 * API client for managing servers, channels, and messages.
 */
export const serverApi = {
  /**
   * Retrieves all servers.
   * @returns A promise that resolves to an array of servers.
   * @throws Error with a descriptive message if the request fails.
   */
  getAllServers: async (): Promise<Server[]> => {
    try {
      const response = await axios.get<Server[]>(`${endpoint}/servers`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch servers");
    }
  },

  /**
   * Retrieves the top 10 servers with the most members.
   * @returns A promise that resolves to an array of servers.
   * @throws Error with a descriptive message if the request fails.
   */
  getTopServers: async (): Promise<Server[]> => {
    try {
      const response = await axios.get<Server[]>(`${endpoint}/servers/top`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch top servers");
    }
  },

  /**
   * Retrieves a server by its ID, including its channels, logs, and members.
   * @param serverId - The ID of the server to fetch.
   * @returns A promise that resolves to the server with its details.
   * @throws Error with a descriptive message if the request fails.
   */
  getServerById: async (serverId: string): Promise<Server> => {
    try {
      const response = await axios.get<Server>(`${endpoint}/servers/${serverId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Server not found');
      }
      throw handleApiError(error, `Failed to fetch server with ID ${serverId}`);
    }
  },

  /**
   * Creates a new server.
   * @param serverData - The data for creating a new server.
   * @returns A promise that resolves to the created server.
   * @throws Error with a descriptive message if the request fails.
   */
  createServer: async (serverData: CreateServer): Promise<Server> => {
    try {
      const response = await axios.post<Server>(`${endpoint}/servers`, serverData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to create server");
    }
  },

  /**
   * Updates an existing server.
   * @param serverId - The ID of the server to update.
   * @param updateData - The data to update on the server.
   * @returns A promise that resolves to the updated server.
   * @throws Error with a descriptive message if the request fails.
   */
  updateServer: async (serverId: string, updateData: UpdateServer): Promise<Server> => {
    try {
      const response = await axios.patch<Server>(`${endpoint}/servers/${serverId}`, updateData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to update server with ID ${serverId}`);
    }
  },

  /**
   * Deletes a server.
   * @param serverId - The ID of the server to delete.
   * @returns A promise that resolves when the server is successfully deleted.
   * @throws Error with a descriptive message if the request fails.
   */
  deleteServer: async (serverId: string): Promise<void> => {
    try {
      await axios.delete(`${endpoint}/servers/${serverId}`);
    } catch (error) {
      throw handleApiError(error, `Failed to delete server with ID ${serverId}`);
    }
  },

  /**
   * Retrieves a channel by its ID, including its messages and server details.
   * @param channelId - The ID of the channel to fetch.
   * @returns A promise that resolves to the channel with its details.
   * @throws Error with a descriptive message if the request fails.
   */
  getChannelById: async (channelId: string): Promise<Channel> => {
    try {
      const response = await axios.get<Channel>(`${endpoint}/channels/${channelId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch channel with ID ${channelId}`);
    }
  },

  /**
   * Retrieves all channels for a specific server.
   * @param serverId - The ID of the server to fetch channels from.
   * @returns A promise that resolves to an array of channels.
   * @throws Error with a descriptive message if the request fails.
   */
  getServerChannels: async (serverId: string): Promise<Channel[]> => {
    try {
      const response = await axios.get<Channel[]>(`${endpoint}/servers/${serverId}/channels`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch channels for server with ID ${serverId}`);
    }
  },

  /**
   * Creates a new channel in a server.
   * @param serverId - The ID of the server to create the channel in.
   * @param channelData - The data for creating a new channel.
   * @returns A promise that resolves to the created channel.
   * @throws Error with a descriptive message if the request fails.
   */
  createChannel: async (serverId: string, channelData: CreateChannel): Promise<Channel> => {
    try {
      const response = await axios.post<Channel>(`${endpoint}/servers/${serverId}/channels`, channelData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to create channel in server with ID ${serverId}`);
    }
  },

  /**
   * Sends a new message to a channel.
   * @param messageData - The data for the new message, including serverId and channelId.
   * @returns A promise that resolves to the created message with sender details.
   * @throws Error with a descriptive message if the request fails.
   */
  sendChannelMessage: async (messageData: ChannelMessagePayload): Promise<Message> => {
    try {
      const response = await axios.post<Message>(
        `${endpoint}/servers/${messageData.serverId}/channels/${messageData.channelId}/msg`,
        messageData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to send message");
    }
  },

  /**
   * Retrieves all messages for a specific channel.
   * @param channelId - The ID of the channel to fetch messages from.
   * @returns A promise that resolves to an array of messages.
   * @throws Error with a descriptive message if the request fails.
   */
  getChannelMessages: async (channelId: string): Promise<Message[]> => {
    try {
      const response = await axios.get<Message[]>(`${endpoint}/channels/${channelId}/messages`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch messages for channel with ID ${channelId}`);
    }
  },

  /**
   * Retrieves a single message by its ID.
   * @param messageId - The ID of the message to fetch.
   * @returns A promise that resolves to the message with its details.
   * @throws Error with a descriptive message if the request fails.
   */
  getMessageById: async (messageId: string): Promise<Message> => {
    try {
      const response = await axios.get<Message>(`${endpoint}/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch message with ID ${messageId}`);
    }
  },

  /**
   * Edits a message in a channel.
   * @param updateData - The data to update on the message, including serverId, channelId, and messageId.
   * @returns A promise that resolves to the updated message.
   * @throws Error with a descriptive message if the request fails.
   */
  editChannelMessage: async (updateData: UpdateMessagePayload): Promise<Message> => {
    try {
      const response = await axios.patch<Message>(
        `${endpoint}/server/${updateData.serverId}/channels/${updateData.channelId}/messages/${updateData.messageId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to edit message with ID ${updateData.messageId}`);
    }
  },

  /**
   * Deletes a message in a channel.
   * @param deleteData - The data identifying the message to delete, including serverId, channelId, and messageId.
   * @returns A promise that resolves when the message is successfully deleted.
   * @throws Error with a descriptive message if the request fails.
   */
  deleteChannelMessage: async (deleteData: DeleteMessagePayload): Promise<void> => {
    try {
      await axios.delete(
        `${endpoint}/server/${deleteData.serverId}/channels/${deleteData.channelId}/messages/${deleteData.messageId}`
      );
    } catch (error) {
      throw handleApiError(error, `Failed to delete message with ID ${deleteData.messageId}`);
    }
  },

  /**
   * Retrieves all members for a specific server.
   * @param serverId - The ID of the server to fetch members from.
   * @returns A promise that resolves to an array of members.
   * @throws Error with a descriptive message if the request fails.
   */
  getServerMembers: async (serverId: string): Promise<Member[]> => {
    try {
      const response = await axios.get<Member[]>(`${endpoint}/servers/${serverId}/members`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch members for server with ID ${serverId}`);
    }
  },

  /**
   * Updates an existing channel in a server.
   * @param serverId - The ID of the server containing the channel.
   * @param channelId - The ID of the channel to update.
   * @param updateData - The data to update on the channel.
   * @returns A promise that resolves to the updated channel.
   * @throws Error with a descriptive message if the request fails.
   */
  updateChannel: async (serverId: string, channelId: string, updateData: UpdateChannel): Promise<Channel> => {
    try {
      const response = await axios.patch<Channel>(`${endpoint}/servers/${serverId}/channels/${channelId}`, updateData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to update channel with ID ${channelId}`);
    }
  },

  /**
   * Deletes a channel from a server.
   * @param serverId - The ID of the server containing the channel.
   * @param channelId - The ID of the channel to delete.
   * @returns A promise that resolves when the channel is successfully deleted.
   * @throws Error with a descriptive message if the request fails.
   */
  deleteChannel: async (serverId: string, channelId: string): Promise<void> => {
    try {
      await axios.delete(`${endpoint}/servers/${serverId}/channels/${channelId}`);
    } catch (error) {
      throw handleApiError(error, `Failed to delete channel with ID ${channelId}`);
    }
  },
};

/**
 * Handles API errors and returns a more informative error message
 * @param error - The error object from the API call
 * @param defaultMessage - A default message to use if a more specific one can't be determined
 * @returns An Error object with a descriptive message
 */
function handleApiError(error: unknown, defaultMessage: string): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response) {
      return new Error(axiosError.response.data.message || `${defaultMessage}: ${axiosError.response.status}`);
    } else if (axiosError.request) {
      return new Error(`${defaultMessage}: No response received`);
    }
  }
  return new Error(defaultMessage);
}