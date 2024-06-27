import { useState } from 'react';
import { FlatList } from 'react-native';
import { Text, View } from '../Themed';
import { image } from '@/types';
import { urlForImage } from '@/lib';
import { Image } from 'expo-image';

type ImageContProps = {
  images: image[];
  caption: string;
};


const SingleImage = ({ image, caption }: { image: image; caption: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = imageLoaded?urlForImage(image).width(350).url():urlForImage(image).width(20).url()
  return (
    <View className='flex-1 flex-col justify-center p-1 items-center'>
      <Image
        key={image?.asset?._ref}
        source={{uri: imageUrl }}
        className='w-[350px] h-[230px] m-[3px] rounded-[5px] '
        onLoad={() => {
          setImageLoaded(true);
        }}
      />
      <Text className='font-pregular text-sm mb-auto w-full'>{caption}</Text>
    </View>
  );
};

const MultipleImages = ({ images, caption }: { images: image[]; caption: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <>
      <Text
      className='font-pregular text-sm mb-auto mt-2'>{caption}</Text>
      <FlatList
        data={images}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item?.asset?._ref}
        renderItem={({ item: image }) => (
          <Image
            key={image?.asset?._ref}
            source={{ uri: imageLoaded?urlForImage(image).width(200).url():urlForImage(image).width(20).url() }}
            className='w-40 h-[230px] m-[3px] rounded-[20px] '
            onLoad={() => {
              setImageLoaded(true);
            }}
          />
        )}
      />
    </>
  );
};

const ImageCont = ({ images, caption }: ImageContProps) => {

  if (images && images.length === 1) {
    const image = images[0];
    return <SingleImage image={image} caption={caption} />;
  }
  if (images && images.length > 1) {
    return <MultipleImages images={images} caption={caption} />;
  }
  return <Text className='font-pregular text-sm mb-2 mt-2 w-auto' >{caption}</Text>;
};


export default ImageCont;