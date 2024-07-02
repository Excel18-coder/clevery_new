import { FlatList } from 'react-native';
import { Skeleton, HStack, VStack } from 'native-base';

const ServerCardSkeleton = () => {
  return (
    <HStack space={4} alignItems="center" p={4}>
      <Skeleton size="16" rounded="full" />
      <VStack flex={1} space={2}>
        <Skeleton h="4" rounded="full" w="1/2" color={"teal.500"} />
        <Skeleton h="4" rounded="full" w="3/4" />
      </VStack>
      <Skeleton size="6" rounded="full" />
    </HStack>
  );
};
const LoadingServers = () => {
  return (
    <VStack space={4} px={4} py={2}>
      <FlatList
        data={Array.from({ length: 10 }, (_, index) => index)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <ServerCardSkeleton />}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <VStack space={4} />}
      />
    </VStack>
  );
};

export default LoadingServers;