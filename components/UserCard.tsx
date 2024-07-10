import { TouchableOpacity } from 'react-native';
import { urlForImage } from '@/lib';
import { User } from '../types';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { Text, View } from './Themed';
import { Image } from 'expo-image';

interface UserCardProps {
 user: User;
 onSelectUser: (id: string) => void;
 handleAddFriend: (id: string) => void;
 showlastMessage: boolean;
 isFriend?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onSelectUser, showlastMessage, handleAddFriend, isFriend }) => {
 const { image, name, username, isVerified, _id } = user;

 const getLastMessage = (userId: string) => {
  
 };

 const lastMessage = getLastMessage(_id);

 return (
    <TouchableOpacity className='flex-row items-center px-4xs py-1' activeOpacity={1} onPress={() => onSelectUser(_id)}>
      <View className='mr-2.5'>
        <Image source={{ uri: urlForImage(image).width(100).url() }} className='w-12.5 h-12.5 rounded-[25px]' />
      </View>
      <View className='flex-1'>
        <Text className='font-rmedium mt-1.5 text-sm'>{name}</Text>
        {isVerified&& 
        <View> 
          <FontAwesome name="certificate" color="#007aff" size={20} className='absolute right-[70%] top-[-20px] ' />
           <Icon name="check" type="font-awesome" color="white" size={10}
            className='absolute right-[70%] top-[-20px] z-10 mr-[3px]'
           /> 
           </View> 
          } 
         <Text className='text-gray-400 text-xs font-rthin' >@{username}</Text>
         <Text className='mt-1.5 font-pthin text-[10px] '>{lastMessage}</Text>
      </View>
    </TouchableOpacity>
 );
};

export default UserCard
