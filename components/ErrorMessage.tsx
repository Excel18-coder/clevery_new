import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { View } from './Themed';

interface Props {
  message:string;
  onRetry?:()=>{}
}
const ErrorMessage = ({ message = 'An error occurred', onRetry}:Props) => (
  <View className="flex-1 justify-center items-center bg-gray-100">
    <View className="bg-white w-5/6 rounded-3xl p-8 shadow-lg">
      <View className="items-center">
        <LottieView
          source={require('../assets/animations/loading.json')}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
      </View>
      <Text className="text-2xl font-bold text-red-600 mt-4 text-center">
        Oops!
      </Text>
      <Text className="text-lg text-gray-700 mt-2 text-center">
        {message}
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        className="bg-blue-500 rounded-full py-3 px-6 mt-6 flex-row items-center justify-center"
      >
        <Ionicons name="reload" size={24} color="white" />
        <Text className="text-white font-semibold ml-2">Try Again</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default ErrorMessage;