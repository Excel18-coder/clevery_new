import { ChannelType } from '@prisma/client';
import { createServer, createChannel, addMember, removeMember, updateServer } from './api/server';

// In your component
const handleCreateServer = async (name: string, description: string, icon: string, creatorId: string) => {
  try {
    const response = await createServer(name, description, icon, creatorId);
    const { data } = await response.json();
    console.log('New server created:', data);
    // Update UI to show the new server
  } catch (error) {
    console.error('Failed to create server:', error);
  }
};

const handleCreateChannel = async (serverId: string, name: string, description: string, type: ChannelType, isPrivate: boolean) => {
  try {
    const response = await createChannel(serverId, name, description, type, isPrivate);
    const { data } = await response.json();
    console.log('New channel created:', data);
    // Update UI to show the new channel
  } catch (error) {
    console.error('Failed to create channel:', error);
  }
};

const handleAddMember = async (serverId: string, userId: string) => {
  try {
    const response = await addMember(serverId, userId, 'MEMBER');
    const { data } = await response.json();
    console.log('Member added:', data);
    // Update UI to reflect the new member
  } catch (error) {
    console.error('Failed to add member:', error);
  }
};

const handleRemoveMember = async (serverId: string, userId: string) => {
  try {
    const response = await removeMember(serverId, userId);
    const { data } = await response.json();
    console.log('Member removed:', data);
    // Update UI to reflect the member removal
  } catch (error) {
    console.error('Failed to remove member:', error);
  }
};

const handleUpdateServer = async (serverId: string, name: string, description: string, icon: string) => {
  try {
    const response = await updateServer(serverId, name, description, icon);
    const { data } = await response.json();
    console.log('Server updated:', data);
    // Update UI to reflect the server update
  } catch (error) {
    console.error('Failed to update server:', error);
  }
};

// Similar handlers for addMember, removeMember, and updateServer