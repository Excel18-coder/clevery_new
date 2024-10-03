import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolateColor
} from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const SocialLink = ({ platform, icon, value, onChange }) => {
  const animation = useSharedValue(0);

  const iconContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animation.value,
        [0, 1],
        ['rgb(229, 231, 235)', 'rgb(59, 130, 246)']
      ),
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        animation.value,
        [0, 1],
        ['rgb(75, 85, 99)', 'rgb(255, 255, 255)']
      ),
    };
  });

  return (
    <Pressable
      onPressIn={() => (animation.value = withSpring(1))}
      onPressOut={() => (animation.value = withSpring(0))}
    >
      <Animated.View className="flex-row items-center space-x-3 p-3 rounded-lg">
        <Animated.View className="w-10 h-10 items-center justify-center rounded-full" style={iconContainerStyle}>
          <Animated.View style={iconStyle}>
            <FontAwesome name={icon} size={20} />
          </Animated.View>
        </Animated.View>
        <TextInput
          value={value}
          onChangeText={(text) => onChange(platform, text)}
          placeholder={`${platform} username`}
          className="flex-1 bg-transparent border-b-2 border-gray-300 font-rregular"
        />
      </Animated.View>
    </Pressable>
  );
};

const SocialLinksComponent = () => {
  const [connections, setConnections] = useState({
    github: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    instagram: '',
  });

  const handleChange = (platform, value) => {
    setConnections(prev => ({ ...prev, [platform]: value }));
  };

  const socialPlatforms = [
    { name: 'github', icon: 'github' },
    { name: 'twitter', icon: 'twitter' },
    { name: 'facebook', icon: 'facebook' },
    { name: 'linkedin', icon: 'linkedin' },
    { name: 'instagram', icon: 'instagram' },
  ];

  const buttonAnimation = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonAnimation.value }],
    };
  });

  return (
    <View className="bg-white p-6 rounded-xl shadow-lg mt-6 w-full flex-1">
      <Text className="font-rmedium text-2xl text-gray-800 mb-6 text-center">Social Links</Text>
      <View className="space-y-4">
        {socialPlatforms.map(({ name, icon }) => (
          <SocialLink
            key={name}
            platform={name}
            icon={icon}
            value={connections[name]}
            onChange={handleChange}
          />
        ))}
      </View>
      <Pressable
        onPressIn={() => (buttonAnimation.value = withSpring(0.95))}
        onPressOut={() => (buttonAnimation.value = withSpring(1))}
      >
        <Animated.View 
          className="mt-6 w-full bg-blue-500 py-2 rounded-lg items-center justify-center"
          style={buttonStyle}
        >
          <Text className="text-white font-rmedium">Save Changes</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default SocialLinksComponent;
