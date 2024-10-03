import React from 'react';
import { Text, View } from '../themed';
import { Image } from 'expo-image';

const UserInfo = ({ profile: { name, image, username } }: any) => {

  return (
    <View
      className='flex flex-row items-center gap-2 mt-3 mr-2'
    >
      <Image
        source={{uri: image ? image : "https://via.placeholder.com/150" }}
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

export default React.memo(UserInfo);