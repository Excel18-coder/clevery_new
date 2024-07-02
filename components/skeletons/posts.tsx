import { FlatList, View } from 'react-native';
import { VStack, Skeleton, HStack } from 'native-base';

const PostsSkeleton = () => {
  return (
    <VStack space={4} px={4} py={2}>
      <FlatList
        data={Array.from({ length: 5 }, (_, index) => index)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => (
            <HStack space={4} color={"gray.300"} marginBottom={"10"}>
            <Skeleton size="16" rounded="md" h="24" borderRadius={"lg"} />
            <VStack flex={1} space={2}>
              <Skeleton h="4" rounded="full" w="1/2" />
              <Skeleton h="4" rounded="full" w="3/4" />
              <Skeleton h="4" rounded="full" w="1/2" />
            </VStack>
          </HStack>
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <VStack space={4} />}
      />
    </VStack>
  );
};

export default PostsSkeleton;
