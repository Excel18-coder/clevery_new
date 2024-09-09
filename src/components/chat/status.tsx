import React, { useState, useRef } from 'react';
import { Pressable, FlatList, TextInput, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  useDerivedValue,
  interpolate,
  Extrapolation,
  FadeInUp,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { Text, View } from '@/components/themed';
import { useProfileStore } from '@/lib';


const MOCK_STATS = {
  totalStatuses: 15,
  totalLikes: 230,
  totalComments: 45,
  popularityScore: 78,
};

const MOCK_STATUSES = [
  { id: '1', content: "Just finished a great workout! 💪", likes: 24, comments: 3 },
  { id: '2', content: "Excited for the weekend plans! 🎉", likes: 31, comments: 5 },
  { id: '3', content: "New project starting tomorrow. Wish me luck! 🍀", likes: 42, comments: 7 },
];

const StatusPage = () => {
  const [statuses, setStatuses] = useState(MOCK_STATUSES);
  const [newStatus, setNewStatus] = useState('');
  const { profile } = useProfileStore();
  const offsetY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const isCreatingStatus = useSharedValue(0);

  const headerHeight = useDerivedValue(() => {
    return interpolate(scrollY.value, [0, 100], [200, 100], Extrapolation.CLAMP);
  });

  const headerStyle = useAnimatedStyle(() => ({
    height: headerHeight.value,
  }));

  const gradientColors = useDerivedValue(() => [
    interpolateColor(scrollY.value, [0, 100], ['#6366F1', '#818CF8']),
    interpolateColor(scrollY.value, [0, 100], ['#818CF8', '#A5B4FC']),
  ]);

  const createStatusStyle = useAnimatedStyle(() => ({
    height: withSpring(isCreatingStatus.value ? 150 : 50),
    opacity: withTiming(isCreatingStatus.value ? 1 : 0.8),
  }));

  const renderStatus = ({ item }) => (
    <Animated.View 
      entering={FadeInUp}
      className="rounded-lg shadow-md p-4 mb-4"
    >
      <Text className="font-rmedium text-base mb-2">{item.content}</Text>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Feather name="heart" size={16} color="#EF4444" />
          <Text className="ml-1 font-rregular text-sm">{item.likes}</Text>
          <Feather name="message-circle" size={16} color="#3B82F6" className="ml-4" />
          <Text className="ml-1 font-rregular text-sm">{item.comments}</Text>
        </View>
        <Text className="font-rthin text-xs text-gray-500">2h ago</Text>
      </View>
    </Animated.View>
  );

  const createStatus = () => {
    if (newStatus.trim()) {
      const newStatusObj = {
        id: Date.now().toString(),
        content: newStatus,
        likes: 0,
        comments: 0,
      };
      setStatuses([newStatusObj, ...statuses]);
      setNewStatus('');
      isCreatingStatus.value = 0;
    }
  };
  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetY.value = event.contentOffset.y;
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View className="flex-1">
      <Animated.View style={headerStyle}>
        <Animated.View style={useAnimatedStyle(() => ({ backgroundColor: gradientColors.value[0] }))} className="absolute inset-0" />
        <LinearGradient
          colors={gradientColors.value}
          style={{ flex: 1, justifyContent: 'flex-end', padding: 20 }}
        >
          <Text className="text-4xl font-rbold text-white mb-2">Your Status</Text>
          <Text className="text-lg font-rregular text-white">Share your thoughts!</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 20 }}
      >
        <Animated.View style={createStatusStyle} className="rounded-lg shadow-md mb-6 overflow-hidden">
          <Pressable 
            onPress={() => {
              isCreatingStatus.value = isCreatingStatus.value === 0 ? 1 : 0;
            }}
            className="flex-row items-center p-4"
          >
            <Feather name="plus-circle" size={24} color="#6366F1" />
            <Text className="ml-2 font-rmedium text-base">Create new status</Text>
          </Pressable>
          {isCreatingStatus.value === 1 && (
            <View className='p-4 flex-1'>
              <TextInput
                value={newStatus}
                onChangeText={setNewStatus}
                placeholder="What's on your mind?"
                multiline
                className="px-4 py-2 font-rregular"
                style={{ height: 80 }}
              />
              <Pressable
                onPress={createStatus}
                className="bg-indigo-500 p-2 m-2 rounded-md"
              >
                <Text className="text-white font-rmedium text-center">Post Status</Text>
              </Pressable>
            </View>
          )}
        </Animated.View>

        <View className="rounded-lg mb-6">
          <View className="flex-row justify-between items-center p-4">
            {Object.entries(MOCK_STATS).map(([key, value]) => (
              <View key={key} className="items-center">
                <Text className="font-rbold text-2xl text-indigo-600">{value}</Text>
                <Text className="font-rregular text-xs text-gray-600 mt-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-white rounded-lg shadow-md p-4 mb-6">
          <Text className="font-rmedium text-lg mb-2">Boost Your Popularity!</Text>
          <Text className="font-rregular text-sm text-gray-600">
            Creating engaging statuses increases your visibility and popularity on the platform. 
            Share your thoughts, experiences, or ask questions to connect with others!
          </Text>
        </View>

        <FlatList
          data={statuses}
          renderItem={renderStatus}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </Animated.ScrollView>
    </View>
  );
};

export default StatusPage;