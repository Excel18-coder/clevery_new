import { useState, useEffect } from 'react';
import { pusher } from "../pusher/config";

/**
 * Custom hook to check if a user is online
 * @param {string} userId - The ID of the user to check
 * @returns {boolean} Whether the user is online
 */
const useUserOnlineStatus = (userId: string): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(false);

  useEffect(() => {
    const channel = await pusher.subscribe({channelName: 'presence-messenger'});

    /**
     * Check if the user is in the current member list
     * @param {any} members - The members object from Pusher
     */
    const checkUserPresence = (members: any) => {
      setIsOnline(members.has(userId));
    };

    channel.bind('pusher:subscription_succeeded', (members: any) => {
      checkUserPresence(members);
    });

    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      if (member.id === userId) setIsOnline(true);
    });

    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      if (member.id === userId) setIsOnline(false);
    });

    // Check if the user is already online when the component mounts
    if (channel.members.has(userId)) {
      setIsOnline(true);
    }

    return () => {
      channel.unbind_all();
      pusher.unsubscribe({channelName: 'presence-messenger'});
    };
  }, [userId]);

  return isOnline;
};

export default useUserOnlineStatus;