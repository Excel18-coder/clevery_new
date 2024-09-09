import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

type MessageOption = {
  icon: string;
  label: string;
  onPress: () => void;
};

type MessageOptionsPopupProps = {
  isVisible: boolean;
  onClose: () => void;
  options: MessageOption[];
};

const MessageOptionsPopup: React.FC<MessageOptionsPopupProps> = ({
  isVisible,
  onClose,
  options,
}) => {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const active = useSharedValue(false);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== 0;
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const isActive = useCallback(() => {
    return active.value;
  }, []);

  useEffect(() => {
    if (isVisible) {
      scrollTo(-SCREEN_HEIGHT / 3);
    } else {
      scrollTo(0);
    }
  }, [isVisible, scrollTo]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(Math.min(event.translationY + context.value.y, 0), MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 3) {
        scrollTo(0);
        runOnJS(onClose)();
      } else if (translateY.value < -SCREEN_HEIGHT / 2) {
        scrollTo(MAX_TRANSLATE_Y);
      } else {
        scrollTo(-SCREEN_HEIGHT / 3);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolation.CLAMP
    );

    return {
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActive() ? 1 : 0),
    };
  });

  const rIconStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y, 0],
      [180, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ rotateZ: `${rotateZ}deg` }],
    };
  });

  return (
    <>
      <Animated.View
        className="absolute inset-0 bg-black bg-opacity-30 z-10"
        style={rBackdropStyle}
        onTouchStart={() => scrollTo(0)}
      />
      <GestureDetector gesture={gesture}>
        <Animated.View 
          className="absolute top-full w-full bg-white z-20"
          style={[{ height: SCREEN_HEIGHT }, rBottomSheetStyle]}
        >
          <View className="w-20 h-1 bg-gray-300 rounded-full self-center my-4" />
          <Animated.View className="self-center mb-2" style={rIconStyle}>
            <Feather name="chevron-up" size={24} color="#4B5563" />
          </Animated.View>
          {options.map((option, index) => (
            <Pressable
              key={index}
              className="flex-row items-center py-4 px-5"
              onPress={option.onPress}
            >
              <Feather name={option.icon as any} size={24} color="#4B5563" />
              <Text className="ml-5 text-base font-rmedium text-gray-800">{option.label}</Text>
            </Pressable>
          ))}
        </Animated.View>
      </GestureDetector>
    </>
  );
};

export default MessageOptionsPopup;