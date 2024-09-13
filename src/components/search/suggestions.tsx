import { memo, useCallback } from 'react';
import { Pressable, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import SearchSuggestions from '@/components/search/suggestions-skeleton';
import { Text, View } from '@/components/themed';
import { useSearchStore } from '@/lib';

const ItemImage = ({ source, size = 50 }) => (
  <Image
    source={source}
    style={{
      height: size,
      width: size,
      borderRadius: size / 2,
      marginRight: 10,
      borderWidth: 1,
      borderColor: 'gray'
    }}
  />
);

const SectionTitle = ({ children }) => (
  <Text className='text-sm pb-2 font-rbold'>{children}</Text>
);

const TopUsers = memo(({ suggestedUsers, addSearch }: { suggestedUsers: any[]; addSearch: any }) => {
  
  const handleUserClick = useCallback((user) => {
    addSearch({
      id: user.id,
      name: user.name,
      date: Date.now().toString(),
      image: user.image
    });
    router.push(`/user/${user.id}`);
  }, [addSearch]);

  if (!suggestedUsers?.length) return <SearchSuggestions />;

  return (
    <View>
      <SectionTitle>Top Users</SectionTitle>
      {suggestedUsers.slice(0, 3).map((item) => (
        <Pressable key={item.id} className='flex-row items-center p-1.5' onPress={() => handleUserClick(item)}>
          <ItemImage source={item.image} />
          <View>
            <Text className='text-sm font-rmedium'>{item.name}</Text>
            <Text className='text-[10px] font-rregular'>{item.username}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
});

const TopServers = memo(({ suggestedServers }: { suggestedServers: any[] }) => {
  if (!suggestedServers?.length) return <SearchSuggestions />;

  return (
    <View>
      <SectionTitle>Top Servers</SectionTitle>
      {suggestedServers.map((item) => (
        <View key={item.id} className='flex-row items-center p-1.5'>
          <ItemImage source={item.image} />
          <View>
            <Text className='text-sm font-rmedium'>{item.name}</Text>
            <Text className='text-[10px] font-rregular'>{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
});

const RecentItem = memo(({ item, onClear }: { item: any; onClear: any }) => (
  <View className='flex-row justify-between items-center'>
    <Pressable className='flex-row items-center p-1.5'>
      <ItemImage source={item.image} size={30} />
      <Text className='font-rmedium text-sm'>{item.name}</Text>
    </Pressable>
    <Pressable onPress={() => onClear(item.id)}>
      <Ionicons name="close-circle-outline" size={24} color="#666" />
    </Pressable>
  </View>
));

const Suggestions = ({
  suggestedUsers,
  onClearSearchHistory,
  suggestedServers,
  addSearch
}) => {
  const { searches } = useSearchStore();

  const renderRecentItem = useCallback(({ item }) => (
    <RecentItem item={item} onClear={onClearSearchHistory} />
  ), [onClearSearchHistory]);

  return (
    <FlatList
      className='px-1 py-2'
      ListHeaderComponent={
        <>
          <Text className='text-lg pb-2 font-rbold'>Suggestions</Text>
          <TopUsers suggestedUsers={suggestedUsers} addSearch={addSearch} />
          <TopServers suggestedServers={suggestedServers} />
        </>
      }
      data={searches}
      renderItem={renderRecentItem}
      keyExtractor={(item) => item.id}
      initialNumToRender={10}
      maxToRenderPerBatch={20}
      windowSize={21}
    />
  );
};

export default memo(Suggestions);