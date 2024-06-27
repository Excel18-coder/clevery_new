import { MasonryFlashList } from '@shopify/flash-list'
import { Loader, Text, View } from '@/components';
import { urlForImage, useGetBannerImages } from '@/lib';
import { Image } from 'expo-image';

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = () => {
  const { data:images } = useGetBannerImages();

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View className='flex-1 m-1.5 items-center'>
        <Image
          source={{ uri: urlForImage(item.image).width(200).url() }}
          className='h-40 w-[240px] object-cover mb-1.5'
        />
        <Text className='font-sm text-[#333] items-center'>{item.name}</Text>
      </View>
    );
  };

  if (!images) return <Loader loadingText="Loading your grid" />;

  return (
    <View className='flex-1 bg-[#fff] '>
      <MasonryFlashList
        data={images}
        numColumns={2}
        renderItem={renderItem}
        estimatedItemSize={122}
        className='px-[2.5px] py-[2.5px]'
      />
    </View>
  );
};

export default Gallery;