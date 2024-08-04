import { PostQuerySchema, QuerySchema, Schemas, Validations } from '@/validations';
import { z } from 'zod';
// Enum Types
export type UserRole = z.infer<typeof Schemas.User>;
export type ChannelType = z.infer<typeof Schemas.Channel>['type'];
export type MemberRole = z.infer<typeof Schemas.ServerMember>['role'];
export enum StaticUserStatuses {
  Online = "online",
  Idle = "idle",
  DND = "dnd",
  Offline = "offline",
  Mobile = "mobile",
}
// Schema Types
export type User = z.infer<typeof Schemas.User>;
export type Post = z.infer<typeof Schemas.Post>;
export type Comment = z.infer<typeof Schemas.Comment>;
export type Conversation = z.infer<typeof Schemas.Conversation>;
export type Message = z.infer<typeof Schemas.Message>;
export type UpdateMessage = z.infer<typeof Schemas.UpdateMessagePayload>;
export type Server = z.infer<typeof Schemas.Server>;
export type ServerMember = z.infer<typeof Schemas.ServerMember>;
export type Channel = z.infer<typeof Schemas.Channel>;
export type ChannelMessagePayload = z.infer<typeof Schemas.ChannelMessagePayload>;
export type UpdateChannelMessagePayload = z.infer<typeof Schemas.UpdateMessagePayload>;

// Validation Types
export type SignUpData = z.infer<typeof Validations.SignUp>;
export type SignInData = z.infer<typeof Validations.SignIn>;
export type CreatePostData = z.infer<typeof Validations.CreatePost>;
export type CreateCommentData = z.infer<typeof Validations.CreateComment>;
export type CreateServerData = z.infer<typeof Validations.CreateServer>;
export type CreateChannelData = z.infer<typeof Validations.CreateChannel>;
export type SendMessageData = z.infer<typeof Validations.SendMessage>;
export type UpdateUserData = z.infer<typeof Validations.UpdateUser>;
export type UpdateServerData = z.infer<typeof Validations.UpdateServer>;
export type UpdateChannelData = z.infer<typeof Validations.UpdateChannel>;
export type PostQuery = z.infer<typeof PostQuerySchema>;

export interface SendMessageDataPayload {
  serverId: string;
  channelId: string;
  message: SendMessageData
}

export interface DeleteMessagePayload {
  serverId: string;
  channelId: string;
  messageId: string;
}
// Query Types
export type QueryParams = z.infer<typeof QuerySchema>;

// Action Types
export type Action =
  | { type: 'CREATE_USER'; payload: SignUpData }
  | { type: 'SIGN_IN'; payload: SignInData }
  | { type: 'CREATE_POST'; payload: CreatePostData }
  | { type: 'CREATE_COMMENT'; payload: CreateCommentData }
  | { type: 'CREATE_SERVER'; payload: CreateServerData }
  | { type: 'CREATE_CHANNEL'; payload: CreateChannelData }
  | { type: 'SEND_MESSAGE'; payload: SendMessageData }
  | { type: 'UPDATE_USER'; payload: UpdateUserData }
  | { type: 'UPDATE_SERVER'; payload: UpdateServerData }
  | { type: 'UPDATE_CHANNEL'; payload: UpdateChannelData }
  | { type: 'DELETE_POST'; payload: { id: string } }
  | { type: 'DELETE_COMMENT'; payload: { id: string } }
  | { type: 'DELETE_SERVER'; payload: { id: string } }
  | { type: 'DELETE_CHANNEL'; payload: { id: string } }
  | { type: 'DELETE_MESSAGE'; payload: { id: string } }
  | { type: 'JOIN_SERVER'; payload: { serverId: string; userId: string } }
  | { type: 'LEAVE_SERVER'; payload: { serverId: string; userId: string } }
  | { type: 'LIKE_POST'; payload: { postId: string; userId: string } }
  | { type: 'UNLIKE_POST'; payload: { postId: string; userId: string } }
  | { type: 'BOOKMARK_POST'; payload: { postId: string; userId: string } }
  | { type: 'UNBOOKMARK_POST'; payload: { postId: string; userId: string } }
  | { type: 'ADD_REACTION'; payload: { messageId: string; type: string } }
  | { type: 'REMOVE_REACTION'; payload: { messageId: string; type: string } };

// Response Types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  totalItems: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
};

// Utility Types
export type WithId<T> = T & { id: string };
export type WithTimestamps<T> = T & { createdAt: Date; updatedAt: Date };
export type FullModel<T> = WithId<WithTimestamps<T>>;

// Specific Response Types
export type UserResponse = ApiResponse<FullModel<User>>;
export type PostResponse = ApiResponse<FullModel<Post>>;
export type CommentResponse = ApiResponse<FullModel<Comment>>;
export type ServerResponse = ApiResponse<FullModel<Server>>;
export type ChannelResponse = ApiResponse<FullModel<Channel>>;
export type MessageResponse = ApiResponse<FullModel<Message>>;

export type PostsResponse = ApiResponse<PaginatedResponse<FullModel<Post>>>;
export type ServersResponse = ApiResponse<PaginatedResponse<FullModel<Server>>>;
export type ChannelsResponse = ApiResponse<PaginatedResponse<FullModel<Channel>>>;
export type MessagesResponse = ApiResponse<PaginatedResponse<FullModel<Message>>>;

// Export all types
export {
  Schemas,
  Validations,
  QuerySchema,
};