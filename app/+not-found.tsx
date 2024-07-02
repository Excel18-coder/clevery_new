import { Link, Stack } from 'expo-router';

import { Text, View } from '@/components/Themed';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className='flex-1 items-center justify-center p-5'>
        <Text className='font-rbold text-xl'>Clevery just crashed</Text>

        <Link href="/" className='m-4 py-4'>
          <Text className='font-rregular text-sm text-light'>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
