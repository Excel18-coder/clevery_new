import React, { createContext, useContext, useState, useEffect } from 'react';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { AppState } from 'react-native';
import axios from 'axios';

 import { Conversation, Message, User } from '@/types';
import { pusher } from '../pusher/config';
import { endpoint } from '../env';

const BACKGROUND_FETCH_TASK = 'background-fetch';
const NOTIFICATION_CHANNEL_ID = 'new-messages';


/**
 * @typedef {Object} MessagingContextValue
 * @property {Conversation[]} conversations - The list of user conversations
 * @property {User[]} onlineFriends - The list of online friends
 * @property {function} refreshConversations - Function to refresh conversations
 * @property {function} markConversationAsRead - Function to mark a conversation as read
 * @property {function} sendMessage - Function to send a new message
 */

type MessagingContextValue = {
  conversations: Conversation[];
  onlineFriends: User[];
  refreshConversations: () => Promise<void>;
};
const MessagingContext = createContext<MessagingContextValue | null>(null);

/**
 * Provider component for messaging-related functionality
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]); 
 
  /**
   * Subscribes to Pusher channels for each conversation and friend status
   */
  const subscribeToPusherChannels = async () => {
    if (!pusher) return;
    // Subscribe to friends' online status
    await pusher.subscribe({channelName:'presence-friends',
      onEvent: (event: PusherEvent) => {
        if (event.eventName === 'pusher:member_added') {
          (member: { id: string; info: User }) => {
            setOnlineFriends(prev => [...prev, member.info]);
            showOnlineNotification(member.info);
          }
        }
        if (event.eventName === 'pusher:member_removed') {
          (member: { id: string }) => {
            setOnlineFriends(prev => prev.filter(friend => friend.id !== member.id));
          }
        }
      }
    });
    
    conversations.forEach(async conversation => {
      await pusher.subscribe({
        channelName:conversation.id,
        onEvent: (event: PusherEvent) => {
          if (event.eventName === 'new-message') {
            async (data: { conversationId: string; message: Message; senderName: string; senderImage: string }) => {
              // Update the specific conversation with the new message
              const updatedConversations = conversations.map(conv => 
                conv.id === data.conversationId
                  ? { ...conv, lastMessage: data.message, unreadCount: conv.unreadMessages + 1 }
                  : conv
              );
              setConversations(updatedConversations);
      
              // Show a notification if the app is in the background
              if (AppState.currentState !== 'active') {
                await showNotification(data.senderName, data.message.text, data.senderImage);
              }
            }
          }
        }
      });
    });
  }

  /**
   * Shows a notification for a new message
   * @param {string} senderName - Name of the message sender
   * @param {string} messageContent - Content of the message
   * @param {string} senderImage - URL of the sender's profile image
   */
  const showNotification = async (senderName: string, messageContent: string, senderImage: string): Promise<void> => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `New message from ${senderName}`,
        body: messageContent,
        data: { senderImage },
      },
      trigger: null,
    });
  };

  /**
   * Shows a notification when a friend comes online
   * @param {User} friend - The friend who came online
   */
  const showOnlineNotification = async (friend: User): Promise<void> => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Friend Online',
        body: `${friend.name} is now online`,
        data: { friendImage: friend.image },
      },
      trigger: null,
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
   * Configures notifications
   */
  const configureNotifications = async (): Promise<void> => {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'New Messages',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
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
          pusher.unsubscribe({channelName:conversation.id});
        });
        pusher.unsubscribe({channelName:'presence-friends'});
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
    onlineFriends,
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
 * @returns {MessagingContextValue}
 */
export const useMessaging = (): MessagingContextValue => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
