import { Box, Icon } from "native-base";
import { Text } from "../Themed";
import { StyleSheet, Animated, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from "react";

interface BadgeProps {
  text: string;
  colors: string[];
  icon?: string;
  animation?: any;
  elite?: boolean;
}

const BadgeBase: React.FC<BadgeProps> = ({ text, colors, icon, animation, elite }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animatedStyle: Animated.AnimatedProps<ViewStyle> = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
        }),
      },
      // {
      //   rotate: rotateValue.interpolate({
      //     inputRange: [0, 1],
      //     outputRange: ['0deg', '360deg'],
      //   }),
      // },
    ],
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Box
        bg={{
          linearGradient: {
            colors: colors,
            start: [0, 0],
            end: [1, 1],
          },
        }}
        style={[styles.badge, elite && styles.eliteBadge]}
        px={3}
        py={1.5}
        rounded="full"
      >
        {icon && <Icon as={Ionicons} name={icon} size="sm" color="white" />}
        <Text style={[styles.text, elite && styles.eliteText]}>{text}</Text>
        {animation && (
          <Box style={styles.animationContainer}>
            <LottieView
              source={animation}
              autoPlay
              loop
              style={styles.animation}
              hardwareAccelerationAndroid
              speed={2}
            />
          </Box>
        )}
      </Box>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  eliteBadge: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  eliteText: {
    color: '#FFD700',
  },
  animationContainer: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 40,
    height: 40,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});

export const Badge = BadgeBase;

// Free User Badges
export const NewcomerBadge = () => (
  <Badge text="Newcomer" colors={['#4CAF50', '#45B649']} icon="leaf-outline" />
);

export const ExplorerBadge = () => (
  <Badge text="Explorer" colors={['#3498db', '#2980b9']} icon="compass-outline" />
);

export const ContributorBadge = () => (
  <Badge 
    text="Contributor" 
    colors={['#e67e22', '#d35400']} 
    icon="trophy-outline"
    animation={require('@/assets/animations/circle.json')}
  />
);

// Elite User Badges
export const VIPBadge = () => (
  <Badge 
    text="VIP" 
    colors={['#8e44ad', '#9b59b6']} 
    icon="diamond-outline" 
    elite={true}
    // animation={require('@/assets/animations/diamond.json')}
  />
);

export const MasterBadge = () => (
  <Badge 
    text="Master" 
    colors={['#c0392b', '#e74c3c']} 
    icon="flame-outline" 
    elite={true}
    animation={require('@/assets/animations/fire.json')}
  />
);

export const LegendBadge = () => (
  <Badge 
    text="Legend" 
    colors={['#1abc9c', '#16a085']} 
    icon="star-outline" 
    elite={true}
    animation={require('@/assets/animations/star.json')}
  />
);