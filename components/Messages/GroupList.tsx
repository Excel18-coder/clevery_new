import { TouchableOpacity } from 'react-native'; 
import {router} from 'expo-router';

import { Text, View } from '../Themed';

const GroupList = ({ group }:{group:any}) => {
   const{ name, image, motto, id}=group
   
  return (
    <View className='flex-row items-center p-2.5'>
      <TouchableOpacity 
        className='flex-row items-center p-2.5'
        onPress={()=>router.push(`/group/${id}`)}
      > 
        {/* <Image 
          source={{ uri:urlForImage(image).width(100).url()}} 
          className='w-12.5 h-12.5 overflow-hidden rounded-[25px]'
        />  */}
        <View className='ml-2.5'>
          <Text className='font-pmedium text-base'>{name}</Text>
          <Text className='text-[#555] text-sm '>{motto}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};


export default GroupList;
