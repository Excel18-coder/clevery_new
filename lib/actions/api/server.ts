import { AddMemberInput, CreateChannelInput, CreateServerInput, RemoveMemberInput, ServerAction, UpdateServerInput } from "@/validations";


export async function performServerAction(action: ServerAction): Promise<ServerAction> {
  const response = await fetch('/api/server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(action),
  });

  if (!response.ok) {
    throw new Error('Failed to perform server action');
  }

  const serverData = await response.json();
  return serverData
}

export function createServer(server:CreateServerInput) {
  try {
  return performServerAction(server);
  } catch (error) {
    console.error('Failed to create server:', error);
  }
}
 
export function createChannel(channel:CreateChannelInput) {
  try {
  return performServerAction(channel);
  } catch (error) {
    console.error('Failed to create channel:', error);
}
}

export function addMember(input:AddMemberInput) {
  try {
  return performServerAction(input);
  } catch (error) {
    console.error('Failed to add member:', error);
  }
}

export function removeMember(input:RemoveMemberInput) {
  try {
  return performServerAction(input);
  } catch (error) {
    console.error('Failed to remove member:', error);
  }
}

export function updateServer(server:UpdateServerInput) {
  try {
  return performServerAction(server);
  } catch (error) {
    console.error('Failed to update server:', error);
  }
}