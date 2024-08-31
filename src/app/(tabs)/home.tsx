import { useState } from 'react';
import { FlatList, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { endpoint, usePosts } from '@/lib';
import Post from '@/components/posts';
import { Button } from '@/components';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';

import "../global.css"
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

  const googleSignUp = async () => {
    // console.log('start')
    router.push('/sign-in')
    // const res = await fetch(`http://192.168.42.236:3000/api/auth/oauth?provider=google`)
    // const url = await res.json().then(d => d.url)

    // console.log(url)
    // const responce = await WebBrowser.openBrowserAsync(url)
    // console.log(responce)
  }

  // if (feedLoading) return <LoaderIcon />;
  // if (postsError) return <ErrorMessage message="There was an error communicating with the servers. Please ensure you have an internet connection then refresh" onRetry={() => handleRefresh()} />


  const keyExtractor = (item: any) => item?.id;

  return (
    <View className='pt-7.5 flex-1'>
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