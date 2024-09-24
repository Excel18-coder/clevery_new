import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { Link, Stack } from 'expo-router';

import { HStack, Text, View, VStack } from '@/components';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Something went wrong', presentation: "fullScreenModal" }} />
      <LinearGradient
        colors={['#f3e7e9', '#e3eeff']}
        style={{ flex: 1 }}
      >
        <VStack className='flex-1 justify-center items-center p-6'>
          <Animated.View entering={FadeInDown.delay(300).duration(1000)}>
            <LottieView
              source={require('@/assets/animations/error.json')}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(600).duration(1000)}>
            <Text className='font-rbold text-3xl mt-8 text-red-600'>Unexpected Error</Text>
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(900).duration(1000)}>
            <Text className='font-rregular text-lg mt-2 text-center text-gray-700'>
              We're sorry, but Clevery encountered an unexpected issue.
            </Text>
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(1200).duration(1000)} className='w-full'>
            <View className='mt-6 bg-white p-6 rounded-2xl shadow-lg w-full'>
              <Text className='font-rmedium text-xl mb-4 text-gray-800'>What you can do:</Text>
              <HStack className='items-center mb-4'>
                <View className='bg-blue-100 p-2 rounded-full'>
                  <Ionicons name="refresh-circle-outline" size={28} color="#3B82F6" />
                </View>
                <Text className='font-rregular text-base ml-4 text-gray-600'>Try refreshing the page</Text>
              </HStack>
              <HStack className='items-center mb-4'>
                <View className='bg-green-100 p-2 rounded-full'>
                  <Ionicons name="time-outline" size={28} color="#10B981" />
                </View>
                <Text className='font-rregular text-base ml-4 text-gray-600'>Wait a few minutes and try again</Text>
              </HStack>
              <HStack className='items-center'>
                <View className='bg-purple-100 p-2 rounded-full'>
                  <Ionicons name="mail-outline" size={28} color="#8B5CF6" />
                </View>
                <Text className='font-rregular text-base ml-4 text-gray-600'>Contact support if the issue persists</Text>
              </HStack>
            </View>
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(1500).duration(1000)}>
            <Link href="/" className='mt-8'>
              <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className='px-8 py-4 rounded-full'
              >
                <HStack className='items-center'>
                  <Ionicons name="home-outline" size={24} color="white" />
                  <Text className='font-rmedium text-white text-lg ml-2'>Return to Home</Text>
                </HStack>
              </LinearGradient>
            </Link>
          </Animated.View>
        </VStack>
      </LinearGradient>
    </>
  );
}