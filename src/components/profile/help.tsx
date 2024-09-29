import React from 'react';
import { Dimensions, ScrollView, ImageBackground, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  SlideInUp, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
  withTiming,
  withRepeat
} from 'react-native-reanimated';
import { View, Text } from '@/components';
import { Path, Svg } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Enhanced Hero Section
const HeroSection = () => {
  const theme = useTheme();

  return (
    <ImageBackground 
      source={{ uri: 'https://example.com/social-media-background.jpg' }} 
      style={{ height: SCREEN_HEIGHT * 0.6, justifyContent: 'flex-end' }} 
      resizeMode="cover"
    >
      <LinearGradient 
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={{ paddingHorizontal: 20, paddingVertical: 50 }}
      >
        <Animated.View entering={FadeIn.duration(1500)}>
          <Text className="text-6xl font-rbold text-white">Connecto</Text>
          <Text className="text-2xl font-rregular text-white mt-4 opacity-90">
            Connect, Share, Thrive.
          </Text>
          <AnimatedButton title="Join Now" onPress={() => {}} />
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
};

// Animated Button Component
const AnimatedButton = ({ title, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <LinearGradient
        colors={['#FF6B6B', '#FF8E53']}
        className="rounded-full px-8 py-4 mt-8"
      >
        <Text className="text-white text-lg font-rbold text-center">{title}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
};

// Enhanced Mission Section
const MissionSection = () => {
  const values = [
    'Connect with Purpose',
    'Seamless Communication',
    'Creative Expression',
    'Privacy First',
    'Engage and Grow'
  ];

  return (
    <Animated.View entering={SlideInUp.duration(1000)} className="mt-12 px-5">
      <View className="flex-row items-center justify-center mb-6">
        <View className="h-0.5 bg-gray-300 flex-1" />
        <Text className="text-4xl font-rbold text-center mx-4">Our Mission</Text>
        <View className="h-0.5 bg-gray-300 flex-1" />
      </View>
      <Text className="text-lg font-rregular text-center text-gray-700 leading-8 mb-6">
        At Clevery, we're building a platform that fosters meaningful connections and empowers creativity. Our mission is to create a space where you can:
      </Text>
      <View className="mt-6">
        {values.map((item, index) => (
          <Animated.View 
            key={item} 
            entering={SlideInUp.delay(index * 200)}
            className="flex-row items-center mt-4"
          >
            <Feather name="check-circle" size={24} color="#FF6B6B" />
            <Text className="text-lg font-rmedium ml-4">{item}</Text>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
};

// Enhanced Feature Card
const FeatureCard = ({ icon, title, description, color }) => (
  <Animated.View 
    entering={FadeIn.duration(1000).delay(200)} 
    className="w-full bg-white rounded-xl shadow-lg p-6 mb-4"
  >
    <View className="flex-row items-center">
      <View className="items-center justify-center mr-4" style={{ backgroundColor: `${color}20`, borderRadius: 100, padding: 16 }}>
        <Feather name={icon} size={32} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-xl font-rbold mb-2">{title}</Text>
        <Text className="text-sm font-rregular text-gray-500">{description}</Text>
      </View>
    </View>
  </Animated.View>
);

// Enhanced Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: 'users',
      title: 'Community-Centered',
      description: 'Join or create communities that matter to you, centered around shared interests.',
      color: '#FF6B6B'
    },
    {
      icon: 'sliders',
      title: 'Personalized Experience',
      description: 'Our smart algorithm tailors your feed based on your interests, making your experience unique and relevant.',
      color: '#4ECDC4'
    },
    {
      icon: 'award',
      title: 'Interactive Challenges',
      description: 'Participate in community-driven challenges, contests, and events designed to bring users together.',
      color: '#FFD700'
    },
    {
      icon: 'smartphone',
      title: 'Cross-Platform Access',
      description: 'Enjoy Clevery on any device with seamless synchronization across mobile and web platforms.',
      color: '#6A5ACD'
    },
    {
      icon: 'edit-3',
      title: 'Empower Creativity',
      description: 'Access a suite of creative tools to craft the best possible content, from beautiful visuals to captivating stories.',
      color: '#FF8E53'
    }
  ];

  return (
    <View className="mt-16 px-5">
      <Text className="text-4xl font-rbold text-center mb-8">Why Choose Clevery?</Text>
      {features.map((feature, index) => (
        <Animated.View key={feature.title} entering={SlideInUp.delay(index * 100)}>
          <FeatureCard {...feature} />
        </Animated.View>
      ))}
    </View>
  );
};
// Enhanced Testimonial Card
const TestimonialCard = ({ user, text, image, rating }) => (
  <Animated.View 
    entering={SlideInUp.duration(1000).delay(300)} 
    className="bg-white rounded-lg shadow-md p-6 m-2"
    style={{ width: SCREEN_WIDTH * 0.8 }}
  >
    <View className="flex-row items-center mb-4">
      <ImageBackground 
        source={{ uri: image }} 
        style={{ width: 60, height: 60 }} 
        className="rounded-full overflow-hidden"
      />
      <View className="ml-4">
        <Text className="text-lg font-rmedium">{user}</Text>
        <View className="flex-row mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Feather 
              key={star}
              name={star <= rating ? "star" : "star-o"} 
              size={16} 
              color={star <= rating ? "#FFD700" : "#C4C4C4"} 
            />
          ))}
        </View>
      </View>
    </View>
    <Text className="text-base font-rregular text-gray-600 italic">"{text}"</Text>
  </Animated.View>
);

