import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import {
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  VStack,
  HStack,
  Loader,
  Toast,
  ToastTitle,
  useToast,
} from '@/components';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useProfileStore, useUpdateCurrentUser } from '@/lib';
import { router } from 'expo-router';
import { useImageUploader } from '@/lib/uploadthing';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import Error from '@/components/states/error';
import { openSettings } from 'expo-linking';

const AnimatedButton = Animated.createAnimatedComponent(Button);
const AnimatedHStack = Animated.createAnimatedComponent(HStack);
const Custom = Animated.createAnimatedComponent(LinearGradient);

const HOBBIES = [
  'Reading', 'Gaming', 'Cooking', 'Traveling', 'Photography', 'Music',
  'Sports', 'Art', 'Dancing', 'Hiking', 'Yoga', 'Coding'
];

const UserProfileEdit = () => {
  const { profile: userinfo, setProfile: updateProfileLocally } = useProfileStore();
  const [avatarUri, setAvatarUri] = useState(userinfo.image);
  const [bannerUri, setBannerUri] = useState(userinfo.bannerImage);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const theme = useTheme();
  const [profile, setProfile] = useState({
    username: userinfo.username,
    name: userinfo.name,
    bio: userinfo.bio,
    location: userinfo.country,
    hobbies: userinfo.hobbies || [],
  });

  const [connections, setConnections] = useState({
    github: userinfo.connections?.github,
    instagram: userinfo.connections?.instagram,
    x: userinfo.connections?.twitter,
    discord: userinfo.connections?.discord,
    linkedin: userinfo.connections?.linkedin,
  });

  const {
    mutateAsync: updateProfile,
    isPending: updating,
    failureReason,
    error
  } = useUpdateCurrentUser();

  const { openImagePicker, isUploading } = useImageUploader("imageUploader", {
    onUploadError: (error) => Alert.alert("Upload Error", error.message),
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const updatedFields = { ...profile, ...connections };
      if (avatarUri !== userinfo.image) updatedFields.image = avatarUri;
      if (bannerUri !== userinfo.bannerImage) updatedFields.bannerImage = bannerUri;

      console.log(updatedFields)
      const response = await updateProfile(updatedFields);
      updateProfileLocally(response);
      showNewToast();
      router.replace("/profile");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Animations
  const avatarScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const formOpacity = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const socialLinksScale = useSharedValue(1);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerOpacity.value * 50 }],
  }));

  const socialLinksAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: socialLinksScale.value }],
  }));

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    backgroundColor: interpolateColor(
      buttonScale.value,
      [1, 1.1],
      ['#007aff', 'black']
    ),
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formOpacity.value * 50 }],
    padding: formOpacity.value * 5,
  }));

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 1000 });
    avatarScale.value = withSpring(1.1, { damping: 2, stiffness: 80 });
    formOpacity.value = withTiming(1, { duration: 1000 });
    socialLinksScale.value = withSpring(1, { damping: 2, stiffness: 80 });
  }, []);

  const chooseFile = useCallback(async (type) => {
    const file = await openImagePicker({
      source: "library",
      onInsufficientPermissions: () => {
        Alert.alert(
          "No Permissions",
          "You need to grant permission to your Photos to use this",
          [
            { text: "Dismiss" },
            { text: "Open Settings", onPress: async () => await openSettings() },
          ],
        );
      },
    });
    if (file && file[0]?.serverData?.url) {
      if (type === 'avatar') {
        setAvatarUri(file[0].serverData.url);
      } else if (type === 'banner') {
        setBannerUri(file[0].serverData.url);
      }
    }
  }, []);

  const showNewToast = () => {
    const newId = Math.random().toString();
    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action="muted" variant="outline" className="bg-gray-700 p-4">
            <ToastTitle className="text-white">Profile updated</ToastTitle>
          </Toast>
        );
      },
    });
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

  const renderFormField = (key, value, icon) => (
    <FormControl key={key}>
      <FormControlLabel>
        <FormControlLabelText className="font-rbold text-lg text-gray-700">
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </FormControlLabelText>
      </FormControlLabel>
      <Input
        variant="outline"
        className="border-2 border-gray-300 rounded-lg"
        size="xl"
      >
        <InputField
          value={value}
          onChangeText={(text) => handleInputChange(key, text)}
          autoCapitalize="none"
          className="text-gray-800"
          placeholderClassName='text-gray-400 font-rregular text-sm'
          placeholderTextColor={'#7f8c8d'}
        />
        <MaterialIcons name={icon} size={20} color="#7f8c8d" />
      </Input>
    </FormControl>
  );

  const renderSocialLink = (platform, value) => (
    <HStack key={platform} space="sm" className="items-center">
      <Box style={{ width: 30, alignItems: 'center' }}>
        <FontAwesome6 name={platform} size={20} color="#7f8c8d" />
      </Box>
      <Input variant="underlined" className="flex-1">
        <InputField
          value={value}
          onChangeText={(text) => setConnections({ ...connections, [platform]: text })}
          placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} username`}
          className="text-gray-800"
        />
      </Input>
    </HStack>
  );

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  if (isUploading) return <Loader loadingText="Uploading image" />;
  if (updating) return <Loader loadingText="Updating profile" />;
  if (error) return <Error title="Error updating profile" message={failureReason.message} onRetry={handleSubmit} />;

 return (
  <ScrollView className="bg-gray-100 flex-1">
    <VStack space="xl" className="p-2 pt-6">
      <Animated.View style={headerAnimatedStyle}>
        <Text className="text-3xl font-rbold text-gray-800 mb-2">Edit Your Profile</Text>
        <Text className="text-base font-rregular text-gray-600 mb-4">
          Customize your profile to stand out and connect with others in the community.
        </Text>
      </Animated.View>
      
      <AnimatedButton
        onPress={() => router.push('/')}
        isDisabled={isLoading}
        style={[buttonAnimatedStyle, { borderRadius: 10, height: 30, marginTop: 20 }]}
        className="bg-cyan-500 w-[100px] absolute right-2 top-10"
        entering={FadeIn}
        exiting={FadeOut}
      >
        <ButtonText>Cancel</ButtonText>
      </AnimatedButton>

      <Animated.View style={[headerAnimatedStyle, { overflow: 'hidden' }]}>
        
          <Image 
            source={bannerUri ? { uri: bannerUri } : ''} 
            style={{width:'100%', justifyContent:"flex-end", height:250, borderRadius:30, padding:5, marginBottom:5}}
          />
          
        <AnimatedPressable
          onPress={() => chooseFile('bannerImage')}
          style={[{ position: 'absolute', bottom: 10, right: 10 }, avatarAnimatedStyle]}
          className="bg-white p-2 rounded-full mb-4"
        >
          <MaterialIcons name="edit" size={24} color={theme.colors.primary} />
        </AnimatedPressable>
        
      </Animated.View>

      <Animated.View className="bg-gray-100 rounded-xl p-6" style={[avatarAnimatedStyle, { overflow: 'hidden', backgroundColor: '#cdcde0', marginTop: 30 }]}>
        <Pressable onPress={() => chooseFile('avatar')} className="items-start bg-gray-100">
          <Image
            source={{ uri: avatarUri }}
            contentFit='cover'
            style={{marginRight:10, borderRadius: 40, borderWidth: 1, borderColor: 'gray', width: 100, height: 100, overflow: 'hidden', backgroundColor: '#cdcde0' }}
          />
          <Text className="mt-2 text-sm font-rregular text-gray-600">Tap to change profile picture</Text>
        </Pressable>
      </Animated.View>

      <Custom 
        colors={["#f9fafb", "#e5e7eb"]} 
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 0}} 
        style={formAnimatedStyle} 
        className="bg-white rounded-xl shadow-md pl-6 pr-6 pt-4 mb-5"
      >
        <Text className="font-rbold text-xl text-gray-800 mb-2">
          Personal Information
        </Text>
        <Text className="text-base font-rregular text-gray-600 mb-6">
          Update your personal information
        </Text>
        <VStack space="lg">
          {renderFormField('username', profile.username, 'person')}
          {renderFormField('name', profile.name, 'person')}
          {renderFormField('location', profile.location, 'location-on')}
        </VStack>
        <FormControl className="mb-6 mt-4">
          <FormControlLabel>
            <FormControlLabelText className='font-rbold text-lg text-gray-700'>About you</FormControlLabelText>
          </FormControlLabel>
          <Textarea size='xl'>
            <TextareaInput
              multiline
              numberOfLines={4}
              value={profile.bio}
              onChangeText={(text) => handleInputChange('bio', text)}
              placeholderTextColor={'black'}
              placeholder="Share a brief bio..."
              className="border text-gray-800 rounded-lg p-3 text-base border-none"
              textAlignVertical="top"
              style={{ color: theme.colors.text }}
            />
          </Textarea>
        </FormControl>
      </Custom>

      <Animated.View className='bg-white rounded-xl shadow-md p-6 mt-6' entering={FadeIn.delay(300)}>
        <FormControl className="mb-6">
          <FormControlLabel>
            <FormControlLabelText className='font-rbold text-lg text-gray-700'>Select your hobbies</FormControlLabelText>
          </FormControlLabel>
          <Text className="text-base font-rregular text-gray-600 mb-6">Select your hobbies to show them in your profile</Text>
          <View className="flex-row flex-wrap bg-white">
            {HOBBIES.map((hobby) => (
              <Pressable
                key={hobby}
                onPress={() => handleHobbyToggle(hobby)}
                className={`m-1 p-2 rounded-full z-10 shadow-sm ${
                  profile.hobbies.includes(hobby) ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <Text className={`font-rmedium ${
                  profile.hobbies.includes(hobby) ? 'text-white' : 'text-gray-700'
                }`}>
                  {hobby}
                </Text>
              </Pressable>
            ))}
          </View>
        </FormControl>
      </Animated.View>

      <AnimatedHStack style={socialLinksAnimatedStyle} className="bg-white rounded-xl shadow-md p-6 mt-10" entering={FadeIn.delay(600)}>
        <VStack space="md" className="w-full">
          <Text className="font-rbold text-xl text-gray-800 mb-2">
            Social Links
          </Text>
          <Text className="font-rregular text-sm text-gray-600 mb-4">
            Connect your social profiles to showcase your online presence.
          </Text>
          {Object.entries(connections).map(([platform, value]) => renderSocialLink(platform, value))}
        </VStack>
      </AnimatedHStack>

      <AnimatedButton
        onPress={handleSubmit}
        isDisabled={isLoading}
        style={[buttonAnimatedStyle, { borderRadius: 10, height: 50, marginTop: 20 }]}
        className="bg-cyan-500 w-full"
        entering={FadeIn.delay(900)}
        exiting={FadeOut}
      >
        <ButtonText className="text-base font-rbold text-white">
          {isLoading ? "Saving..." : "Save Changes"}
        </ButtonText>
        <FontAwesome6 name="save" size={20} color="white" style={{ marginLeft: 8 }} />
      </AnimatedButton>

      <Text className="text-center text-sm font-rregular text-gray-600 mt-4 mb-8">
        Keeping your profile up-to-date helps you make meaningful connections!
      </Text>
    </VStack>
  </ScrollView>
);
};

export default UserProfileEdit;