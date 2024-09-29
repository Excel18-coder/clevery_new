import { useState, useCallback, memo } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Pressable, View } from 'react-native';

import { ErrorMessage, Loader, Text } from '@/components';
import PostsSkeleton from '@/components/posts/skeleton';
import Post from '@/components/posts';
import { usePosts } from '@/lib';

function Home() {
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
    refetch,
  } = usePosts()

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch(error => {
        console.error('Error loading more posts:', error);
      });
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  const renderItem = useCallback(({ item }: { item: any }) => (
    <Post key={item?.id} {...item} />
  ), []);

  const handlePress = useCallback(() => {
    // router.navigate('/invitation')
  }, []);


  if (isLoading) return <PostsSkeleton />;

  if (isError || data?.pages?.posts?.length < 5) return <ErrorMessage message='Something went wrong' onRetry={handleRefresh} />;

  const flattenedData = data?.pages?.flatMap(page => page?.posts) || [];
  
  
  return (
    <View className='pt-7.5 flex-1'>
      <Pressable onPress={handlePress}>
        <Text className='font-rmedium text-2xl mb-5'>Your Feed</Text>
      </Pressable>
      <FlashList
        data={flattenedData}
        renderItem={renderItem}
        keyExtractor={(item: any) => item?.id?.toString()}
        ListEmptyComponent={<PostsSkeleton />}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        estimatedItemSize={166}
        ListFooterComponent={() => 
          isFetchingNextPage ? <Loader loadingText="Loading more posts" /> : null
        }
      />
    </View>
  );
}

export default memo(Home);