import { ScrollView, View } from 'react-native';
import { Skeleton, SkeletonText } from '../ui/skeleton';

const PostSkeleton = () => (
  <View className="p-2.5 mb-1">
    <View className="flex-row items-center">
      <Skeleton className="w-12 h-12 rounded-full mr-2.5 " speed={3} />
      <View className="flex-1">
        <SkeletonText className="w-1/3 h-4 mb-1" />
        <SkeletonText className="w-1/4 h-3" />
      </View>
      <SkeletonText className="w-16 h-3" />
    </View>
    <SkeletonText className="w-full h-4 mt-2.5 mb-2.5" />
    <Skeleton className="w-full h-56 rounded-lg mb-2.5" />
    <View className="flex-row justify-between mt-2.5">
      <View className="flex-row">
        <Skeleton className="w-6 h-6 rounded-full mr-2.5" />
        <Skeleton className="w-6 h-6 rounded-full mr-2.5" />
        <Skeleton className="w-6 h-6 rounded-full" />
      </View>
      <Skeleton className="w-6 h-6 rounded-full" />
    </View>
  </View>
);

const PostsSkeleton = () => (
  <ScrollView>
    {[...Array(10)].map((_, index) => (
      <PostSkeleton key={index} />
    ))}
  </ScrollView>
);

export default PostsSkeleton;