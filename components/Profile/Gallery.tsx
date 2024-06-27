import { memo } from 'react'
import { MasonryFlashList } from '@shopify/flash-list'

import {Text, View } from '@/components/Themed'
import { Button } from 'react-native-elements';
import Loader from '@/components/Loader';
import { router } from 'expo-router';
import { urlForImage } from '@/lib';
import { Image } from 'expo-image';
import { image } from '@/types';

interface GalleryProps {
  images: image[];
  loading:boolean
}

const Gallery: React.FC<GalleryProps> = ({ images,loading }) => {
  const renderItem = ({ item }: { item: image }) => {
    return (
      <View className='flex-1 m-[5px]'>
        <Image 
        source={{ uri: urlForImage(item).width(200).url() }} 
        className='h-40 w-40 bg-cover'
      />
      </View>
    );
  };

  if(loading) return <Loader loadingText='Loading your grid'/>

  if(images?.length <1){
    return(
      <View  className='justify-center p-5 gap-[5px]' >
        <Text className='text-sm font-rmedium' >You have no friends yet ,click to add a friend to start a conversation</Text>
        <Button title={'Add friend'} className='w-[50px] m-2.5' onPress={()=>router.push("/users")} />
      </View>
    )
  }
  return (
    <View className='flex-1'>
      <MasonryFlashList
        data={images}
        numColumns={3}
        renderItem={renderItem}
        estimatedItemSize={122}  
      />
    </View>
  );
};

export default memo(Gallery);

