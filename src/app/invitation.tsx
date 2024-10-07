import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, Pressable, Dimensions, Image, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { Text, View, FormControl, FormControlLabel, FormControlLabelText } from '@/components';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIcon = Animated.createAnimatedComponent(Feather);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const { width: screenWidth } = Dimensions.get('window');

const features = [
  {
    title: "Connect Globally",
    content: "Meet people from all around the world and build lasting friendships.",
    icon: "globe"
  },
  {
    title: "Share Your Story",
    content: "Express yourself through posts, images, and videos.",
    icon: "camera"
  },
  {
    title: "Discover Trends",
    content: "Stay up-to-date with the latest trends and challenges.",
    icon: "trending-up"
  },
  {
    title: "Secure Messaging",
    content: "Chat privately with friends using end-to-end encryption.",
    icon: "lock"
  }
];

const Welcome = () => {
  const theme = useTheme();
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    profileImage: null,
  });

  const scrollY = useSharedValue(0);
  const featureAnimations = features.map(() => useSharedValue(0));

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0]);
    const translateY = interpolate(scrollY.value, [0, 100], [0, -50]);
    return { opacity, transform: [{ translateY }] };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile(prev => ({ ...prev, profileImage: result.assets[0].uri }));
    }
  };

  const FeatureItem = ({ title, content, icon, index }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        featureAnimations[index].value,
        [0, 1],
        [50, 0]
      );
      const opacity = interpolate(
        featureAnimations[index].value,
        [0, 1],
        [0, 1]
      );
      return { opacity, transform: [{ translateY }] };
    });

    useEffect(() => {
      featureAnimations[index].value = withSpring(1, { stiffness: 100, damping: 10 });
    }, []);

    return (
      <Animated.View style={animatedStyle} className="mb-6 bg-white rounded-lg shadow-md p-4">
        <View className="flex-row items-center mb-2">
          <AnimatedIcon name={icon} size={24} color={theme.colors.primary} className="mr-3" />
          <Text className="text-lg font-rmedium">{title}</Text>
        </View>
        <Text className="text-base font-rregular text-gray-600">{content}</Text>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <Animated.View style={headerAnimatedStyle} className="absolute top-0 left-0 right-0 z-10">
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={{ padding: 20, paddingTop: 40 }}
        >
          <Text className="text-4xl font-rbold text-white">Welcome to Clevery</Text>
          <Text className="text-xl font-rmedium text-white">Your social playground awaits!</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingTop: 120, paddingBottom: 40 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View className="px-4">
          <Animated.View entering={FadeIn.delay(400).duration(500)} className="mb-8">
            <Text className="text-lg font-rmedium mb-2">Dive into a World of Connections</Text>
            <Text className="text-base font-rregular text-gray-600">
              Express yourself, compete in fun challenges, and forge meaningful connections. Get ready to explore, create, and connect like never before!
            </Text>
          </Animated.View>

          <Text className="text-2xl font-rbold mb-4">Key Features</Text>
          {features.map((feature, index) => (
            <FeatureItem key={index} {...feature} index={index} />
          ))}

          <Animated.View entering={FadeInUp.delay(800).duration(500)} className="mt-8">
            <Text className="text-2xl font-rbold mb-4">Create Your Profile</Text>
            
            <TouchableOpacity onPress={pickImage} className="mb-6 items-center">
              {profile.profileImage ? (
                <Image source={{ uri: profile.profileImage }} className="w-32 h-32 rounded-full" />
              ) : (
                <AnimatedIcon
                  name="user-plus"
                  size={64}
                  color={theme.colors.primary}
                />
              )}
              <Text className="mt-2 text-base font-rmedium text-blue-500">
                {profile.profileImage ? 'Change Profile Picture' : 'Add Profile Picture'}
              </Text>
            </TouchableOpacity>

            <FormControl className="mb-4">
              <FormControlLabel>
                <FormControlLabelText>What's your name?</FormControlLabelText>
              </FormControlLabel>
              <AnimatedTextInput
                value={profile.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter your name"
                className="border border-gray-300 rounded-lg p-3 text-base"
                style={{ color: theme.colors.text }}
              />
            </FormControl>

            <FormControl className="mb-4">
              <FormControlLabel>
                <FormControlLabelText>Choose a username</FormControlLabelText>
              </FormControlLabel>
              <AnimatedTextInput
                value={profile.username}
                onChangeText={(text) => handleInputChange('username', text)}
                placeholder="Enter a unique username"
                className="border border-gray-300 rounded-lg p-3 text-base"
                style={{ color: theme.colors.text }}
              />
            </FormControl>

            <FormControl className="mb-6">
              <FormControlLabel>
                <FormControlLabelText>Tell us about yourself</FormControlLabelText>
              </FormControlLabel>
              <AnimatedTextInput
                multiline
                numberOfLines={4}
                value={profile.bio}
                onChangeText={(text) => handleInputChange('bio', text)}
                placeholder="Share a brief bio..."
                className="border border-gray-300 rounded-lg p-3 text-base"
                textAlignVertical="top"
                style={{ color: theme.colors.text }}
              />
            </FormControl>
            
            <TouchableOpacity
              onPress={() => {
                console.log('Profile created:', profile);
                // Here you would typically send the profile data to your backend
                // and then navigate to the main app screen
                router.push('/main-app');
              }}
              className="bg-blue-500 rounded-lg p-4 items-center"
            >
              <Text className="text-white text-lg font-rbold text-center">Start My Clevery Journey</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default Welcome;