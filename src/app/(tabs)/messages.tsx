import { memo, useCallback, useState, useRef } from 'react';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Animated, ScrollView } from 'react-native';
import { router } from 'expo-router';

import { Chat, Groups, ServerList, Text, View } from '@/components';

interface FilterItem {
  name: string;
  icon: string;
}

const FILTER_ITEMS: FilterItem[] = [
  { name: "chats", icon: 'message-square' },
  { name: "status", icon: 'users' },
  { name: "servers", icon: 'server' },
];

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / FILTER_ITEMS.length;

const Messages: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('chats');
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const getFilterName = useCallback((filter: string): string => {
    switch (filter) {
      case 'chats': return 'Threads';
      case 'status': return 'Servers';
      case 'servers': return 'Communities';
      default: return '';
    }
  }, []);

  const handlePress = useCallback((): void => {
    if (activeFilter === 'chats') router.navigate("/users");
    else if (activeFilter === 'status') {/* voiceCallHandler(); */ }
    else if (activeFilter === 'servers') router.navigate("/create-server");
  }, [activeFilter]);

  const AddButton: React.FC = memo(() => (
    <TouchableOpacity
      className='flex-row border border-gray-500 rounded-full p-2 ml-auto gap-1.5'
      onPress={handlePress}
    >
      <Feather name="plus" size={20} color='gray' />
      <Text className='text-right font-rmedium font-sm'>
        {activeFilter === 'chats' ? 'Add Friend' : activeFilter === 'servers' ? 'Create Server' : 'Create Group'}
      </Text>
    </TouchableOpacity>
  ));

  const FilterIcon: React.FC<{ item: FilterItem, index: number }> = memo(({ item, index }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [1, 1.2, 1],
      extrapolate: 'clamp',
    });
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    const handlePress = () => {
      setActiveFilter(item.name);
      scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    };

    return (
      <TouchableOpacity
        className='flex-1 items-center justify-center py-2'
        onPress={handlePress}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Feather name={item.icon as any} size={24} color="#007aff" style={{ opacity }} />
        </Animated.View>
      </TouchableOpacity>
    );
  });

  const Filter: React.FC = memo(() => (
    <View className='px-4 pt-4 pb-2'>
      <View className='flex-row justify-between mb-4 items-center'>
        <Text className='font-rmedium text-2xl text-light'>
          {getFilterName(activeFilter)}
        </Text>
        <AddButton />
      </View>

      <View className='flex-row justify-around items-center'>
        {FILTER_ITEMS.map((item, index) => (
          <FilterIcon key={item.name} item={item} index={index} />
        ))}
      </View>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: ITEM_WIDTH,
          height: 3,
          backgroundColor: '#007aff',
          transform: [{
            translateX: scrollX.interpolate({
              inputRange: FILTER_ITEMS.map((_, i) => i * width),
              outputRange: FILTER_ITEMS.map((_, i) => i * ITEM_WIDTH),
              extrapolate: 'clamp',
            }),
          }],
        }}
      />
    </View>
  ));

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveFilter(FILTER_ITEMS[index].name);
  }, []);

  return (
    <View className='flex-1 mt-7.5'>
      <Filter />
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {FILTER_ITEMS.map((item, index) => (
          <View key={item.name} style={{ width }}>
            {item.name === 'chats' && <Chat />}
            {item.name === 'status' && <Groups />}
            {item.name === 'servers' && <ServerList />}
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default memo(Messages);