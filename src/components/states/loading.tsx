import Ionicons  from '@expo/vector-icons/Ionicons';
import { Text, View } from '../themed';
import { Image } from 'expo-image';

const Loader = ({
  loadingText = 'Loading...',
  subText = "We're preparing something amazing for you"
}) => {
  return (
    <View className="flex-1 justify-center items-center shadow-lg ">
      <View className="rounded-2xl shadow-md p-8 items-center max-w-sm w-full">
        <View className="w-36 h-36 mb-6">
          <Image
            source={{uri:'https://cdn.sanity.io/files/mqczcmfz/production/4c9c4e70b75bd3566bcbcdbb67a59fd0cbb46ec9.gif'}}
            style={{
              flex: 1,
              width: '100%',
            }}
            contentFit='cover'
            transition={1000}
          />
        </View>

        <Text className="text-2xl font-bold text-gray-600 text-center mb-2">
          {loadingText}
        </Text> 

        <Text className="text-gray-600 text-center mb-4">
          {subText}
        </Text>

        <View className="flex-row items-center justify-center">
          <Ionicons name="time-outline" size={18} color="#6B7280" />
          <Text className="text-gray-500 ml-2">
            Just a moment...
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Loader;