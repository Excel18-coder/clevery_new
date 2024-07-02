import { MasonryFlashList } from '@shopify/flash-list'
import { Skeleton, VStack } from 'native-base';
import PostsSkeleton from './posts';
import { Feather } from '@expo/vector-icons';
import { View } from '../Themed';

const ImageSkeletons = () => {
  const skeletonData = [
    { width: 200, height: 150 },
    { width: 150, height: 200 },
    { width: 300, height: 200 },
    { width: 250, height: 150 },
    { width: 180, height: 180 },
    { width: 220, height: 180 },
    { width: 180, height: 220 },
    { width: 250, height: 200 },
    { width: 200, height: 150 }, 
    { width: 180, height: 180 },
  ];

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View className='flex-1 m-[5px]'>
       
      </View>
    );
  };
  return (
    <MasonryFlashList
      data={skeletonData}
      numColumns={3}
      renderItem={renderItem}
      estimatedItemSize={122}  
    />
  );
};

export default ImageSkeletons;
