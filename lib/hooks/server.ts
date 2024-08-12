import { useCallback } from 'react';
import {
  useChannel,
  useChannelMessages,
  useSendChannelMessage,
  useEditChannelMessage,
  useDeleteChannelMessage,
  useUpdateChannel,
  useDeleteChannel,
  useServer,
  useServerChannels,
  useServerMembers,
  useUpdateServer,
  useDeleteServer,
  useCreateChannel
} from '@/lib/actions/hooks/servers';

export const useChannelData = (channelId: string, serverId: string) => {
  const { data: channel, isLoading: channelLoading, error: channelError } = useChannel(channelId);
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useChannelMessages(channelId);
  const { mutate: sendMessage, isPending: sendMessageLoading } = useSendChannelMessage();
  const { mutate: editMessage, isPending: editMessageLoading } = useEditChannelMessage();
  const { mutate: deleteMessage, isPending: deleteMessageLoading } = useDeleteChannelMessage();
  const { mutate: updateChannel, isPending: updateChannelLoading } = useUpdateChannel(serverId, channelId);
  const { mutate: deleteChannel, isPending: deleteChannelLoading } = useDeleteChannel(serverId);

  const isLoading = channelLoading || messagesLoading;
  const error = channelError || messagesError;

  const sendChannelMessage = useCallback((content: string) => {
    sendMessage({ channelId, serverId, message:{text:content} });
  }, [channelId, serverId, sendMessage]);

  const editChannelMessage = useCallback((messageId: string, content: string) => {
    editMessage({serverId, channelId, messageId,text:content });
  }, [channelId, editMessage]);

  const deleteChannelMessage = useCallback((messageId: string) => {
    deleteMessage({serverId, channelId, messageId });
  }, [channelId, deleteMessage]);

  return {
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

export const useServerData = (serverId: string) => {
  const { data: server, isLoading: serverLoading, error: serverError } = useServer(serverId);
  const { data: channels, isLoading: channelsLoading, error: channelsError } = useServerChannels(serverId);
  const { data: members, isLoading: membersLoading, error: membersError } = useServerMembers(serverId);
  const { mutate: updateServer, isPending: updateServerLoading } = useUpdateServer(serverId);
  const { mutate: deleteServer, isPending: deleteServerLoading } = useDeleteServer();
  const { mutate: createChannel, isPending: createChannelLoading } = useCreateChannel(serverId);

  const isLoading = serverLoading || channelsLoading || membersLoading;
  const error = serverError || channelsError || membersError;

  return {
    server,
    channels,
    members,
    updateServer,
    deleteServer,
    createChannel,
    isLoading,
    error,
    updateServerLoading,
    deleteServerLoading,
    createChannelLoading
  };
};