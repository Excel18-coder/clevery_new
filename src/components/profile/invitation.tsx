import { useState } from 'react';
import { ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorText,
  View,
  Text,
} from '@/components';

const AnimatedIcon = Animated.createAnimatedComponent(Feather);
const Custom = Animated.createAnimatedComponent(View);
const CustomText = Animated.createAnimatedComponent(Text);

const WelcomePage = () => {
  const theme = useTheme();
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    hobbies: [],
    profileColor: theme.colors.primary,
    profileImage: null,
    socialMedia: {
      twitter: '',
      instagram: '',
      linkedin: '',
    },
  });

  const welcomeScale = useSharedValue(1);
  const iconRotation = useSharedValue(0);

  const animatedWelcomeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: welcomeScale.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setProfile(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }));
  };

  const handleHobbyToggle = (hobby) => {
    setProfile(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby],
    }));
    welcomeScale.value = withSpring(1.05, {}, () => {
      welcomeScale.value = withSpring(1);
    });
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

  const hobbies = [
    'Reading', 'Gaming', 'Cooking', 'Traveling', 'Photography', 'Music',
    'Sports', 'Art', 'Dancing', 'Hiking', 'Yoga', 'Coding'
  ];

  return (
    <ScrollView 
      className="flex-1" 
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Custom entering={FadeInDown.delay(300)} style={animatedWelcomeStyle}>
        <Text className="text-4xl font-rbold mb-2 text-center">Welcome!</Text>
        <CustomText className="text-xl font-rmedium mb-6 text-center">Let's create your amazing profile</CustomText>
      </Custom>

      <Custom entering={FadeIn.delay(600)} className="rounded-lg p-4 mb-6">
        <CustomText className="text-lg font-rmedium mb-2">Why personalize your profile?</CustomText>
        <CustomText className="text-base font-rregular">
          Your unique profile helps us tailor your experience and connect you with like-minded individuals. Have fun customizing - it's all about expressing yourself!
        </CustomText>
      </Custom>

      <Custom entering={FadeInUp.delay(900)}>
        <TouchableOpacity onPress={pickImage} className="mb-6 items-center">
          {profile.profileImage ? (
            <Image source={{ uri: profile.profileImage }} className="w-32 h-32 rounded-full" />
          ) : (
            <AnimatedIcon
              name="user-plus"
              size={64}
              color={theme.colors.primary}
              style={animatedIconStyle}
            />
          )}
          <CustomText className="mt-2 text-base font-rmedium text-blue-500">
            {profile.profileImage ? 'Change Profile Picture' : 'Add Profile Picture'}
          </CustomText>
        </TouchableOpacity>

        <FormControl className="mb-4">
          <FormControlLabel>
            <FormControlLabelText>What's your name?</FormControlLabelText>
          </FormControlLabel>
          <TextInput
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
          <TextInput
            value={profile.username}
            onChangeText={(text) => handleInputChange('username', text)}
            placeholder="Enter a unique username"
            className="border border-gray-300 rounded-lg p-3 text-base"
            style={{ color: theme.colors.text }}
          />
        </FormControl>

        <FormControl className="mb-4">
          <FormControlLabel>
            <FormControlLabelText>Where are you located?</FormControlLabelText>
          </FormControlLabel>
          <TextInput
            value={profile.location}
            onChangeText={(text) => handleInputChange('location', text)}
            placeholder="Enter your location"
            className="border border-gray-300 rounded-lg p-3 text-base"
            style={{ color: theme.colors.text }}
          />
        </FormControl>

        <FormControl className="mb-6">
          <FormControlLabel>
            <FormControlLabelText>Select your hobbies</FormControlLabelText>
          </FormControlLabel>
          <FormControlHelper>
            <FormControlHelperText>Choose as many as you like!</FormControlHelperText>
          </FormControlHelper>
          <View className="flex-row flex-wrap">
            {hobbies.map((hobby) => (
              <TouchableOpacity
                key={hobby}
                onPress={() => handleHobbyToggle(hobby)}
                className={`m-1 p-2 rounded-full ${
                  profile.hobbies.includes(hobby) ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <CustomText className={`font-rmedium ${
                  profile.hobbies.includes(hobby) ? '' : 'text-gray-700'
                }`}>
                  {hobby}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </FormControl>

        <FormControl className="mb-6">
          <FormControlLabel>
            <FormControlLabelText>Tell us about yourself</FormControlLabelText>
          </FormControlLabel>
          <TextInput
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

        <FormControl className="mb-6">
          <FormControlLabel>
            <FormControlLabelText>Connect your social media</FormControlLabelText>
          </FormControlLabel>
          <View className="space-y-2">
            {Object.entries(profile.socialMedia).map(([platform, value]) => (
              <View key={platform} className="flex-row items-center">
                <AnimatedIcon name={platform as any} size={24} color={theme.colors.primary} className="mr-2" />
                <TextInput
                  value={value}
                  onChangeText={(text) => handleSocialMediaChange(platform, text)}
                  placeholder={`Your ${platform} username`}
                  className="flex-1 border border-gray-300 rounded-lg p-2 text-base"
                  style={{ color: theme.colors.text }}
                />
              </View>
            ))}
          </View>
        </FormControl>
        
        <TouchableOpacity
          onPress={() => {
            console.log('Profile created:', profile);
            iconRotation.value = withSpring(iconRotation.value + 360);
          }}
          className="bg-blue-500 rounded-lg p-4 items-center"
        >
          <CustomText className="text-white text-lg font-rbold text-center">Create My Awesome Profile</CustomText>
        </TouchableOpacity>
      </Custom>
    </ScrollView>
  );
};

export default WelcomePage;