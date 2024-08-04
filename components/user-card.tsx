import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

import { View } from './Themed';
import { User } from '@/types';
interface UserCardProps {
  user: User
  onSelectUser: (id: string) => void;
}

const FriendCard: React.FC<UserCardProps> = ({ user, onSelectUser }) => {
  const isOnline = true;
 return (
    <TouchableOpacity className='flex-row items-center px-4xs py-1' activeOpacity={1} onPress={() => onSelectUser(user.id)}>
      <View className='mr-2.5'>
        <Image source={{ uri: user.image||"https://via.placeholder.com/150" }} className='w-12.5 h-12.5 rounded-[25px]' />
        {isOnline && <View style={{
          position: 'absolute', right: 0, bottom: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#FFFFFF'
        }} />}
      </View>
    </TouchableOpacity>
 );
};

export default FriendCard
