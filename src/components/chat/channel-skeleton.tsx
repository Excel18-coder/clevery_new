import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Skeleton, SkeletonText } from '../ui/skeleton';

const HeaderSkeleton = () => (
  <View className='flex-row items-center p-2.5 mt-7'>
    <Skeleton className="w-6 h-6 rounded-full bg-gray-400" />
    <SkeletonText className="ml-2.5 w-40 h-6 bg-gray-400" />
    <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
      <Skeleton className="w-6 h-6 rounded-full mr-4 bg-gray-400" />
      <Skeleton className="w-6 h-6 rounded-full bg-gray-400" />
    </View>
  </View>
);
const TopSkeleton = () => (
  <View className='flex-1 p-5'>
    <View className={`flex flex-1 h-[100%]`} />
    <View className={`flex-1 p-2.5 mb-5 w-full`}>
      <Skeleton className='w-[60px] h-[60px] rounded-[20px] bg-gray-400' speed={4} startColor='#cdcde0'/>
      <SkeletonText className='w-10/12 h-[36px] mt-2 bg-gray-400 rounded-sm' speed={4} startColor='#cdcde0'/>
      <SkeletonText className='w-1/2 h-[16px] mt-2 bg-gray-400 rounded-sm' speed={4} startColor='#cdcde0'/>
      <SkeletonText className='w-2/3 h-[20px] mt-4 bg-gray-400 rounded-sm' speed={4} startColor='#cdcde0'/>
    </View>
  </View>
);

const MessageSkeleton = () => (
  <View className="px-4 py-2 my-4">
      <View className="flex-row items-center mt-2 mb-1">
        <Skeleton className="w-10 h-10 rounded-full mr-3 bg-gray-400" />
        <View className="flex-1">
          <SkeletonText className="w-1/3 h-4 mb-1 bg-gray-400" />
          <SkeletonText className="w-1/4 h-3 bg-gray-400" />
        </View>
      </View>
    <View className="flex-row">
      <View className="flex-1">
        <SkeletonText className="w-3/4 h-4 mb-1 bg-gray-400" />
        <SkeletonText className="w-1/2 h-4 bg-gray-400" />
      </View>
    </View>
    <SkeletonText className="w-16 h-3 mt-1 bg-gray-400" />
  </View>
);

const MessageInputSkeleton = () => (
  <View className="flex-row items-center p-2 border-t border-gray-200">
    <Skeleton className="w-8 h-8 rounded-full mr-2" />
    <View className="flex-1 h-10 bg-gray-100 rounded-full" />
    <Skeleton className="w-8 h-8 rounded-full ml-2" />
  </View>
);

const MessagesSkeleton = () => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <HeaderSkeleton />
      <TopSkeleton/>
      <View style={{ flex: 1 }}>
        {[...Array(20)].map((_, index) => (
          <MessageSkeleton key={index}/>
        ))}
      </View>
      <MessageInputSkeleton />
    </ScrollView>
  );
};

export default React.memo(MessagesSkeleton);