import React from 'react';
import { FlatList, Image, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

import { Post as PostType, User } from '@/types';
import { View, Text } from '../themed';
import { HStack } from '@/components/ui/hstack'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface Link {
  id: number;
  title: string;
  url: string;
  icon: string;
}

interface Post {
  id: number;
  content: string;
  createdAt: string;
  author: User;
}

interface Server {
  id: number;
  name: string;
  image: string;
}

interface ServerItemProps {
  name: string;
  image: string;
}

interface File {
  id: number;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'xls';
}

interface LinkItemProps {
  title: string;
  url: string;
  icon: string;
}

interface FileItemProps {
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'xls';
}

// Mock data for testing
const MOCK_USERS: User[] = [
  { id: 1, name: 'John Doe', image: 'https://i.pravatar.cc/150?img=1', username: 'johndoe' },
  { id: 2, name: 'Jane Smith', image: 'https://i.pravatar.cc/150?img=2', username: 'janesmith' },
  { id: 3, name: 'Bob Johnson', image: 'https://i.pravatar.cc/150?img=3', username: 'bobjohnson' },
];

const MOCK_SERVERS: Server[] = [
  { id: 1, name: 'Gaming Hub', image: 'https://picsum.photos/200/200?random=1', username: 'gaminghub', popularity: 98, isServer: true },
  { id: 2, name: 'Music Lounge', image: 'https://picsum.photos/200/200?random=2', username: 'musiclounge', popularity: 94, isServer: true },
  { id: 3, name: 'Tech Talk', image: 'https://picsum.photos/200/200?random=3', username: 'techtalk', popularity: 91, isServer: true },
];

const MOCK_LINKS: Link[] = [
  { id: 1, title: 'Introduction to React Native', url: 'https://reactnative.dev/docs/getting-started', icon: 'book-open' },
  { id: 2, title: 'Animated Library in React Native', url: 'https://reactnative.dev/docs/animated', icon: 'zap' },
  { id: 3, title: 'React Native Gesture Handler', url: 'https://docs.swmansion.com/react-native-gesture-handler/', icon: 'send' },
];

const MOCK_FILES: File[] = [
  { id: 1, name: 'Project Proposal.pdf', size: '2.5 MB', type: 'pdf' },
  { id: 2, name: 'Meeting Notes.doc', size: '1.2 MB', type: 'doc' },
  { id: 3, name: 'Budget Sheet.xls', size: '3.7 MB', type: 'xls' },
];

const MOCK_POSTS: PostType[] = [
  { id: 1, content: 'Just finished a great React Native tutorial!', createdAt: new Date().toISOString(), author: MOCK_USERS[0] },
  { id: 2, content: 'Looking for collaborators on a new project. Any takers?', createdAt: new Date().toISOString(), author: MOCK_USERS[1] },
  { id: 3, content: 'Check out this awesome new JavaScript framework!', createdAt: new Date().toISOString(), author: MOCK_USERS[2] },
];

interface SearchResultsProps {
  result: (PostType | Server | User | Link | File)[];
  resultType: 'all' | 'media-links' | 'posts' | 'users' | 'servers' | 'files';
}

const UserItem: React.FC<User> = ({ id, username, image, name }) => (
  <TouchableOpacity className="flex-row items-center p-4 rounded-lg mb-2 shadow-sm">
    <Image
      source={{uri:image!}}
      className='h-[50px] w-[50px] rounded-[25px] border '
    />
    <Text className="ml-4 text-sm font-rregular">{username || name}</Text>
  </TouchableOpacity>
);

const ServerItem: React.FC<Server> = ({ id, name, image }) => (
  <TouchableOpacity className="flex-row items-center p-4 rounded-lg mb-2 shadow-sm">
    <Image
      source={{uri:image || ''}}
      className='h-[50px] w-[50px] rounded-[25px] border '
    />
    <Text className="ml-4 text-sm font-rregular">{name}</Text>
  </TouchableOpacity>
);

const LinkItem: React.FC<LinkItemProps> = ({ title, url, icon }) => (
  <Animated.View 
    entering={FadeIn.duration(400)} 
    exiting={FadeOut.duration(300)}
    className="flex-row items-center bg-white rounded-xl p-4 mb-3 shadow-sm"
  >
    <View className="bg-blue-100 p-3 rounded-full">
      <Feather name={icon as any} size={20} color="#3b82f6" />
    </View>
    <View className="flex-1 ml-4">
      <Text className="text-base font-medium text-gray-800">{title}</Text>
      <Text className="text-sm text-gray-500">{url}</Text>
    </View>
    <Feather name="external-link" size={20} color="#6b7280" />
  </Animated.View>
);

const FileItem: React.FC<FileItemProps> = ({ name, size, type }) => (
  <Animated.View 
    entering={FadeIn.duration(400)} 
    exiting={FadeOut.duration(300)}
    className="flex-row items-center bg-white rounded-xl p-4 mb-3 shadow-sm"
  >
    <View className="bg-gray-100 p-3 rounded-full">
      <Feather name={type === 'pdf' ? 'file-text' : type === 'doc' ? 'file' : 'file-plus'} size={20} color="#6b7280" />
    </View>
    <View className="flex-1 ml-4">
      <Text className="text-base font-medium text-gray-800">{name}</Text>
      <Text className="text-sm text-gray-500">{size}</Text>
    </View>
    <Feather name="download" size={20} color="#6b7280" />
  </Animated.View>
);

const Post: React.FC<PostType> = ({ id, content, createdAt, author }) => (
  <View className="p-4 rounded-lg mb-2 shadow-sm">
    <HStack className='items-center gap-20'>
      <View>
        <View className="flex-row items-center mb-2">
          <Image
            source={{uri:author.image!}}
            className='h-[50px] w-[50px] rounded-[25px] border'
          />
          <Text className="ml-2 font-rbold">{author.name}</Text>
        </View>
        <Text className="font-rregular mb-2">{content}</Text>
      </View>
      <Text className="text-gray-500 text-xs">{new Date(createdAt).toLocaleString()}</Text>
    </HStack>
  </View>
);

const SearchResults: React.FC<SearchResultsProps> = ({ result, resultType }) => {
  const renderItem = ({ item }: { item: PostType | Server | User | Link | File }) => {
    if (resultType === 'all') {
      if ('content' in item) return <Post {...(item as PostType)} />;
      if ('username' in item) return <UserItem {...(item as User)} />;
      if ('name' in item && !('username' in item)) return <ServerItem {...(item as Server)} />;
      if ('url' in item) return <LinkItem {...(item as Link)} />;
      if ('size' in item) return <FileItem {...(item as File)} />;
    }

    switch (resultType) {
      case 'posts':
        return <Post {...(item as PostType)} />;
      case 'users':
        return <UserItem {...(item as User)} />;
      case 'servers':
        return <ServerItem {...(item as Server)} />;
      case 'media-links':
        return <LinkItem {...(item as Link)} />;
      case 'files':
        return <FileItem {...(item as File)} />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1">
      {result.length > 0 ? (
        <FlatList
          data={result}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 8 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="search-outline" size={64} color="#9CA3AF" />
          <Text className="mt-4 text-lg font-semibold text-gray-600">No results found</Text>
          <Text className="mt-2 text-gray-500 text-center px-4">
            Try adjusting your search or filter to find what you're looking for
          </Text>
        </View>
      )}
    </View>
  );
};

// Example usage with mock data
const TestSearchResults: React.FC = () => {
  const allResults = [...MOCK_POSTS, ...MOCK_SERVERS, ...MOCK_USERS, ...MOCK_LINKS, ...MOCK_FILES];
  
  return (
    <View style={{ flex: 1 }}>
      <SearchResults result={allResults} resultType="all" />
    </View>
  );
};

export default TestSearchResults;