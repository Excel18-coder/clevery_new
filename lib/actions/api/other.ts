import { db as prisma } from "@/lib/db";


async function createConversation(user1Id: string, user2Id: string) {
  return prisma.conversation.create({
    data: {
      user1: { connect: { id: user1Id } },
      user2: { connect: { id: user2Id } },
    },
  });
}

async function sendMessage(senderId: string, conversationId: string, text: string, file?: string) {
  return prisma.message.create({
    data: {
      text,
      file,
      sender: { connect: { id: senderId } },
      conversation: { connect: { id: conversationId } },
    },
  });
}

async function updateMessage(messageId: string, newText: string, newFile?: string) {
  return prisma.message.update({
    where: { id: messageId },
    data: {
      text: newText,
      file: newFile,
    },
  });
}

async function deleteMessage(messageId: string) {
  return prisma.message.delete({
    where: { id: messageId },
  });
}

async function markMessagesAsSeen(messageIds: string[]) {
  return prisma.message.updateMany({
    where: {
      id: { in: messageIds },
    },
    data: {
      seen: true,
    },
  });
}