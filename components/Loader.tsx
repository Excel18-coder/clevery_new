import { ActivityIndicator } from 'react-native';
import { Text, View } from './Themed';

const Loader = ({ loadingText }:{loadingText:string}) => (
  <View className='flex-1 justify-center items-center'>
    <ActivityIndicator size="large" color="#007aff" />
    <Text className='mt-2.5 text-base font-pregular'>{loadingText}</Text>
  </View>
);

export default Loader;
