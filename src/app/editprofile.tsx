import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Pressable, ScrollView, Text, View, TextInput } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';
import { Box, Button, VStack, HStack, Loader, Toast, ToastTitle, useToast } from '@/components';
import { useProfileStore, useUpdateCurrentUser } from '@/lib';
import { useImageUploader } from '@/lib/uploadthing';
import { Image } from 'expo-image';
import { useTheme } from '@react-navigation/native';
import SocialLinksComponent from '@/components/shared/social_links';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { openSettings } from 'expo-linking';

const HOBBIES = ['Reading', 'Gaming', 'Cooking', 'Traveling', 'Photography', 'Music', 'Sports', 'Art', 'Dancing', 'Hiking', 'Yoga', 'Coding'];

const UserProfileEdit = () => {
  const { profile: userinfo, setProfile: updateProfileLocally } = useProfileStore();
  const [profile, setProfile] = useState({ username: userinfo.username, name: userinfo.name, bio: userinfo.bio, location: userinfo.country, hobbies: userinfo.hobbies || [] });
  const [avatarUri, setAvatarUri] = useState(userinfo.image);
  const [bannerUri, setBannerUri] = useState(userinfo.bannerImage);
  const { mutateAsync: updateProfile, isPending: updating, failureReason } = useUpdateCurrentUser();
  const { openImagePicker, isUploading } = useImageUploader('imageUploader', { onUploadError: error => Alert.alert('Upload Error', error.message) });
  const toast = useToast();
  const avatarScale = useSharedValue(1);

  const handleSubmit = async () => {
    const updatedFields = { ...profile, image: avatarUri, bannerImage: bannerUri };
    try {
      const response = await updateProfile(updatedFields);
      updateProfileLocally(response);
      toast.show({ placement: 'top', render: () => <Toast><ToastTitle>Profile updated</ToastTitle></Toast> });
    } catch (error) {
      console.error(error);
    }
  };

  
  const handleHobbyToggle = (hobby) => {
    setProfile(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby],
    }));
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const chooseFile = useCallback(async (type) => {
    const file = await openImagePicker({
      source: 'library',
      onInsufficientPermissions: () =>
        Alert.alert('No Permissions', 'You need to grant permission to your Photos to use this', [
          { text: 'Dismiss' },
          { text: 'Open Settings', onPress: async () => openSettings() },
        ]),
    });
    file && setAvatarUri(file[0]?.serverData?.url);
  }, []);

  useEffect(() => {
    avatarScale.value = withSpring(1.1);
  }, []);

  const FormField = ({ label, value, onChangeText, iconName, placeholder }) => {
  const animation = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animation.value,
      [0, 1],
      ['rgb(255, 255, 255)', 'rgb(243, 244, 246)']
    ),
    borderColor: interpolateColor(
      animation.value,
      [0, 1],
      ['rgb(209, 213, 219)', 'rgb(59, 130, 246)']
    ),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      animation.value,
      [0, 1],
      ['rgb(107, 114, 128)', 'rgb(59, 130, 246)']
    ),
  }));

  return (
    <Pressable onPressIn={() => (animation.value = withSpring(1))} onPressOut={() => (animation.value = withSpring(0))}>
      <Text className="font-rmedium text-lg text-gray-700 mb-2">{label}</Text>
      <Animated.View className="flex-row items-center border-2 rounded-lg p-2 mb-4" style={containerStyle}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          className="flex-1 font-rregular text-gray-800"
          placeholderTextColor="#a0aec0"
        />
        <Animated.View style={iconStyle}>
          <FontAwesome name={iconName} size={20} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

  const PersonalDetails = ({ profile, handleChange }) => {
  return (
    <View className="bg-white p-6 rounded-xl shadow-lg mb-6">
      <Text className="font-rbold text-2xl text-gray-800 mb-6">Personal Information</Text>
      <FormField 
        label="Username" 
        value={profile.username} 
        onChangeText={(text) => handleChange('username', text)} 
        iconName="user" 
        placeholder="Enter your username"
      />
      <FormField 
        label="Name" 
        value={profile.name} 
        onChangeText={(text) => handleChange('name', text)} 
        iconName="user" 
        placeholder="Enter your full name"
      />
      <FormField 
        label="Location" 
        value={profile.location} 
        onChangeText={(text) => handleChange('location', text)} 
        iconName="map-marker" 
        placeholder="Enter your location"
      />
    </View>
  );
};

  const renderHobbies = () => (
    <VStack className="bg-white p-6 rounded-xl shadow-md mt-6">
      <Text className="font-rmedium text-lg text-gray-800 mb-4">Select your hobbies</Text>
      <View className="flex-row flex-wrap">
        {HOBBIES.map((hobby) => (
          <Pressable key={hobby} onPress={handleHobbyToggle} className={`m-1 p-2 rounded-full ${profile.hobbies.includes(hobby) ? 'bg-blue-500' : 'bg-gray-300'}`}>
            <Text className={`font-rregular text-sm ${profile.hobbies.includes(hobby) ? 'text-white' : 'text-gray-700'}`}>{hobby}</Text>
          </Pressable>
        ))}
      </View>
    </VStack>
  );

  return isUploading || updating ? (
    <Loader loadingText={isUploading ? 'Uploading image' : 'Updating profile'} />
  ) : failureReason ? (
    <Text>{failureReason.message}</Text>
  ) : (
    <ScrollView className="bg-gray-100 flex-1 mt-5 p-2">
      <VStack space="xl">
        <Text className="font-rbold text-3xl text-gray-800 mb-2">Edit Your Profile</Text>
        <Pressable onPress={() => chooseFile('bannerImage')} className="p-2 rounded-full mb-4">
          <Image source={{ uri: bannerUri }} style={{ width: '100%', height: 200, borderRadius: 20 }} />
        </Pressable>
        <Pressable onPress={() => chooseFile('avatar')} className="items-start bg-gray-100">
          <Image source={{ uri: avatarUri }} style={{ width: 100, height: 100, borderRadius: 50, borderColor: 'gray', borderWidth: 1 }} />
          <Text className="font-rregular mt-2 text-sm text-gray-600">Tap to change profile picture</Text>
        </Pressable>

        <PersonalDetails profile={profile} handleChange={handleInputChange}/>

        {renderHobbies()}

        <SocialLinksComponent />

        <Animated.View  className="bg-cyan-500 rounded-full mt-6">
          <Pressable onPress={handleSubmit} className="w-full py-4 flex-row justify-center items-center">
            <Text className="font-rbold text-white text-lg">{updating ? 'Saving...' : 'Save Changes'}</Text>
            <FontAwesome6 name="save" size={20} color="white" className="ml-2" />
          </Pressable>
        </Animated.View>
      </VStack>
    </ScrollView>
  );
};

export default UserProfileEdit;
