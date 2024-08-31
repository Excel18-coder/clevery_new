import { HStack } from '@/components/ui/hstack';
import { Skeleton } from '@/components/ui/skeleton';
import { VStack } from '@/components/ui/vstack';
import { FlatList, TouchableOpacity } from 'react-native';

const MessageSkeleton = () => (
  <TouchableOpacity activeOpacity={1} className="flex-row items-start mb-4 px-2">
    <Skeleton className="w-10 h-10 rounded-full mr-3 bg-gray-300 from-gray-400 to-gray-900" />
    <VStack className="flex-1 space-y-2">
      <HStack className="items-center space-x-2 mb-2">
        <Skeleton className="h-2 w-24 m-2 rounded-md" />
        <Skeleton className="h-2 w-16 rounded-md" />
      </HStack>
      <Skeleton className="h-3 w-full rounded-md mb-2" />
      <Skeleton className="h-3 w-3/4 rounded-md" />
    </VStack>
  </TouchableOpacity>
);

const LoadingMessages = () => {
  return (
    <FlatList
      data={Array.from({ length: 10 })}
      keyExtractor={(_, index) => index.toString()}
      renderItem={() => <MessageSkeleton />}
      showsVerticalScrollIndicator={false}
      contentContainerClassName="px-4 py-2"
    />
  );
};

export default LoadingMessages;