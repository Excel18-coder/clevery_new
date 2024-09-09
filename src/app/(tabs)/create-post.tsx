import { useState, useRef, useCallback } from 'react';
import { ScrollView, TextInput, Image, Pressable, Text as RNText, Alert, Linking } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ErrorMessage, Loader, Text, View } from '@/components';
import { router } from 'expo-router';
import { useCreatePost, useUpdatePost } from '@/lib';
import { useImageUploader } from '@/lib/uploadthing';

const CreatePost = () => {
  const theme = useTheme();
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const contentInputRef = useRef(null);

  const { openImagePicker, isUploading } = useImageUploader("imageUploader", {
    onUploadError: (error) => Alert.alert("Upload Error", error.message),
  });
  
  const { 
    mutateAsync: createPost, 
    isPending: creatingPost, 
    isError: createError 
  } = useCreatePost();
  const { 
    mutateAsync: updatePost, 
    isPending: updatingPost, 
    isError: updateError 
  } = useUpdatePost();
  
  
  const handleAddImage = useCallback(async () => {
    const file = await openImagePicker({
      source: "library", // or "camera"
      onInsufficientPermissions: () => {
        Alert.alert(
          "No Permissions",
          "You need to grant permission to your Photos to use this",
          [
            { text: "Dismiss" },
            { text: "Open Settings", onPress: async()=> await Linking.openSettings() },
          ],
        );
      },
    });
    console.log(file);
    setImages([...images, file[0]?.serverData?.url])
  }, []);


  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
      if (currentTag && !tags.includes(currentTag)) {
        setTags([...tags, currentTag]);
        setCurrentTag(''); // Clear the input after adding
      }
    };
  const handleKeyPress = (event) => {
      // Check if the pressed key is a comma
    if (event.nativeEvent.key === ',') {
      event.preventDefault(); // Prevent the default action of adding a comma
      handleAddTag();
    }
  };
  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handlePost = () => {
    // Implement post creation logic here
    console.log({ content, images, tags });
    // Reset form and navigate back
    setContent('');
    setImages([]);
    setTags([]);
    router.navigate('/');
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const buttonScale = useSharedValue(1);
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };
  if(createError || updateError) <ErrorMessage message="Something went wrong. Please try again."/>
  if(isUploading) <Loader loadingText="Uploading your image..."/>
  if(creatingPost || updatingPost) <Loader loadingText="Creating your post..."/>

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Animated.View entering={FadeIn.delay(300)} className="mb-6">
        <Text className="text-3xl font-rbold text-gray-800 mb-2">Create Post</Text>
        <Text className="text-base font-rregular text-gray-600">
          Share your thoughts, images, and more with your Clevery network!
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(400)} className="mb-6">
        <TextInput
          ref={contentInputRef}
          multiline
          numberOfLines={5}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          className="rounded-lg p-4 text-base font-rregular placeholder:text-gray-400 border border-gray-200"
          style={{ textAlignVertical: 'top' }}
        />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(500)} className="mb-6 border-b border-gray-200 p-2 rounded-lg">
        <Text className="text-lg font-rmedium text-gray-800 mb-2">Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((image, index) => (
            <View key={index} className="mr-4 relative">
              <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 10 }} />
              <Pressable 
                onPress={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
              >
                <Feather name="x" size={16} color="white" />
              </Pressable>
            </View>
          ))}
          {images.length < 3 && (
            <Pressable 
              onPress={handleAddImage}
              className="w-24 h-24 bg-gray-500 rounded-lg items-center justify-center"
            >
              <Feather name="plus" size={24} color="#4A90E2" />
            </Pressable>
          )}
        </ScrollView>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(600)} className="mb-6">
        <Text className="text-lg font-rmedium text-gray-800 mb-2">Tags</Text>
        <View className="flex-row flex-wrap mb-2">
          {tags.map((tag, index) => (
            <Animated.View 
              key={index} 
              entering={SlideInRight} 
              exiting={SlideOutLeft}
              className="bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
            >
              <Text className="text-sm font-rmedium text-blue-800 mr-1">#{tag}</Text>
              <Pressable onPress={() => handleRemoveTag(tag)}>
                <Feather name="x" size={16} color="#4A90E2" />
              </Pressable>
            </Animated.View>
          ))}
        </View>
        <View className="flex-row items-center">
          <TextInput
            value={currentTag}
            onChangeText={setCurrentTag}
            onKeyPress={handleKeyPress}
            placeholder="Add a tag"
            className="flex-1 bg-gray-500 rounded-lg p-2 text-base font-rregular text-gray-800 mr-2"
          />
          <Pressable 
            onPress={handleAddTag}
            className="bg-blue-500 rounded-lg p-2"
          >
            <Feather name="plus" size={24} color="white" />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(700)} className="mt-4">
        <AnimatedPressable
          onPress={handlePost}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={buttonAnimatedStyle}
          className="bg-blue-500 rounded-lg py-3 px-6"
        >
          <Text className="text-lg font-rmedium text-white text-center">Post</Text>
        </AnimatedPressable>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(800)} className="mt-6 bg-yellow-100 rounded-lg p-4">
        <RNText className="text-lg font-rmedium mb-2">Posting Tips</RNText>
        <RNText className="text-base font-rregular">
          • Keep your content engaging and positive
          {'\n'}• Use relevant tags to increase visibility
          {'\n'}• High-quality images can make your post stand out
          {'\n'}• Respect others' privacy when posting
        </RNText>
      </Animated.View>
    </ScrollView>
  );
};

export default CreatePost;