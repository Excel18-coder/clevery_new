 import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text, Button, View } from '@/components';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

// Mock data for user activity
const mockUserActivity = {
  posts: [
    { id: '1', title: 'My first post', createdAt: '2024-09-10T12:00:00Z' },
    { id: '2', title: 'Thoughts on React Native', createdAt: '2024-09-09T15:30:00Z' },
  ],
  comments: [
    { id: '1', content: 'Great post!', createdAt: '2024-09-11T09:15:00Z' },
    { id: '2', content: 'I disagree with this point...', createdAt: '2024-09-10T18:45:00Z' },
  ],
  likes: [
    { id: '1', targetType: 'post', targetId: '3', createdAt: '2024-09-11T10:00:00Z' },
    { id: '2', targetType: 'comment', targetId: '5', createdAt: '2024-09-10T14:20:00Z' },
  ],
  saves: [
    { id: '1', targetType: 'post', targetId: '7', createdAt: '2024-09-09T11:30:00Z' },
  ],
  bookmarks: [
    { id: '1', targetType: 'post', targetId: '9', createdAt: '2024-09-08T16:00:00Z' },
  ],
  serverMemberships: [
    { id: '1', serverId: 'server1', role: 'member', joinedAt: '2024-09-01T10:00:00Z' },
    { id: '2', serverId: 'server2', role: 'admin', joinedAt: '2024-08-15T14:30:00Z' },
  ],
};

const ActivityItem = ({ icon, title, content, date }) => {
  const theme = useTheme();
  
  return (
    <Animated.View 
      entering={FadeIn} 
      exiting={FadeOut}
      className="flex-row items-center py-4 border-b border-gray-200"
    >
      <Feather name={icon} size={24} color={theme.colors.text} className="mr-4" />
      <View className="flex-1">
        <Text className="text-base font-medium">{title}</Text>
        <Text className="text-sm text-gray-500">{content}</Text>
      </View>
      <Text className="text-xs text-gray-400">{new Date(date).toLocaleDateString()}</Text>
    </Animated.View>
  );
};

const ActivitySection = ({ title, data, renderItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="mb-6">
      <TouchableOpacity 
        onPress={() => setIsExpanded(!isExpanded)} 
        className="flex-row items-center justify-between mb-2"
      >
        <Text className="text-xl font-rmedium">{title}</Text>
        <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} />
      </TouchableOpacity>
      {isExpanded && data.map(renderItem)}
    </View>
  );
};

const ActivityPage = () => {
  const theme = useTheme();

  return (
    <ScrollView className="flex-1 p-5" style={{ backgroundColor: theme.colors.background }}>
      <Text className="text-3xl font-rbold mb-5">Your Activity</Text>
      
      <View className="flex-row bg-blue-100 rounded-lg p-4 mb-5">
        <Feather name="info" size={24} color={theme.colors.primary} className="mr-3" />
        <Text className="flex-1 text-sm font-rregular">
          Here's a summary of your recent activity on the platform. You can see your posts, comments, likes, and more.
        </Text>
      </View>

      <ActivitySection
        title="Recent Posts"
        data={mockUserActivity.posts}
        renderItem={(post) => (
          <ActivityItem
            key={post.id}
            icon="file-text"
            title={post.title}
            content="You created a new post"
            date={post.createdAt}
          />
        )}
      />

      <ActivitySection
        title="Recent Comments"
        data={mockUserActivity.comments}
        renderItem={(comment) => (
          <ActivityItem
            key={comment.id}
            icon="message-square"
            title="You commented"
            content={comment.content}
            date={comment.createdAt}
          />
        )}
      />

      <ActivitySection
        title="Recent Likes"
        data={mockUserActivity.likes}
        renderItem={(like) => (
          <ActivityItem
            key={like.id}
            icon="heart"
            title={`You liked a ${like.targetType}`}
            content={`${like.targetType} ID: ${like.targetId}`}
            date={like.createdAt}
          />
        )}
      />

      <ActivitySection
        title="Saved Items"
        data={mockUserActivity.saves}
        renderItem={(save) => (
          <ActivityItem
            key={save.id}
            icon="bookmark"
            title={`You saved a ${save.targetType}`}
            content={`${save.targetType} ID: ${save.targetId}`}
            date={save.createdAt}
          />
        )}
      />

      <ActivitySection
        title="Bookmarks"
        data={mockUserActivity.bookmarks}
        renderItem={(bookmark) => (
          <ActivityItem
            key={bookmark.id}
            icon="star"
            title={`You bookmarked a ${bookmark.targetType}`}
            content={`${bookmark.targetType} ID: ${bookmark.targetId}`}
            date={bookmark.createdAt}
          />
        )}
      />

      <ActivitySection
        title="Server Memberships"
        data={mockUserActivity.serverMemberships}
        renderItem={(membership) => (
          <ActivityItem
            key={membership.id}
            icon="users"
            title={`Server: ${membership.serverId}`}
            content={`Role: ${membership.role}`}
            date={membership.joinedAt}
          />
        )}
      />
    </ScrollView>
  );
};

export default ActivityPage;