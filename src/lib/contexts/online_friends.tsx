import React, { createContext, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import { AppState, AppStateStatus } from 'react-native';

import { useOnlineFriendsStore, useProfileStore } from '@/lib/zustand/store';
import { pusher } from '@/lib/pusher/config';
import { User } from '@/types';
import { showOnlineNotification } from '../notifications';

const NOTIFICATION_CHANNEL_ID = 'friend-online';

type OnlineFriendsContextValue = {
  onlineFriends: User[];
  refreshOnlineFriends: () => Promise<void>;
};

const OnlineFriendsContext = createContext<OnlineFriendsContextValue | null>(null);

export const OnlineFriendsProvider: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const { setOnlineFriends, addOnlineFriend, removeOnlineFriend, onlineFriends } = useOnlineFriendsStore();
  const { profile } = useProfileStore();

  const profileIdRef = useRef(profile?.id);

  useEffect(() => {
    profileIdRef.current = profile?.id;
  }, [profile?.id]);

  const handlePusherEvent = useCallback((event: PusherEvent) => {
    try {
      switch (event.eventName) {
        case 'pusher:member_added':
          const newMember = event.data as { id: string; info: User };
          console.log('Friend came online:', newMember.info.name);
          addOnlineFriend(newMember.info);
          showOnlineNotification(newMember.info).catch(console.error);
          break;
        case 'pusher:member_removed':
          const removedMember = event.data as { id: string };
          console.log('Friend went offline:', removedMember.id);
          removeOnlineFriend(removedMember.id);
          break;
        case 'pusher:subscription_succeeded':
          const members = event.data as { [key: string]: User };
          const onlineUsers = Object.values(members);
          console.log('Initial online friends:', onlineUsers.length);
          setOnlineFriends(onlineUsers);
          break;
      }
    } catch (error) {
      console.error('Error handling Pusher event:', error);
    }
  }, [addOnlineFriend, removeOnlineFriend, setOnlineFriends, showOnlineNotification]);

  const subscribeToPusherChannel = useCallback(async (): Promise<void> => {
    if (!pusher || !profileIdRef.current) {
      console.warn('Pusher not initialized or user not logged in');
      return;
    }
    
    try {
      await pusher.subscribe({
        channelName: `presence-friends-${profileIdRef.current}`,
        onEvent: handlePusherEvent
      });
      console.log('Successfully subscribed to Pusher channel');
    } catch (error) {
      console.error('Error subscribing to Pusher channel:', error);
    }
  }, [handlePusherEvent]);

  const unsubscribeFromPusherChannel = useCallback(async (): Promise<void> => {
    if (!pusher || !profileIdRef.current) return;
    try {
      await pusher.unsubscribe({ channelName: `presence-friends-${profileIdRef.current}` });
      console.log('Unsubscribed from Pusher channel');
    } catch (error) {
      console.error('Error unsubscribing from Pusher channel:', error);
    }
  }, []);

  const refreshOnlineFriends = useCallback(async (): Promise<void> => {
    console.log('Refreshing online friends');
    try {
      await unsubscribeFromPusherChannel();
      await subscribeToPusherChannel();
    } catch (error) {
      console.error('Error refreshing online friends:', error);
    }
  }, [unsubscribeFromPusherChannel, subscribeToPusherChannel]);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      console.log('App became active, refreshing online friends');
      refreshOnlineFriends().catch(console.error);
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      unsubscribeFromPusherChannel().catch(console.error);
    }
  }, [refreshOnlineFriends, unsubscribeFromPusherChannel]);

  useEffect(() => {
    if (profileIdRef.current) {
      subscribeToPusherChannel().catch(console.error);
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      unsubscribeFromPusherChannel().catch(console.error);
    };
  }, [subscribeToPusherChannel, unsubscribeFromPusherChannel, handleAppStateChange]);

  const contextValue = useMemo<OnlineFriendsContextValue>(() => ({
    onlineFriends,
    refreshOnlineFriends
  }), [onlineFriends, refreshOnlineFriends]);

  return (
    <OnlineFriendsContext.Provider value={contextValue}>
      {children}
    </OnlineFriendsContext.Provider>
  );
});

export const useOnlineFriends = (): OnlineFriendsContextValue => {
  const context = useContext(OnlineFriendsContext);
  if (!context) {
    throw new Error('useOnlineFriends must be used within an OnlineFriendsProvider');
  }
  return context;
};