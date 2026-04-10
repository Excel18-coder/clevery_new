import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

const BADGE_SIZE = 150;

const BadgeDesigns = {
  bronze: {
    color: '#CD7F32',
    icon: 'M25,2 L75,2 L90,30 L50,98 L10,30 Z',
  },
  silver: {
    color: '#C0C0C0',
    icon: 'M50,2 L98,35 L79,98 L21,98 L2,35 Z',
  },
  gold: {
    color: '#FFD700',
    icon: 'M50,2 L61,36 L98,36 L68,58 L79,92 L50,72 L21,92 L32,58 L2,36 L39,36 Z',
  },
  platinum: {
    color: '#E5E4E2',
    icon: 'M50,2 L85,18 L98,50 L85,82 L50,98 L15,82 L2,50 L15,18 Z',
  },
  diamond: {
    color: '#B9F2FF',
    icon: 'M50,2 L90,25 L90,75 L50,98 L10,75 L10,25 Z',
  },
};

type BadgeLevel = keyof typeof BadgeDesigns;

const getBadgeLevel = (popularity: number): BadgeLevel => {
  if (popularity < 20) return 'bronze';
  if (popularity < 40) return 'silver';
  if (popularity < 60) return 'gold';
  if (popularity < 80) return 'platinum';
  return 'diamond';
};

interface PopularityBadgeProps {
  popularity: number;
}

const PopularityBadge: React.FC<PopularityBadgeProps> = ({ popularity }) => {
  const level = getBadgeLevel(popularity);
  const design = BadgeDesigns[level];

  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(popularity / 100, { duration: 2000, easing: Easing.out(Easing.exp) });
    
    if (level === 'diamond' || level === 'platinum') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
      rotation.value = withRepeat(
        withTiming(360, { duration: 10000, easing: Easing.linear }),
        -1,
        false
      );
      glow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [popularity, level]);

  const circleProps = useAnimatedProps(() => ({
    strokeDashoffset: 270 - (progress.value * 270),
  }));

  const iconGroupProps = useAnimatedProps(() => ({
    transform: `translate(50 50) rotate(${rotation.value}) scale(${scale.value}) translate(-50 -50)`,
  }));

  const glowProps = useAnimatedProps(() => ({
    fillOpacity: glow.value,
  }));

  const textColor = useAnimatedProps(() => ({
    fill: interpolateColor(
      progress.value,
      [0, 1],
      ['#808080', '#FFFFFF']
    ),
  }));

  return (
    <View style={styles.container}>
      <Svg height={BADGE_SIZE} width={BADGE_SIZE} viewBox="0 0 100 100">
        <AnimatedCircle
          cx="50"
          cy="50"
          r="43"
          stroke={design.color}
          strokeWidth="4"
          fill="none"
          strokeDasharray={270}
          animatedProps={circleProps}
        />
        <AnimatedG animatedProps={iconGroupProps}>
          <Path
            d={design.icon}
            fill={design.color}
          />
          <AnimatedPath
            d={design.icon}
            fill="white"
            animatedProps={glowProps}
          />
        </AnimatedG>
        <G>
          <AnimatedSvgText
            x="50"
            y="55"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
            animatedProps={textColor}
          >
            {`${Math.round(popularity)}%`}
          </AnimatedSvgText>
        </G>
      </Svg>
      <Text style={styles.label}>{level.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default PopularityBadge;