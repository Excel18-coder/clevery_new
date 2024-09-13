import { TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Text, View } from '../themed';
import { router } from 'expo-router';
import { Image } from 'expo-image';

interface ServerCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
}

const ServerCard: React.FC<ServerCardProps> = ({ id, name, description, image }) => {
  return (
    <TouchableOpacity onPress={() => router.push(`/server/${id}`)} className='flex-1' >
      <View className='flex-row items-center p-4'>
        <Image
          source={{uri: image}}
          style={{ height: 60, width: 60, borderRadius: 30 }}
        />
        <View className='ml-4'>
          <Text className='text-base font-rbold'>{name}</Text>
          <Text
            className='text-sm font-rregular text-[#666]'>{description}</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#666" className='absolute right-4' />
      </View>
    </TouchableOpacity>
  );
};

export default ServerCard;