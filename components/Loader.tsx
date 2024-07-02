import { ActivityIndicator } from 'react-native';
import { Text, View } from './Themed';
import { Spinner } from 'native-base';

const Loader = ({ loadingText }:{loadingText:string}) => (
  <View className='flex-1 justify-center items-center'>
    <Spinner size="lg" />
    {/* <ActivityIndicator size="large" color="#007aff" /> */}
    <Text className='mt-2.5 text-base font-rregular'>{loadingText}</Text>
  </View>
);

export default Loader;
