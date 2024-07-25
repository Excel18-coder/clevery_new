import * as z from "zod";

// ============================================================
// USER
// ============================================================
export const SignupValidation = z.object({
  name: z.string().min(4, { message: "Name must be at least 4 characters." }),
  username: z.string().min(4, { message: "Name must be at least 4 characters." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const ProfileValidation = z.object({
  image: z.string(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  content: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 21200 caracters" }),
  files: z.custom<File[]>(), 
  tags: z.string(),
});

const ImageSchema = z.object({
  _id: z.string().min(1, "Image ID is required"),
  url: z.string().url("Invalid URL format").min(1, "Image URL is required"),
});

export const PostSchema = z.object({
  content: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 21200 caracters" }),
  images: z.array(ImageSchema).optional(),
  tags: z.array(z.string()).optional(),
});
export const CommentValidation = z.object({
  comment: z.string().min(3, { message: "Minimum 3 characters." }),
});


export const TopCreatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  image: z.string().nullable(),
  postCount: z.number(),
  likesCount: z.number(),
  commentsCount: z.number(),
  savesCount: z.number(),
  score: z.number(),
});


//==============================================================

export const UserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  image: z.string().url().nullable(),
  bannerImage: z.string().url().nullable(),
  bio: z.string().nullable(),
  notificationToken: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const UserCreateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  image: z.string().url().optional(),
  bannerImage: z.string().url().optional(),
  bio: z.string().optional(),
  notificationToken: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const UserUpdateSchema = UserCreateSchema.partial().extend({
  id: z.string(),
});


export const ServerValidation = z.object({
  name: z.string().min(1, {message: "Server name is required"}),
  image: z.string(), 
  memmbers:z.custom<string[]>().optional(),
  description:z.string(),

})
export const ChannelValidation = z.object({
  name: z.string().min(1, {message: "Server name is required"}),
  type: z.enum(["TEXT","VIDEO","AUDIO"]), 
})

export const createServerSchema = z.object({
  action: z.literal('createServer'),
  name: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  creatorId: z.string(),
});

export const createChannelSchema = z.object({
  action: z.literal('createChannel'),
  serverId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["TEXT","VIDEO","AUDIO"]), 
  isPrivate: z.boolean().optional(),
});

export const addMemberSchema = z.object({
  action: z.literal('addMember'),
  serverId: z.string(),
  userId: z.string(),
  role: z.enum(['ADMIN', 'MODERATOR', 'MEMBER']),
});

export const removeMemberSchema = z.object({
  action: z.literal('removeMember'),
  serverId: z.string(),
  userId: z.string(),
});

export const updateServerSchema = z.object({
  action: z.literal('updateServer'),
  serverId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const createConversationSchema = z.object({
  action: z.literal('createConversation'),
  user1Id: z.string().uuid(),
  user2Id: z.string().uuid(),
});

export const ConversationSchema = z.object({
  id: z.string(),
  user1Id: z.string(),
  user2Id: z.string(),
  messages: z.array(z.object({
    id: z.string(),
    content: z.string(),
    senderId: z.string(),
    createdAt: z.string(),
  })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const getConversationSchema = z.object({
  action: z.literal('getConversation'),
  conversationId: z.string().uuid(),
});

export const sendMessageSchema = z.object({
  action: z.literal('sendMessage'),
  conversationId: z.string().uuid(),
  message: z.object({
    text: z.string().min(1),
    file: z.string().optional(),
  })
});

export const updateMessageSchema = z.object({
  action: z.literal('updateMessage'),
  messageId: z.string().uuid(),
  text: z.string().min(1).optional(),
  file: z.string().optional(),
});

export const deleteMessageSchema = z.object({
  action: z.literal('deleteMessage'),
  messageId: z.string().uuid(),
});

export const markAsSeenSchema = z.object({
  action: z.literal('markAsSeen'),
  messageIds: z.array(z.string().uuid()).min(1),
});

export const editMessageSchema = z.object({
  action: z.literal('editMessage'),
  messageId: z.string().uuid(),
  conversationId: z.string().uuid(),
  editedText: z.string().min(1),
});

export const QuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  search: z.string().optional(),
});

export const PostQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  search: z.string().optional(),
  tag: z.string().optional(),
  authorId: z.string().optional(),
  sortBy: z.enum(['createdAt', 'likes', 'saves']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const serverActionSchema = z.discriminatedUnion('action', [
  createServerSchema,
  createChannelSchema,
  addMemberSchema,
  removeMemberSchema,
  updateServerSchema,
]);

export const payloadSchema = z.discriminatedUnion('action', [
  createConversationSchema,
  getConversationSchema,
  sendMessageSchema,
  updateMessageSchema,
  deleteMessageSchema,
  markAsSeenSchema,
  editMessageSchema,
]);

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof UserCreateSchema>;
export type UpdateUser = z.infer<typeof UserUpdateSchema>;

export type CreatePostInput = z.infer<typeof PostSchema>;
export type CreateCommentInput = z.infer<typeof CommentValidation>;
export type TopCreator = z.infer<typeof TopCreatorSchema>;

export type CreateServerInput = z.infer<typeof createServerSchema>;
export type CreateChannelInput = z.infer<typeof createChannelSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;
export type UpdateServerInput = z.infer<typeof updateServerSchema>;
export type ServerAction = z.infer<typeof serverActionSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type Payload = z.infer<typeof payloadSchema>;