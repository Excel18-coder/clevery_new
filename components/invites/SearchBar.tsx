import { TextInput, TouchableOpacity} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { View } from '../Themed';

interface Props {
  onSearchPress: () => void;
}

const SearchBar: React.FC<Props> = ({ onSearchPress }) => {
  return (
    <View className='bg-[#f2f2f2] flex-row items-center px-2 py-1 rounded-[20px]' >
      <TouchableOpacity className='mr-4' onPress={onSearchPress}>
        <Feather name="search" size={24} color="gray" />
      </TouchableOpacity>
      <TextInput
        className='flex-1 text-base font-pregular'
        placeholder="Invite friends"
        placeholderTextColor="gray"
      />
    </View>
  );
};


export default SearchBar;