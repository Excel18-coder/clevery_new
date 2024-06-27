import axios from "axios";
import { Channel, NewChannel, NewChannelMessage, NewServer, Server } from "@/types";
import { uploadImage, uploadImages } from "./general";
import { endpoint } from "../env";
import { Alert } from "react-native";


interface MessageData {
  channelId: string,
   message: Message
}
interface Message {
  content: string;
  sender: string;
  timestamp: Date;
}


  export async function createServer ({creatorId,description,icon,members,name}:NewServer) {
    console.log(creatorId,name)
    if (icon){
      const imageurl = await uploadImage(icon);
      icon=imageurl
    }
    try {
      const response = await axios.post(`${endpoint}/servers/create`, { creatorId,description,icon,members,name });
      return response.data;
    } catch (error) {
      console.error('Error creating server:', error);
      throw new Error('Error creating server.');
    }
  };

  export async function getTopServers() {
    try {
      const topServers = await axios.get(`${endpoint}/servers/top`);
      return topServers.data
    } catch (error) {
      console.error('Error fetching top servers:', error);
      return [];
    }
  }

  export const addMembersToServer = async (serverId: string, newMemberIds: string[]) => {
    try {
      const response = await axios.post(`${endpoint}/servers/${serverId}/addmembers`,newMemberIds)
      return response
    } catch (error) {
      console.log(error)
      throw error
    }
  };

  export const getServers=async({page = 1})=> {
    try {
      const response = await axios.get(`${endpoint}/servers/?page=${page}`);
      return response.data;
    } catch (error) {
      throw new Error('An error occurred while fetching the servers.');
    }
  }
  
  export const getServerById = async (id: string): Promise<Server> => {
    try {
      const result = await axios.get(`${endpoint}/servers/${id}`);
      return result.data;
    } catch (error) {
      console.error('An error occurred while fetching the server:', error);
      throw error;
    }
  };
  
  // ======================================
  // CHANNELS
  // ======================================
  export const getChannelById = async (id: string): Promise<Channel> => {
    try {
      const result = await axios.get(`${endpoint}/channels/${id}`);
      return result.data
    } catch (error) {
      console.error('An error occurred while fetching the server:', error);
      throw error;
    }
  };

  export const createChannel = async ( channel :NewChannel) => {
    try {
      const response = await axios.post(`${endpoint}/servers/${channel.serverId}/channels/`, { channel });
      return response.data;
    } catch (error) {
       console.error('Failed to add channel to server:', error);
       throw error;
    }
  };

  export const addMessageToChannel = async ({channelId, message}:MessageData) => {
    try {
      const response = await axios.patch(`${endpoint}/channels/${channelId}/message`, { message });
      return response.data;
    } catch (error:any) {
      console.error('Error sending message:', error.message);
      throw new Error('Error sending message.');
    }
  };

  export const editMessageInChannel = async (channelId: string, messageKey: string, updatedMessage: Message) => {
    try {
      const response = await axios.put(`${endpoint}/channels/editmessage/${messageKey}`, { channelId,updatedMessage });
      return response.data;
    } catch (error) {
       console.error('Failed to edit message in channel:', error);
       throw error;
    }
  };

  export const getChannelMessages = async (id: string) => {
    try {
      const result = await axios.post(`${endpoint}/channels/${id}/messages`);
      console.log(result.data)
      return result.data
    } catch (error) {
      console.error('An error occurred while fetching the server:', error);
      throw error;
    }
  };


  export async function sendChannelMessage({channelId, caption, files}:NewChannelMessage ): Promise<any> {
    if (!channelId) {
      Alert.alert('SenderId and channel id are required');
    }

    if (files) {
      files =  await uploadImages(files)
    }
    try {
      const response = await axios.post(`${endpoint}/channels/${channelId}/message`, {caption,files});
      return response.data;
      
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }