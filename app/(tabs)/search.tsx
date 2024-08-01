import React, { useState } from 'react';
import { FlatList, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { SearchResults, Suggestions, SearchTabBar as TabBar, Text, View } from '@/components';
import { useCombinedSearch } from '@/lib/actions/hooks/search';

type TabBarOptions = 'recents' | 'people' | 'media-links' | 'files';
type SearchType = 'all' | 'posts' | 'users' | 'servers';

const SearchBar: React.FC<{ setSearch: (query: string) => void }> = ({ setSearch }) => (
  <TextInput
    placeholder="Search"
    onChangeText={setSearch}
  />
);

const ExploreComponent: React.FC = () => {
  const [selectedTabBar, setSelectedTabBar] = useState<TabBarOptions>('recents');
  const { 
    query, 
    setQuery, 
    searchType, 
    setSearchType, 
    results, 
    isLoading,
    topCreators,
    topServers,
    loadingCreators,
    loadingServers
  } = useCombinedSearch();

  const handleSetSearch = (term: string) => {
    setQuery(term);
    setSearchType(mapTabBarToSearchType(selectedTabBar));
  };

  return (
    <View>
      <SearchBar setSearch={handleSetSearch} />
      <TabBar
        selectedTabBar={selectedTabBar}
        setSelectedTabBar={setSelectedTabBar}
      />
      {renderContent(selectedTabBar, results, isLoading, topCreators, topServers)}
    </View>
  );
};

const mapTabBarToSearchType = (tabBar: TabBarOptions): SearchType => {
  switch (tabBar) {
    case 'people': return 'users';
    case 'media-links': return 'posts';
    case 'files': return 'servers'; // Assuming 'files' corresponds to 'servers'
    default: return 'all';
  }
};

const renderContent = (
  selectedTabBar: TabBarOptions,
  results: { posts: any[]; users: any[]; servers: any[] },
  isLoading: boolean,
  topCreators?: any[],
  topServers?: any[]
) => {
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  switch (selectedTabBar) {
    case 'recents':
      return results.posts.length || results.users.length || results.servers.length ? (
        <SearchResults results={[...results.posts, ...results.users, ...results.servers]} />
      ) : (
        <Suggestions
          onClearSearchHistory={() => {}}
          searchHistory={[]}
          addSearch={() => {}}
          onClearAllSearches={() => {}}
          suggestedServers={topServers || []}
          suggestedUsers={topCreators || []}
        />
      );
    case 'people':
      return (
        <FlatList
          data={results.users}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/user/${item.id}`)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
        />
      );
    case 'media-links':
      return <SearchResults results={results.posts} />;
    case 'files':
      return <SearchResults results={results.servers} />;
    default:
      return null;
  }
};

export default ExploreComponent;