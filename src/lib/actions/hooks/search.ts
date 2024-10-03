import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';

import searchApi from '@/lib/actions/search';
import { useTopServers } from './servers';
import { useTopCreators, useUsers } from './users';

const DEBOUNCE_DELAY = 300; // milliseconds 
const MIN_QUERY_LENGTH = 3;

type SearchType = 'all' | 'posts' | 'users' | 'servers';

export const useCombinedSearch = (initialQuery: string = '', initialType: SearchType = 'all') => {
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<SearchType>(initialType);
  const { data: topCreators, isPending: loadingCreators } = useTopCreators();
  const { data: topServers, isPending: loadingServers } = useTopServers();
  const { data: users, isPending: loadingUsers } = useUsers();


  const isQueryValid = query?.length >= MIN_QUERY_LENGTH;

  const searchQueries = useQueries({
    queries: [
      {
        queryKey: ['searchPosts', query],
        queryFn: () => searchApi.searchPosts(query),
        enabled: isQueryValid && (searchType === 'all' || searchType === 'posts'),
        retry: false,
      },
      {
        queryKey: ['searchUsers', query],
        queryFn: () => searchApi.searchUsers(query),
        enabled: isQueryValid && (searchType === 'all' || searchType === 'users'),
        retry: false,
      },
      {
        queryKey: ['searchServers', query],
        queryFn: () => searchApi.searchServers(query),
        enabled: isQueryValid && (searchType === 'all' || searchType === 'servers'),
        retry: false,
      },
    ],
  });
  const [postsQuery, usersQuery, serversQuery] = searchQueries;


  const isLoading = searchQueries.some(query => query.isLoading);
  const error = searchQueries.find(query => query.error)?.error;

  const handleSetQuery =(value: string) => {
    if (value?.length >= MIN_QUERY_LENGTH) {
      setQuery(value);
    } else {
      setQuery('');
    }
  }

  return {
    query,
    setQuery: handleSetQuery,
    searchType,
    setSearchType,
    results: {
      posts: postsQuery.data || [],
      users: usersQuery.data || [],
      servers: serversQuery.data || [],
    },
    isLoading,
    error,
    postsLoading: postsQuery.isLoading,
    usersLoading: usersQuery.isLoading,
    serversLoading: serversQuery.isLoading,
    postsError: postsQuery.error,
    usersError: usersQuery.error,
    serversError: serversQuery.error,
    topCreators,
    topServers,
    loadingCreators,
    loadingServers,
    isQueryValid,
    loadingUsers,
    //@ts-ignore
    users:users?.users
  };
};