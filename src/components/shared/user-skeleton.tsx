import { HStack } from "../ui/hstack";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { VStack } from "../ui/vstack";

const UserSkeleton = () => {
  return (
    <HStack className="space-x-4 items-center px-4 py-2">
      <Skeleton className="w-12 h-12 rounded-full bg-gray-500 from-gray-500 to-gray-800" />
      <VStack className="flex-1 space-y-3 gap-3">
        <SkeletonText className="bg-gray-500 from-gray-500 to-gray-800 h-2.5 ml-2 w-1/2 rounded-md" />
        <Skeleton className="h-3 rounded-full  bg-gray-500 from-gray-500 to-gray-800" />
      </VStack>
    </HStack>
  );
};

export default UserSkeleton;