import { Pressable } from 'react-native';

import { Text, View } from '../themed';
import { Conversation } from '@/types';
import { HStack } from '../ui/hstack';
import { Image } from 'expo-image';
interface UserCardProps {
  conversation: Conversation
  onSelectUser: (id: string) => void;
  lastMessage?: string;
}

const UserCard: React.FC<UserCardProps> = ({ conversation, onSelectUser }) => {
  const { id, user: { image, name, username }, lastMessage,unreadCount } = conversation;
  const isOnline = true;
  const isTyping = false;
  const unreadMessages = 3

  return (
    <Pressable className='flex-row items-center py-1 pl-2' onPress={() => onSelectUser(id)}>
      <HStack className='flex-1 my-4 px-3'>
        <View className='mr-2.5'>
          <Image
            source={image ? image : "https://via.placeholder.com/150"}
            style={{ height: 60, width: 60, borderRadius: 30, borderWidth: 1, borderColor: 'gray' }}
          />
          {isOnline && 
            <View style={{ position: 'absolute', right: 0, bottom: 0, width: 14, height: 14,
               borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#FFFFFF'
              }} 
            />
          }
      </View>
      <View className='flex-1'>
        <Text className='font-rmedium mt-1.5 text-base'>{name}</Text>
        <Text className='text-gray-400 text-[11px] font-rthin' >
          @{username || name}
        </Text>
        <Text className='mt-1.5 font-rthin text-[10px] '>{lastMessage}</Text>
      </View>
      </HStack>
      <Pressable className='items-center  border rounded-full py-1 px-2 mr-5 bg-blue-600'>
        <Text className='text-gray-400 font-rthin text-[11px]'>{unreadCount}</Text>
      </Pressable>
    </Pressable>
  );
};

export default UserCard
