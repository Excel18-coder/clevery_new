import { selector, urlForImage } from '@/lib';
import { memo } from 'react';
import { Text, View } from '../Themed';
import { Image } from 'expo-image';

const UserInfo = ({ profile }:any) => {
const {user}=selector((state)=>state.user)
  return (
    <View 
    className='flex flex-row items-center gap-2.5 px-5 mt-1 '
    >
    <Image 
    source={{ uri: profile.image? urlForImage(profile.image).width(100).url():user.image as any }}
     className='h-[70px] w-[70px] rounded-[35px] gap-1.5 border-gray-600 ' />
      <View className='flex-col flex'>
        <Text className='font-rbold text-xl' >
          {profile.name}
          </Text> 
        <Text className='font-plight text-xs' >@{profile.username}</Text>
      </View>
    </View>
  ); 
};

export default memo(UserInfo);