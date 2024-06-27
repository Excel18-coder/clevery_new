import { TouchableOpacity } from 'react-native'; 
import {router} from 'expo-router';
import { Image } from 'expo-image';

import { Text, View } from '../Themed';
import { urlForImage } from '@/lib';
import { Group } from '@/types';

const GroupList = ({ group }:{group:Group}) => {
   const{name,image,motto,_id:id}=group
   
  return (
    <View className='flex-row items-center p-2.5'>
      <TouchableOpacity 
        className='flex-row items-center p-2.5'
        onPress={()=>router.push(`/group/${id}`)}
      > 
        <Image 
          source={{ uri:urlForImage(image).width(100).url()}} 
          className='w-12.5 h-12.5 overflow-hidden rounded-[25px]'
        /> 
        <View className='ml-2.5'>
          <Text className='font-pmedium text-base'>{name}</Text>
          <Text className='text-[#555] text-sm '>{motto}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};


export default GroupList;
