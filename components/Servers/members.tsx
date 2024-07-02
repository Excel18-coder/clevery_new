import { FlatList, View } from 'react-native';
import { Skeleton, HStack, Image } from 'native-base';
import { Text } from '../Themed';

interface MembersComponentProps {
  userImages: string[];
}

const MembersComponent: React.FC<MembersComponentProps> = ({ userImages }) => {
  const renderItem = ({ item }: { item: string }) => (
    <Image
      source={{ uri: item }}
      alt={`User Image`}
      size={10}
      rounded="full"
      mr={2}
    />
  );

  const renderSkeleton = () => (
    <HStack space={2}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} size={10} rounded="full" />
      ))}
    </HStack>
  );

  return (
    <View className='mt-5'>
      <Text className='text-xs font-rbold mb-2'>Members:</Text>
      <FlatList
        data={userImages}
        keyExtractor={(index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={renderSkeleton}
        ItemSeparatorComponent={() => <View className='w-3' />}
      />
    </View>
  );
};

export default MembersComponent;
