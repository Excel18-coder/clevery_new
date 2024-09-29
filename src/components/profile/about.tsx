import React, { useState, useCallback } from 'react';
import { Pressable, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Text, View } from '@/components';
import { LinearGradient } from 'expo-linear-gradient';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FAQItem = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);
  const rotateValue = useSharedValue(0);
  const heightValue = useSharedValue(0);

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
    rotateValue.value = withSpring(expanded ? 0 : 1, { damping: 10, stiffness: 100 });
    heightValue.value = withTiming(expanded ? 0 : 1, { duration: 300 });
  }, [expanded]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value * 180}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    height: interpolate(heightValue.value, [0, 1], [0, 200]),
    opacity: heightValue.value,
  }));

  return (
    <Animated.View 
      entering={SlideInRight.springify().damping(15)} 
      className="mb-4 rounded-2xl shadow-lg overflow-hidden bg-white"
    >
      <Pressable onPress={toggleExpand} className="flex-row items-center justify-between p-5">
        <Text className="text-lg font-rmedium text-gray-800 flex-1 mr-2">{question}</Text>
        <Animated.View style={iconStyle}>
          <Feather name="chevron-down" size={24} color="#6366F1" />
        </Animated.View>
      </Pressable>
      <Animated.View style={contentStyle} className="overflow-hidden">
        <View className="p-5 bg-indigo-50">
          <Text className="text-base font-rregular text-gray-600">{answer}</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const ContactButton = ({ icon, title, subtitle, onPress, color }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="flex-row items-center rounded-2xl shadow-md p-4 mb-4"
        style={{ backgroundColor: color }}
      >
        <Animated.View className="bg-opacity-30 rounded-full p-3 mr-4">
          <Feather name={icon} size={24} color="white" />
        </Animated.View>
        <Animated.View className="flex-1">
          <Text className="text-lg font-rmedium text-white">{title}</Text>
          <Text className="text-sm font-rregular text-white opacity-80">{subtitle}</Text>
        </Animated.View>
        <Feather name="chevron-right" size={24} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const HelpSupportPage = () => {
  const theme = useTheme();
  const scrollY = useSharedValue(0);
  const searchFocus = useSharedValue(0);
  const Custom = Animated.createAnimatedComponent(LinearGradient);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(scrollY.value, [0, 100], [250, 150], Extrapolation.CLAMP),
    opacity: interpolate(scrollY.value, [0, 100], [1, 0.8], Extrapolation.CLAMP),
  }));

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    width: interpolate(searchFocus.value, [0, 1], [SCREEN_WIDTH - 40, SCREEN_WIDTH - 80], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(searchFocus.value, [0, 1], [1, 1.05], Extrapolation.CLAMP) }],
  }));

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "To reset your password, go to the login screen and tap on 'Forgot Password'. Follow the instructions sent to your email to create a new password."
    },
    {
      question: "Can I change my username?",
      answer: "Yes, you can change your username once every 30 days. Go to Settings > Account > Username to make the change."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "To report content, tap the three dots (...) next to the post or comment and select 'Report'. Choose the reason for reporting and submit."
    },
    // Add more FAQ items as needed
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Custom 
        colors={['#67e8f9', '#155e75']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          { 
            justifyContent: 'flex-end', 
            padding: 20,
          },
          headerAnimatedStyle
        ]}
      >
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <Text className="text-5xl font-rbold text-white mb-2">Help & Support</Text>
        <Text className="text-xl font-rregular text-white opacity-80">
          We're here to assist you
        </Text>
      </Custom>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 20, paddingTop: 10 }}
      >
        <Animated.View entering={FadeIn.delay(200).duration(1000)} style={searchAnimatedStyle} className="mb-6">
          <View className="flex-row items-center bg-white rounded-full shadow-lg p-3">
            <Feather name="search" size={24} color="#6366F1" className="mr-2" />
            <TextInput 
              placeholder="Search for help..."
              className="flex-1 text-base font-rregular text-gray-700"
              onFocus={() => { searchFocus.value = withTiming(1); }}
              onBlur={() => { searchFocus.value = withTiming(0); }}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(300).duration(1000)} className="mb-8">
          <Text className="text-3xl font-rbold text-gray-800 mb-4">Contact Us</Text>
          <ContactButton 
            icon="mail" 
            title="Email Support" 
            subtitle="Get help via email"
            onPress={() => {/* Handle email support */}}
            color="#FF6B6B"
          />
          <ContactButton 
            icon="message-circle" 
            title="Live Chat" 
            subtitle="Chat with a support agent"
            onPress={() => {/* Handle live chat */}}
            color="#4ECDC4"
          />
          <ContactButton 
            icon="phone" 
            title="Phone Support" 
            subtitle="Call us for immediate help"
            onPress={() => {/* Handle phone support */}}
            color="#45B7D1"
          />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(400).duration(1000)}>
          <Text className="text-3xl font-rbold text-gray-800 mb-4">FAQs</Text>
          {faqItems.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </Animated.View>

        <Animated.View entering={FadeIn.delay(500).duration(1000)} className="mt-8 rounded-2xl overflow-hidden">
          <LinearGradient
            colors={['#6EE7B7', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6"
          >
            <Animated.View className="flex-row items-center mb-4">
              <Text className="text-2xl font-rbold text-white ml-4">Still need help?</Text>
            </Animated.View>
            <Text className="text-base font-rregular text-white opacity-90">
              If you couldn't find the answer you were looking for, please don't hesitate to contact our support team. We're always here to help!
            </Text>
            <Pressable className="bg-white mt-4 py-3 px-6 rounded-full self-start">
              <Text className="text-base font-rmedium text-blue-600">Contact Us</Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

export default HelpSupportPage;