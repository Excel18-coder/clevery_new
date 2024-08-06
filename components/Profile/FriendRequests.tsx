import React, { memo, useState } from 'react';
import { FlatList, TouchableOpacity, Animated } from 'react-native';
import { Text, View } from '../Themed';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

interface FriendRequest {
  id: string;
  username: string;
  avatar: string;
}

interface FriendRequestsProps {
  friendRequests: FriendRequest[];
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const FriendRequestItem: React.FC<{ item: FriendRequest; onAccept: () => void; onReject: () => void }> = ({ item, onAccept, onReject }) => {
  const [animationValue] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.spring(animationValue, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const animatedStyle = {
    transform: [
      {
        scale: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
    opacity: animationValue,
  };

  return (
    <AnimatedTouchableOpacity className="flex-row items-center bg-white rounded-xl p-4 mb-3 shadow-md" style={animatedStyle}>
      <Image source={{ uri: item.avatar }} className="w-12 h-12 rounded-full mr-4" />
      <View className="flex-1">
        <Text className="text-lg font-bold mb-1">{item.username}</Text>
        <Text className="text-sm text-gray-600">Wants to be your friend</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity onPress={onAccept} className="w-10 h-10 rounded-full bg-green-500 justify-center items-center ml-2">
          <Ionicons name="checkmark-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onReject} className="w-10 h-10 rounded-full bg-red-500 justify-center items-center ml-2">
          <Ionicons name="close-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </AnimatedTouchableOpacity>
  );
};

const FriendRequests: React.FC<FriendRequestsProps> = ({ friendRequests }) => {
  const onAcceptPress = (id: string) => {
    // Implement accept logic
  };

  const onRejectPress = (id: string) => {
    // Implement reject logic
  };

  const renderItem = ({ item }: { item: FriendRequest }) => (
    <FriendRequestItem
      item={item}
      onAccept={() => onAcceptPress(item.id)}
      onReject={() => onRejectPress(item.id)}
    />
  );

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {friendRequests.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="people-outline" size={64} color="#ccc" />
          <Text className="text-lg text-gray-600 mt-4 text-center">No friend requests at the moment.</Text>
        </View>
      ) : (
        <FlatList
          data={friendRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
};

export default memo(FriendRequests);