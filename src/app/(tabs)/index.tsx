import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { usePosts } from '@/lib';
import Post from '@/components/posts';
import * as WebBrowser from 'expo-web-browser';

import { ErrorMessage, Loader, Text } from '@/components';
import { router } from 'expo-router';
WebBrowser.maybeCompleteAuthSession();
export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: posts,
    isPending: feedLoading,
    isError: postsError,
    refetch: refetchPosts,
  } = usePosts({
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
    refetchPosts();
  };
  const keyExtractor = (item: any) => item?.id;

  if(feedLoading) return <Loader loadingText="Loading your feed" />

  if(postsError) return <ErrorMessage message='Something went wrong' />

  const handlePress = async() => {
   router.navigate('/invitation')
  }
  return (
    <View className='pt-7.5 flex-1'>
      <Pressable onPress={handlePress} >
        <Text className='font-rmedium text-2xl mb-5'>Your Feed</Text>
      </Pressable>
      <FlatList
        // @ts-ignore
        data={posts?.pages[0].posts}
        renderItem={({ item }) => <Post key={item?.id} {...item} />}
        keyExtractor={keyExtractor}
        // ListEmptyComponent={<PostsSkeleton />}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={() => handleRefresh()}
      />
    </View>
  );
}