import { TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Text, View } from '../Themed';

type selected= 'recents'|'people'|'media-links'|'files'
interface SearchTabBarProps {
  onTabPress: (tab: selected) => void;
  selected: selected;
}

const SearchTabBar: React.FC<SearchTabBarProps> = ({ onTabPress, selected }) => {
  const handleTabPress = (tab: selected) => {
    onTabPress(tab);
  };

  return (
    <View className='py-1 px-2 border-b border-gray-500'>
      <View className='flex-row justify-between'>
        <TouchableOpacity
          onPress={() => handleTabPress('recents')}
          className={`items-center ${selected === 'recents'&&'border-b-[3px] border-b-light '}`}
        >
          <Ionicons name="time-outline" size={24} color={selected === 'recents' ? '#007AFF' : '#666'} />
          <Text className={`text-sm mt-1 text-[#666] `}>Recents</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabPress('people')}
          className={`items-center ${selected === 'people'&&'border-b-[3px] border-b-light '}`}
        >
          <Ionicons name="people-outline" size={24} color={selected === 'people' ? '#007AFF' : '#666'} />
          <Text className={`text-sm mt-1 text-[#666]`}>People</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabPress('media-links')}
          className={`items-center ${selected === 'media-links'&&'border-b-[3px] border-b-light '}`}
        >
          <Feather name="link-2" size={24} color={selected === 'media-links' ? '#007AFF' : '#666'} />
          <Text className={`text-sm mt-1 text-[#666]`}>Media Links</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabPress('files')}
          className={`items-center ${selected === 'files'&&'border-b-[3px] border-b-light '}`}
        >
          <Ionicons name="document-outline" size={24} color={selected === 'files' ? '#007AFF' : '#666'} />
          <Text className={`text-sm mt-1 text-[#666]`}>Files</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchTabBar;