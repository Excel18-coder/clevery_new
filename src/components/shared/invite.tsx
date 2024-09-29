import React, { useState, useCallback, useRef } from 'react';
import { FlatList, TouchableOpacity, ActivityIndicator, Dimensions, TextInput } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image } from 'expo-image';

import { Text, View } from '../themed';
import { User } from '@/types';
import LoadingUsers from './loading-users';
import { HStack } from '../ui/hstack';
import item from '../chat/messages/item';
import { Input, InputField } from '../ui/input';


interface Props {
  onInvitePress: (user: User) => void;
  removeUser: (userId: string) => void;
  onClose: () => void;
  buttonText: string;
  selectedUsers: User[];
  users?: User[];
  loading: boolean;
}

const icons = [
  { name: 'upload', component: <Feather name="upload" size={24} color="white" />, label: 'Share' },
  { name: 'link', component: <Feather name="link" size={24} color="white" />, label: 'Copy Link', onPress: true },
  { name: 'message-circle', component: <Feather name="message-circle" size={24} color="white" />, label: 'Messages' },
  { name: 'user-plus', component: <Feather name="user-plus" size={24} color="white" />, label: 'Email' },
  { name: 'whatsapp', component: <FontAwesome6 name="whatsapp" size={24} color="white" />, label: 'Whatsapp' },
];

const InviteFriends: React.FC<Props> = ({ 
  users, 
  onInvitePress, 
  buttonText, 
  onClose, 
  selectedUsers, 
  removeUser,
  loading
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<TextInput>(null);

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: withSpring(1, { damping: 20, stiffness: 90 }),
        transform: [
          { translateX: withSpring(0, { damping: 20, stiffness: 90 }) },
          { scale: withSpring(1, { damping: 20, stiffness: 90 }) },
        ],
      };
    });
  
  const copyToClipboard = async () => {
    try {
      // await Clipboard.setStringAsync('https://clevery.vercel.app/');
      // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setError('Failed to copy link. Please try again.');
    }
  };

  const handleInvitePress = useCallback((user: User) => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onInvitePress(user);
  }, [onInvitePress]);

  const renderUser = useCallback(({ item, index }: { item: User; index: number }) => {

    return (
      <Animated.View 
        style={[{ opacity: 0, transform: [{ translateX: 50 }, { scale: 0.8 }] },animatedStyle]}
        className="flex-row items-center bg-white bg-opacity-10 rounded-xl mb-3 p-3"
      >
        <Image
          source={{ uri: item.image}}
          style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', marginRight: 10 }}
        />
        <Text className="flex-1 font-rregular text-base text-gray-50">{item.name}</Text>
        <TouchableOpacity 
          disabled={loading}
          className={`${loading ? 'bg-gray-400' : 'bg-emerald-500'} px-4 py-2 rounded-xl shadow-lg`}
          onPress={() => handleInvitePress(item)}
        >
          {!loading ? (
            <Animated.Text className="font-rmedium">{buttonText}</Animated.Text>
          ) : (
            <ActivityIndicator size={'small'} color="#ffffff" />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }, [onInvitePress, buttonText, loading]);

  return (
    <LinearGradient
      colors={['#4158D0', '#C850C0', '#FFCC70']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 p-5 pt-12"
    >
      <Animated.View 
        entering={FadeInRight.duration(800).springify()}
        className="flex-row items-center justify-between mb-6"
      >
        <Animated.Text className="text-4xl font-rbold text-white">Invite Friends</Animated.Text>
        <TouchableOpacity
          onPress={onClose}
          className="p-2 bg-opacity-20 rounded-full"
        >
          <Feather name="x" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {selectedUsers.length > 0 && (
        <FlatList
          horizontal
          data={selectedUsers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mr-3"
              onPress={() => removeUser(item.id)}
            >
              <Animated.View 
                entering={FadeInRight.duration(500).springify()}
                exiting={FadeOutLeft.duration(500).springify()}
              >
                <Image
                  source={{ uri: item.image}}
                  style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', marginRight: 10 }}
                />
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                  <Feather name="x" size={12} color="white" />
                </View>
              </Animated.View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{paddingBottom:12,paddingTop:6}}
        />
      )}

      <Animated.View 
        entering={FadeInRight.delay(300).duration(800).springify()}
        className="w-full flex-row items-center bg-gray-300 bg-opacity-10 shadow-lg p-3 rounded-xl px-4 mb-5"
      >
        <Feather name="search" size={20} color="white" />
        <Input>
          <InputField
            ref={searchInputRef}
            className="flex-1 py-2 pl-3 bg-transparent w-full"
            placeholder="Search friends"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Input>
      </Animated.View>

      <Animated.View 
        entering={FadeInRight.delay(600).duration(800).springify()}
        className="bg-opacity-10 rounded-xl p-2 mb-5"
      >
       <HStack>
        {icons.map((item) => (
          <TouchableOpacity 
            key={item.name}  // Add a unique key prop
            onPress={item.name === 'link' ? copyToClipboard : undefined}
            className="items-center mx-4"
          >
            <Animated.View className="bg-opacity-20 p-3 rounded-full mb-2">
              {item.component}
            </Animated.View>
            <Animated.Text className="text-xs text-white font-rregular">
              {item.label}
            </Animated.Text>
          </TouchableOpacity>
        ))}
      </HStack>

      </Animated.View>

      {error && (
        <Animated.View 
          entering={FadeInRight.duration(500).springify()}
          className="bg-red-500 p-3 rounded-xl mb-3"
        >
          <Text className="text-white font-rmedium">{error}</Text>
        </Animated.View>
      )}

      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingTop:12}}
        ListEmptyComponent={<LoadingUsers />}
      />
    </LinearGradient>
  );
};

export default InviteFriends;