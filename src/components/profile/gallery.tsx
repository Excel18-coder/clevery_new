import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Dimensions, RefreshControl, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInRight,
  useAnimatedScrollHandler,
  useAnimatedProps,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { MasonryFlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GalleryImage {
  id: string;
  uri: string;
  width: number;
  height: number;
  likes: number;
  caption: string;
}

interface GalleryProps {
  images: GalleryImage[];
  onAddImages: () => void;
}

const mockImages: GalleryImage[] = [
  { id: '1', uri: 'https://picsum.photos/id/1018/800/600', width: 800, height: 600, likes: 123, caption: "Mountain view" },
  { id: '2', uri: 'https://picsum.photos/id/1015/800/1200', width: 800, height: 1200, likes: 456, caption: "Forest landscape" },
  { id: '3', uri: 'https://picsum.photos/id/1019/800/800', width: 800, height: 800, likes: 789, caption: "Foggy morning" },
  { id: '4', uri: 'https://picsum.photos/id/1021/800/600', width: 800, height: 600, likes: 234, caption: "Sunset at the lake" },
  { id: '5', uri: 'https://picsum.photos/id/1023/800/1000', width: 800, height: 1000, likes: 567, caption: "Bear in the wild" },
  { id: '6', uri: 'https://picsum.photos/id/1024/800/600', width: 800, height: 600, likes: 890, caption: "Waterfall in the forest" },
  { id: '7', uri: 'https://picsum.photos/id/1025/800/800', width: 800, height: 800, likes: 321, caption: "Cute puppy" },
  { id: '8', uri: 'https://picsum.photos/id/1028/800/1200', width: 800, height: 1200, likes: 654, caption: "Mountain road" },
  { id: '9', uri: 'https://picsum.photos/id/1029/800/600', width: 800, height: 600, likes: 987, caption: "Misty forest" },
  { id: '10', uri: 'https://picsum.photos/id/1031/800/1000', width: 800, height: 1000, likes: 432, caption: "Lighthouse at dusk" },
];

const AnimatedBlurView = Animated.createAnimatedComponent(View);

const GalleryPage: React.FC<GalleryProps> = ({ images = mockImages, onAddImages }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withSpring(1, { damping: 20, stiffness: 90 });
    scale.value = withSpring(1, { damping: 20, stiffness: 90 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - (scrollY.value / 100),
      transform: [{ translateY: -scrollY.value / 2 }],
    };
  });

  const blurAnimatedProps = useAnimatedProps(() => {
    return {
      intensity: Math.min(scrollY.value / 100 * 100, 100),
    };
  });

  const renderItem = ({ item, index }: { item: GalleryImage; index: number }) => {
    const imageWidth = SCREEN_WIDTH / 2 - 12;
    const aspectRatio = item.width / item.height;
    const imageHeight = imageWidth / aspectRatio;

    return (
      <Animated.View
        entering={SlideInRight.delay(index * 100).springify()}
        className="p-2"
        style={{ height: imageHeight }}
      >
        <Pressable onPress={() => setSelectedImage(item)} >
          <Image
            source={{ uri: item.uri }}
            style={{ aspectRatio, borderRadius: 12}}
            className="w-full h-full"
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            className="absolute bottom-0 left-0 right-0 h-16 rounded-b-xl"
          />
          <View className="absolute bottom-2 left-2 right-2 flex-row justify-between items-center">
            <Text className="font-rmedium text-white text-sm">{item.caption}</Text>
            <View className="flex-row items-center">
              <Feather name="heart" size={16} color="#fff" />
              <Text className="font-rregular text-white text-sm ml-1">{item.likes}</Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const EmptyGallery = () => (
    <View className="flex-1 justify-center items-center p-5">
      <Animated.View
        entering={FadeIn.delay(300).duration(500)}
        className="items-center"
      >
        <Feather name="image" size={64} color="#a3a3a3" />
        <Text className="font-rbold text-2xl text-gray-800 mt-4 mb-2">Your gallery is empty</Text>
        <Text className="font-rregular text-base text-gray-600 text-center mb-6">
          Add some amazing photos to showcase your life and experiences!
        </Text>
        <Pressable
          onPress={onAddImages}
          className="flex-row items-center bg-blue-500 px-6 py-3 rounded-full"
        >
          <Feather name="plus" size={24} color="#ffffff" />
          <Text className="font-rmedium text-base text-white ml-2">Add Images</Text>
        </Pressable>
      </Animated.View>
    </View>
  );

  const ImageDetailModal = ({ image }: { image: GalleryImage }) => (
    <Animated.View 
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-80 z-50"
    >
      <View style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center p-4">
          <Image
            source={{ uri: image.uri }}
            style={{ width: SCREEN_WIDTH - 40, height: (SCREEN_WIDTH - 40) * (image.height / image.width), borderRadius: 20 }}
            contentFit="cover"
          />
          <View className="mt-4 w-full">
            <Text className="font-rbold text-white text-xl mb-2">{image.caption}</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Feather name="heart" size={20} color="#fff" />
                <Text className="font-rmedium text-white text-lg ml-2">{image.likes} likes</Text>
              </View>
              <Pressable className="bg-blue-500 px-4 py-2 rounded-full">
                <Text className="font-rmedium text-white">Share</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <Pressable
          onPress={() => setSelectedImage(null)}
          className="absolute top-10 right-5 bg-white bg-opacity-20 p-2 rounded-full"
        >
          <Feather name="x" size={24} color="#fff" />
        </Pressable>
      </View>
    </Animated.View>
  );

  const memoizedImages = useMemo(() => images, [images]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <Animated.View className="flex-1 bg-gray-100" style={animatedStyle}>
      {memoizedImages.length > 0 ? (
        <>
          <AnimatedBlurView
            animatedProps={blurAnimatedProps}
            className="absolute top-0 left-0 right-0 h-40 z-10"
          />
          <Animated.View style={[headerAnimatedStyle, { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20 }]}>
            <Text className="font-rbold text-4xl text-white">My Gallery</Text>
            <Text className="font-rregular text-lg text-white mt-2">Cherish your moments</Text>
          </Animated.View>
          <MasonryFlashList
            data={memoizedImages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            onScroll={scrollHandler}
            contentContainerStyle={{ paddingTop: 120, paddingHorizontal: 4, paddingBottom: 80 }}
            estimatedItemSize={200}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
            }
          />
          <Pressable
            onPress={onAddImages}
            className="absolute bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg"
          >
            <Feather name="plus" size={24} color="#ffffff" />
          </Pressable>
        </>
      ) : (
        <EmptyGallery />
      )}
      {selectedImage && <ImageDetailModal image={selectedImage} />}
    </Animated.View>
  );
};

export default GalleryPage;