import { memo } from 'react';
import { Text, View } from '../themed';
import { Image } from 'expo-image';

const UserInfo = ({ profile: { name, image, username } }: any) => {

  return (
    <View
      className='flex flex-row items-center gap-3 px-5 mt-1 '
    >
      <Image
        source={{uri: image ? image : "https://via.placeholder.com/150" }}
        height={80}
        width={80}
        style={{height:70, width:70, borderRadius:35, borderColor:'gray', marginTop:5}}
      />
      <View className='flex-col flex'>
        <Text className='font-rbold text-xl' >
          {name}
        </Text>
        <Text className='font-rregular text-xs' >@{username || name}</Text>
      </View>
    </View>
  );
};

export default memo(UserInfo);