// Enhanced Testimonials Section
const TestimonialsSection = () => (
  <View className="mt-16 px-5">
    <Text className="text-4xl font-rbold text-center mb-8">What Our Users Say</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
      <TestimonialCard 
        user="Jane Doe" 
        text="Connecto has helped me find my tribe! The communities here are so supportive."
        image="https://i.pravatar.cc/150?img=1"
        rating={5}
      />
      <TestimonialCard 
        user="John Smith" 
        text="I love how easy it is to connect with people who share my interests."
        image="https://i.pravatar.cc/150?img=2"
        rating={4}
      />
      <TestimonialCard 
        user="Alice Johnson" 
        text="The privacy features give me peace of mind. I can be myself here!"
        image="https://i.pravatar.cc/150?img=3"
        rating={5}
      />
    </ScrollView>
  </View>
);

// New Statistics Section
const StatisticsSection = () => (
  <Animated.View entering={FadeIn.duration(1500)} className="mt-16 px-5">
    <Text className="text-4xl font-rbold text-center mb-8">Our Impact</Text>
    <View className="flex-row justify-around">
      {[
        { value: '10M+', label: 'Active Users' },
        { value: '500K+', label: 'Communities' },
        { value: '100+', label: 'Countries' },
      ].map((stat, index) => (
        <Animated.View 
          key={stat.label} 
          entering={SlideInUp.delay(index * 200)}
          className="items-center"
        >
          <Text className="text-4xl font-rbold text-blue-600">{stat.value}</Text>
          <Text className="text-sm font-rmedium text-gray-600 mt-2">{stat.label}</Text>
        </Animated.View>
      ))}
    </View>
  </Animated.View>
);

// Enhanced Call to Action Section with Animations
const CallToActionSection = () => {
  const theme = useTheme();
  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const handlePressIn = () => {
    buttonScale.value = withSequence(
      withTiming(1.1, { duration: 200 }),
      withSpring(1)
    );
  };

  return (
    <Animated.View entering={FadeIn.duration(1500)} className="mt-16 mx-5 mb-12">
      <LinearGradient 
        colors={['#FF6B6B', '#FF8E53', '#FFD700']} 
        className="rounded-xl p-10"
      >
        <Animated.Text 
          entering={SlideInUp.duration(800)} 
          className="text-4xl font-rbold text-white text-center"
        >
          Ready to Connect?
        </Animated.Text>
        <Animated.Text 
          entering={SlideInUp.duration(800).delay(200)} 
          className="text-lg font-rregular text-white text-center opacity-90 mt-4 mb-8"
        >
          Join millions of users and start your Connecto journey today!
        </Animated.Text>
        <Animated.View 
          entering={SlideInUp.duration(800).delay(400)}
          className="flex-row justify-center"
        >
          <AnimatedPressable onPressIn={handlePressIn} style={animatedButtonStyle}>
            <LinearGradient
              colors={['#4c669f', '#3b5998', '#192f6a']}
              className="rounded-full px-8 py-4"
            >
              <Text className="text-white text-lg font-rbold text-center">Join Now</Text>
            </LinearGradient>
          </AnimatedPressable>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

// Main Component
const AboutUsPage = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <HeroSection />
      <MissionSection />
      <FeaturesSection />
      <TestimonialsSection />
      <StatisticsSection />
      <CallToActionSection />
    </ScrollView>
  );
};

export default AboutUsPage;