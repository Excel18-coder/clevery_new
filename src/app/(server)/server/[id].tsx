import React, { memo, useState } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';

import { formatDateString, useServer } from '@/lib';
import Loader from '@/components/states/loading';
import { Text, View } from '@/components/themed';
import MembersComponent from '@/components/servers/members';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const Server: React.FC = () => {
  const { id: serverId } = useLocalSearchParams();
  const {
    data: server,
    isLoading: loadingServer,
    error
  } = useServer(serverId as string);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const channels = server?.channels;
  if (loadingServer) return <Loader loadingText='Loading Server' />;
  if (error) return <Loader loadingText='Something went wrong' />;

  const textChannels = channels?.filter((channel) => channel.type === "TEXT");
  const audioChannels = channels?.filter((channel) => channel.type === "AUDIO");
  const videoChannels = channels?.filter((channel) => channel.type === "VIDEO");
  const bannerImageUrl = 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=400';

  const ChannelButton: React.FC<{ icon: string; name: string; onPress: () => void }> = ({ icon, name, onPress }) => {
    const [pressAnim] = useState(new Animated.Value(1));

    const handlePressIn = () => {
      Animated.spring(pressAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(pressAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <AnimatedTouchableOpacity
        className='flex-row items-center mr-2 mb-2 p-3 rounded-md bg-gray-100'
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          transform: [{ scale: pressAnim }],
        }}
      >
        <Feather name={icon as any} size={20} color="gray" />
        <Text className='ml-2 font-pregular text-gray-600 text-sm'>{name}</Text>
      </AnimatedTouchableOpacity>
    );
  };

  return (
    <ScrollView className='flex-1 bg-white'>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent']}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 100, zIndex: 1 }}
        />
        <Image
          style={{ width: '100%', height: 250 }}
          contentFit='cover'
          source={{uri: bannerImageUrl}}
        />
        <View className='p-6 -mt-20 rounded-t-3xl bg-white'>
          <View className='flex-row justify-between items-center mb-6'>
            <View className='flex-row items-center'>
              <Image
                source={{uri: server?.image!}}
                style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: 'white' }}
                contentFit='cover'
              />
              <View className='ml-4'>
                <Text className='font-rbold text-3xl'>{server?.name}</Text>
                <Text className='text-sm text-gray-500 mt-1 font-rregular'>
                  Created on: {formatDateString(server?.createdAt!)}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              className='p-3 rounded-full bg-gray-100' 
              onPress={() => router.push(`/admin?id=${serverId}`)}
            >
              <Feather name="edit" size={22} color="gray" />
            </TouchableOpacity>
          </View>

          <View className='bg-gray-50 p-4 rounded-lg mb-6'>
            <Text className='text-sm font-rbold mb-2'>About:</Text>
            <Text className='font-rregular text-sm text-gray-600'>{server?.description}</Text>
          </View>

          <View className='flex justify-between flex-row items-center mb-4'>
            <Text className='text-lg font-rbold text-gray-700'>Channels</Text>
            <TouchableOpacity 
              className='p-2 rounded-full bg-blue-500' 
              onPress={() => router.push(`/create-channel/${serverId}`)}
            >
              <Feather name='plus' color="white" size={20} />
            </TouchableOpacity>
          </View>

          {!!textChannels?.length && (
            <View className='mb-6'>
              <Text className='text-sm font-rbold mb-3 text-gray-500'>Text Channels:</Text>
              <View className='flex-row flex-wrap'>
                {textChannels?.map((channel, i) => (
                  <ChannelButton
                    key={i}
                    icon="hash"
                    name={channel.name}
                    onPress={() => router.replace(`/channel?id=${channel?.id}&serverId=${serverId}`)}
                  />
                ))}
              </View>
            </View>
          )}

          {!!audioChannels?.length && (
            <View className='mb-6'>
              <Text className='text-sm font-rbold mb-3 text-gray-500'>Voice Channels:</Text>
              <View className='flex-row flex-wrap'>
                {audioChannels?.map((channel, i) => (
                  <ChannelButton
                    key={i}
                    icon="mic"
                    name={channel.name}
                    onPress={() => router.replace(`/room/`)}
                  />
                ))}
              </View>
            </View>
          )}

          {!!videoChannels?.length && (
            <View className='mb-6'>
              <Text className='text-sm font-rbold mb-3 text-gray-500'>Video Channels:</Text>
              <View className='flex-row flex-wrap'>
                {videoChannels?.map((channel, i) => (
                  <ChannelButton
                    key={i}
                    icon="video"
                    name={channel.name}
                    onPress={() => router.replace(`/channel/${channel?.id}`)}
                  />
                ))}
              </View>
            </View>
          )}

          <MembersComponent
            userImages={server?.members?.map((usr) => usr?.image!)!}
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(Server);