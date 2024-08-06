import { createContext, useContext, useEffect, useState } from 'react';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { AppState } from 'react-native';
import { create } from "zustand";
import axios from 'axios';
import notifee, { AndroidImportance } from '@notifee/react-native';

import { Conversation, Message, User } from '@/types';
import { pusher } from '@/lib/pusher/config';
import { endpoint } from '@/lib/env';

const BACKGROUND_FETCH_TASK = 'background-fetch';
const NOTIFICATION_CHANNEL_ID = 'new-messages';

/**
 * @typedef {Object} OnlineFriendsStore
 * @property {User[]} onlineFriends - The list of online friends
 * @property {(friends: User[]) => void} setOnlineFriends - Function to set online friends
 * @property {(friend: User) => void} addOnlineFriend - Function to add an online friend
 * @property {(friendId: string) => void} removeOnlineFriend - Function to remove an online friend
 */
type OnlineFriendsStore = {
  onlineFriends: User[];
  setOnlineFriends: (friends: User[]) => void;
  addOnlineFriend: (friend: User) => void;
  removeOnlineFriend: (friendId: string) => void;
};

/**
 * Zustand store for managing online friends
 */
const useOnlineFriendsStore = create<OnlineFriendsStore>((set) => ({
  onlineFriends: [],
  setOnlineFriends: (friends) => set({ onlineFriends: friends }),
  addOnlineFriend: (friend) => set((state) => ({ onlineFriends: [...state.onlineFriends, friend] })),
  removeOnlineFriend: (friendId) => set((state) => ({ 
    onlineFriends: state.onlineFriends.filter((friend) => friend.id !== friendId) 
  })),
}));

/**
 * @typedef {Object} MessagingContextValue
 * @property {Conversation[]} conversations - The list of user conversations
 * @property {() => Promise<void>} refreshConversations - Function to refresh conversations
 */
type MessagingContextValue = {
  conversations: Conversation[];
  refreshConversations: () => Promise<void>;
};

const MessagingContext = createContext<MessagingContextValue | null>(null);

/**
 * Provider component for messaging-related functionality
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components
 */
export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { setOnlineFriends, addOnlineFriend, removeOnlineFriend } = useOnlineFriendsStore();

  /**
   * Subscribes to Pusher channels for each conversation and friend status
   */
  const subscribeToPusherChannels = async () => {
    if (!pusher) return;
    
    // Subscribe to friends' online status
    await pusher.subscribe({
      channelName: 'presence-friends',
      onEvent: (event: PusherEvent) => {
        if (event.eventName === 'pusher:member_added') {
          const member = event.data as { id: string; info: User };
          addOnlineFriend(member.info);
          showOnlineNotification(member.info);
        }
        if (event.eventName === 'pusher:member_removed') {
          const member = event.data as { id: string };
          removeOnlineFriend(member.id);
        }
      }
    });
    
    conversations.forEach(async conversation => {
      await pusher.subscribe({
        channelName: conversation.id,
        onEvent: (event: PusherEvent) => {
          if (event.eventName === 'new-message') {
            const data = event.data as { conversationId: string; message: Message; senderName: string; senderImage: string };
            // Update the specific conversation with the new message
            const updatedConversations = conversations.map(conv => 
              conv.id === data.conversationId
                ? { ...conv, lastMessage: data.message, unreadCount: conv.unreadMessages + 1 }
                : conv
            );
            setConversations(updatedConversations);
    
            // Show a notification if the app is in the background
            if (AppState.currentState !== 'active') {
              showNotification(data.senderName, data.message.text, data.senderImage);
            }
          }
        }
      });
    });
  }

  /**
   * Shows a notification for a new message using @notifee
   * @param {string} senderName - Name of the message sender
   * @param {string} messageContent - Content of the message
   * @param {string} senderImage - URL of the sender's profile image
   */
  const showNotification = async (senderName: string, messageContent: string, senderImage: string): Promise<void> => {
    await notifee.displayNotification({
      title: `New message from ${senderName}`,
      body: messageContent,
      android: {
        channelId: NOTIFICATION_CHANNEL_ID,
        largeIcon: senderImage,
        importance: AndroidImportance.HIGH,
      },
    });
  };

  /**
   * Shows a notification when a friend comes online using @notifee
   * @param {User} friend - The friend who came online
   */
  const showOnlineNotification = async (friend: User): Promise<void> => {
    await notifee.displayNotification({
      title: 'Friend Online',
      body: `${friend.name} is now online`,
      android: {
        channelId: NOTIFICATION_CHANNEL_ID,
        largeIcon: friend.image,
        importance: AndroidImportance.DEFAULT,
      },
    });
  };

  /**
   * Fetches conversations from the API
   * @returns {Promise<void>}
   */
  const fetchConversations = async (): Promise<void> => {
    try {
      const response = await axios.get<Conversation[]>(`${endpoint}/conversations`);
      setConversations(response.data);
      if (pusher) {
        subscribeToPusherChannels();
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  /**
   * Configures background fetch task
   */
  const configureBackgroundFetch = async (): Promise<void> => {
    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
      await fetchConversations();
      return BackgroundFetch.BackgroundFetchResult.NewData;
    });

    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 15 * 60, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
  };

  /**
   * Configures notifications using @notifee
   */
  const configureNotifications = async (): Promise<void> => {
    await notifee.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: 'New Messages',
      importance: AndroidImportance.HIGH,
      vibration: true,
    });
  };

  useEffect(() => {
    fetchConversations();
    configureBackgroundFetch();
    configureNotifications();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        fetchConversations();
      }
    });

    return () => {
      subscription.remove();
      TaskManager.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      if (pusher) {
        conversations.forEach(conversation => {
          pusher.unsubscribe({channelName: conversation.id});
        });
        pusher.unsubscribe({channelName: 'presence-friends'});
        pusher.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (pusher) {
      subscribeToPusherChannels();
    }
  }, [pusher, conversations]);

  const contextValue: MessagingContextValue = {
    conversations,
    refreshConversations: fetchConversations
  };

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  );
}

/**
 * Custom hook to use the messaging context
 * @returns {MessagingContextValue} The messaging context value
 * @throws {Error} If used outside of MessagingProvider
 */
export const useMessaging = (): MessagingContextValue => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

/**
 * Custom hook to use the online friends store
 * @returns {OnlineFriendsStore} The online friends store
 */
export const useOnlineFriends = (): OnlineFriendsStore => useOnlineFriendsStore();