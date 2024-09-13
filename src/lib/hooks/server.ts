import { useCallback, useMemo } from 'react';
import {
  useChannel,
  useChannelMessages,
  useSendChannelMessage,
  useEditChannelMessage,
  useDeleteChannelMessage,
  useUpdateChannel,
  useDeleteChannel,
} from '@/lib/actions/hooks/servers';

export const useChannelData = (channelId: string) => {
  const { 
    data: channel, 
    isLoading: channelLoading, 
    error: channelError 
  } = useChannel(channelId);

  const { 
    data: messages, 
    isLoading: messagesLoading, 
    error: messagesError 
  } = useChannelMessages(channelId);

  const { mutateAsync: sendMessage, isPending: sendMessageLoading } = useSendChannelMessage();
  const { mutateAsync: editMessage, isPending: editMessageLoading } = useEditChannelMessage();
  const { mutateAsync: deleteMessage, isPending: deleteMessageLoading } = useDeleteChannelMessage();
  
  const serverId = channel?.serverId || "";

  const { 
    mutate: updateChannel, 
    isPending: updateChannelLoading 
  } = useUpdateChannel(serverId, channelId);

  const { 
    mutate: deleteChannel, 
    isPending: deleteChannelLoading 
  } = useDeleteChannel(serverId);

  const isLoading = channelLoading || messagesLoading;
  const error = channelError || messagesError;

  const sendChannelMessage = useCallback(async(content: string) => {
    if (serverId && channelId && content) {
     await sendMessage({ channelId, serverId, message: { text: content } });
    }
  }, [channelId, serverId, sendMessage]);

  const editChannelMessage = useCallback((messageId: string, content: string) => {
    if (serverId) {
      editMessage({ serverId, channelId, messageId, text: content });
    }
  }, [channelId, serverId, editMessage]);

  const deleteChannelMessage = useCallback((messageId: string) => {
    if (serverId) {
      deleteMessage({ serverId, channelId, messageId });
    }
  }, [channelId, serverId, deleteMessage]);

  const state = useMemo(() => {
    if (channelLoading) {
      return { status: 'loading' as const };
    }
    if (channelError) {
      return { status: 'error' as const, error: channelError };
    }
    if (!channel) {
      return { status: 'not-found' as const };
    }
    return { status: 'success' as const, data: channel };
  }, [channel, channelLoading, channelError]);

  return {
    state,
    channel,
    messages,
    sendChannelMessage,
    editChannelMessage,
    deleteChannelMessage,
    updateChannel,
    deleteChannel,
    isLoading,
    error,
    sendMessageLoading,
    editMessageLoading,
    deleteMessageLoading,
    updateChannelLoading,
    deleteChannelLoading
  };
};