import React, { useState } from 'react';
import { Pressable, ScrollView, View as RNView } from 'react-native';
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
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from '@/components/themed';
import { useThemeStore } from '@/lib';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const LogoutOption = ({ title, description, icon, onPress, isSelected }) => {
  const scale = useSharedValue(1);
  const { mode } = useThemeStore();
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [mode === 'dark' ? '#3f3f46' : '#e4e4e7', mode === 'dark' ? '#1d4ed8' : '#93c5fd']
    );
    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    };
  });

  React.useEffect(() => {
    progress.value = withSpring(isSelected ? 1 : 0);
  }, [isSelected]);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle]}
        className="flex-row items-center p-4 mb-4 rounded-xl shadow-md"
      >
        <RNView className="mr-4 p-2 bg-opacity-20 rounded-full" style={{ backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          <Feather name={icon} size={24} color={mode === 'light' ? "#4A90E2" : 'white'} />
        </RNView>
        <RNView className="flex-1">
          <Text className="text-lg font-rbold">{title}</Text>
          <Text className="text-sm font-rregular opacity-70">{description}</Text>
        </RNView>
        {isSelected && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Feather name="check-circle" size={24} color={mode === 'light' ? "#4A90E2" : 'white'} />
          </Animated.View>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
};

const LogoutPage = () => {
  const theme = useTheme();
  const [logoutOption, setLogoutOption] = useState('current');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { mode } = useThemeStore();

  const handleLogout = () => {
    console.log(`Logging out of ${logoutOption === 'all' ? 'all devices' : 'current device'}`);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Animated.View entering={FadeIn.delay(300).duration(1000)} className="mb-8">
        <Text className="text-4xl font-rbold mb-2" style={{ color: mode === 'dark' ? '#fff' : '#1f2937' }}>
          Taking a break?
        </Text>
        <Text className="text-lg font-rregular" style={{ color: mode === 'dark' ? '#d1d5db' : '#4b5563' }}>
          We'll be here when you return. Remember, you can always just close the app to stay connected.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(600).duration(1000)} className="mb-8">
        <LinearGradient
          colors={mode === 'dark' ? ['#4338ca', '#3b82f6'] : ['#93c5fd', '#60a5fa']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-xl p-5"
        >
          <Feather name="info" size={24} color="white" style={{ marginBottom: 10 }} />
          <Text className="text-lg font-rmedium mb-2 text-white">Quick Tip</Text>
          <Text className="text-base font-rregular text-white opacity-90">
            Staying logged in keeps you connected with friends and ensures you don't miss any important updates or messages.
          </Text>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(900).duration(1000)} className="mb-6">
        <Text className="text-2xl font-rmedium mb-4" style={{ color: mode === 'dark' ? '#fff' : '#1f2937' }}>
          Logout Options
        </Text>
        <LogoutOption
          title="This device only"
          description="Stay logged in elsewhere"
          icon="smartphone"
          onPress={() => setLogoutOption('current')}
          isSelected={logoutOption === 'current'}
        />
        <LogoutOption
          title="All devices"
          description="Log out everywhere"
          icon="globe"
          onPress={() => setLogoutOption('all')}
          isSelected={logoutOption === 'all'}
        />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(1200).duration(1000)} className="mt-6">
        <Pressable
          onPress={() => setShowConfirmation(true)}
          className="bg-red-500 rounded-xl py-4 px-6 shadow-lg"
          style={{ elevation: 3 }}
        >
          <Text className="text-lg font-rbold text-white text-center">Logout</Text>
        </Pressable>
      </Animated.View>

      {showConfirmation && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Animated.View 
            entering={FadeIn.duration(300)} 
            exiting={FadeOut.duration(300)}
            className="flex-1 justify-center items-center p-4"
          >
            <RNView className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <Text className="text-2xl font-rbold mb-3" style={{ color: mode === 'dark' ? '#fff' : '#1f2937' }}>
                Are you sure?
              </Text>
              <Text className="text-base font-rregular mb-6" style={{ color: mode === 'dark' ? '#d1d5db' : '#4b5563' }}>
                You'll miss out on updates from your friends and communities. Why not take a short break instead?
              </Text>
              <RNView className="flex-row justify-between">
                <Pressable
                  onPress={() => setShowConfirmation(false)}
                  className="bg-blue-500 rounded-xl py-3 px-5"
                >
                  <Text className="text-base font-rbold text-white">Stay Connected</Text>
                </Pressable>
                <Pressable
                  onPress={handleLogout}
                  className="bg-gray-200 dark:bg-gray-700 rounded-xl py-3 px-5"
                >
                  <Text className="text-base font-rbold" style={{ color: mode === 'dark' ? '#d1d5db' : '#4b5563' }}>
                    Logout Anyway
                  </Text>
                </Pressable>
              </RNView>
            </RNView>
          </Animated.View>
        </View>
      )}

      <Animated.View entering={FadeIn.delay(1500).duration(1000)} className="mt-8">
        <LinearGradient
          colors={mode === 'dark' ? ['#065f46', '#047857'] : ['#d1fae5', '#6ee7b7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-xl p-5"
        >
          <Feather name="bell" size={24} color={mode === 'dark' ? 'white' : '#065f46'} style={{ marginBottom: 10 }} />
          <Text className="text-lg font-rmedium mb-2" style={{ color: mode === 'dark' ? 'white' : '#065f46' }}>
            Stay in the loop!
          </Text>
          <Text className="text-base font-rregular" style={{ color: mode === 'dark' ? '#d1fae5' : '#065f46' }}>
            Logging out means you might miss important notifications, messages from friends, or exciting updates. Consider just closing the app for a short break.
          </Text>
        </LinearGradient>
      </Animated.View>
    </ScrollView>
  );
};

export default LogoutPage;