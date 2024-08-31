import { HStack, Text, View, VStack } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, Stack } from 'expo-router';
import LottieView from 'lottie-react-native';


export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Something went wrong', presentation: "fullScreenModal" }}  />
      <View className='flex-1 bg-gray-50 pb-4'>
        <VStack className='flex-1 justify-center items-center p-6'>
          <LottieView
            source={require('@/assets/animations/empty.json')}
            autoPlay
            loop
            style={{ width: 250, height: 250 }}
          />
          <Text className='font-rbold text-2xl mt-8 text-red-600'>Unexpected Error</Text>
          <Text className='font-rregular text-lg mt-2 text-center text-gray-700'>
            We're sorry, but Clevery encountered an unexpected issue.
          </Text>
          <VStack className='mt-6 bg-white p-4 rounded-lg shadow-md w-full'>
            <Text className='font-rmedium text-base mb-2 text-gray-800'>What you can do:</Text>
            <HStack className='items-center mb-2'>
              <Ionicons name="refresh-circle-outline" size={24} color="#4B5563" />
              <Text className='font-rregular text-sm ml-2 text-gray-600'>Try refreshing the page</Text>
            </HStack>
            <HStack className='items-center mb-2'>
              <Ionicons name="time-outline" size={24} color="#4B5563" />
              <Text className='font-rregular text-sm ml-2 text-gray-600'>Wait a few minutes and try again</Text>
            </HStack>
            <HStack className='items-center'>
              <Ionicons name="mail-outline" size={24} color="#4B5563" onPress={()=>router.navigate('/')}/>
              <Text className='font-rregular text-sm ml-2 text-gray-600'>Contact support if the issue persists</Text>
            </HStack>
          </VStack>
          <Link href="/" className='mt-8'>
            <HStack className='bg-blue-600 px-6 py-3 rounded-full items-center'>
              <Ionicons name="home-outline" size={24} color="white" />
              <Text className='font-rmedium text-white ml-2'>Return to Home</Text>
            </HStack>
          </Link>
        </VStack>
      </View>
    </>
  );
} 
