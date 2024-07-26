import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationApi, SendMessagePayload, SendUpdateMessagePayload } from '@/lib/actions/conversations';
import { Conversation, Message, UpdateMessage } from "@/validations";

const queryKeys = {
  conversations: ['conversations'],
  conversation: (id: string) => ['conversation', id],
  messages: (conversationId: string) => ['messages', conversationId],
  message: (id: string) => ['message', id],
};

export const useGetCreateConversations = (otherUserId: string) => {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: () => conversationApi.getCreateConversations(otherUserId)
  });
};

export const useGetConversations = () => {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: conversationApi.getConversations
  });
};

export const useGetConversation = (conversationId: string) => {
  return useQuery({
    queryKey: queryKeys.conversation(conversationId),
    queryFn: () => conversationApi.getConversation(conversationId)
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendMessagePayload) => conversationApi.sendMessage(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: queryKeys.messages(variables.conversationId)});
      queryClient.invalidateQueries({queryKey: queryKeys.conversation(variables.conversationId)});
    }
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendUpdateMessagePayload) => conversationApi.updateMessage(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: queryKeys.messages(variables.conversationId)});
      queryClient.invalidateQueries({queryKey: queryKeys.message(variables.messageId)});
    }
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, messageId }: { conversationId: string, messageId: string }) => 
      conversationApi.deleteMessage(conversationId, messageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: queryKeys.messages(variables.conversationId)});
    }
  });
};

export const useMarkMessagesAsSeen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, messageIds }: { conversationId: string, messageIds: string[] }) => 
      conversationApi.markMessagesAsSeen(conversationId, messageIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: queryKeys.conversation(variables.conversationId)});
    }
  });
};

export const useEditMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ messageId, conversationId, editedText }: { messageId: string, conversationId: string, editedText: string }) => 
      conversationApi.editMessage(messageId, conversationId, editedText),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: queryKeys.messages(variables.conversationId)});
      queryClient.invalidateQueries({queryKey: queryKeys.message(variables.messageId)});
    }
  });
};