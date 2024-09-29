import { Pressable, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  FadeIn, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  SharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, HStack, Loader, Text, View, VStack } from '@/components';
import MembersList from '@/components/servers/member-list';
import UserInfo from '@/components/profile/user-info';
import { formatDateString, useUser } from '@/lib';
import { Badge } from '@/components/ui/badge';
import Image from '@/components/image';
import { User } from '@/types';

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedBlurView = Animated.createAnimatedComponent(View);
const AnimatedCard = Animated.createAnimatedComponent(Box);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BANNER_HEIGHT = SCREEN_HEIGHT * 0.35;

interface UserBannerProps {
  bannerImage: string;
  scrollY: SharedValue<number>;
}

const UserBanner: React.FC<UserBannerProps> = ({ bannerImage, scrollY }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        scale: interpolate(
          scrollY.value,
          [-BANNER_HEIGHT, 0, BANNER_HEIGHT],
          [2, 1, 0.75],
          Extrapolation.CLAMP
        ),
      },
      {
        translateY: interpolate(
          scrollY.value,
          [0, BANNER_HEIGHT],
          [0, BANNER_HEIGHT / 4],
          Extrapolation.CLAMP
        ),
      }
    ],
  }));

  return (
    <Animated.View style={[{ height: BANNER_HEIGHT, overflow: 'hidden'}, animatedStyle]}>
      <Image
        source={bannerImage}
        width={SCREEN_WIDTH}
        height={BANNER_HEIGHT}
        style="w-full h-full mb-6"
      />
      <AnimatedLinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: BANNER_HEIGHT / 2,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      />
    </Animated.View>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  popularity?: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, popularity }) => {
  return (
    <AnimatedCard
      entering={FadeIn.duration(800).delay(200)}
      className="flex-1 items-center p-4 m-2 bg-white shadow-md rounded-lg"
      style={{ elevation: 4 }}
    >
      <FontAwesome5 name={icon} size={24} color="#4A5568" />
      <Text className="font-bold text-lg mt-2">{value}</Text>
      <Text className="text-sm text-gray-600">{title}</Text>
    </AnimatedCard>
  );
};

interface UserSectionProps {
  title: string;
  content: React.ReactNode;
  icon: string;
}

const UserSection: React.FC<UserSectionProps> = ({ title, content, icon }) => (
  <AnimatedCard
    entering={FadeInRight.duration(600).delay(200).springify()}
    className="p-4 m-2 bg-white rounded-lg shadow-md"
  >
    <HStack className="items-center mb-3">
      <FontAwesome5 name={icon} size={20} color="#4A5568" />
      <Text className="font-bold text-lg ml-3">{title}</Text>
    </HStack>
    {content}
  </AnimatedCard>
);

const UserProfile: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: user, isPending: loading, isError: netError } = useUser(id as string);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, BANNER_HEIGHT / 2],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: withSpring(
          interpolate(
            scrollY.value,
            [0, BANNER_HEIGHT / 2],
            [-60, 0],
            Extrapolation.CLAMP
          )
        )
      }
    ],
  }));

  if (loading || netError) {
    return <Loader loadingText="Loading user profile..." />;
  }

  if (!user) {
    return <Text>User not found</Text>;
  }

  return (
    <View className="flex-1 bg-gray-100">
      <AnimatedBlurView
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            zIndex: 100,
          },
          headerStyle,
        ]}
        className="bg-white/70 backdrop-blur-lg"
      >
        <HStack className="justify-between items-center px-4 h-full">
          <Text className="font-bold text-lg">{user.username}</Text>
          <Pressable>
            <Feather name="more-vertical" size={24} color="#4A5568" />
          </Pressable>
        </HStack>
      </AnimatedBlurView>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="bg-gradient-to-b from-blue-100 to-purple-100"
      >
        <UserBanner bannerImage={user.bannerImage || ''} scrollY={scrollY} />
        
        <AnimatedBox
          entering={FadeInDown.duration(800).springify()}
          className="px-4 mt-[50px]"
        >
          <UserInfo profile={user} />
        </AnimatedBox>

        <AnimatedCard
          entering={FadeInDown.duration(600).delay(200).springify()}
          className="m-2 p-4 bg-white shadow-md rounded-lg"
        >
          <Text className="font-bold text-lg mb-2">About Me</Text>
          <Text className="text-sm text-gray-700">{user.bio || 'No bio available'}</Text>
        </AnimatedCard>

        <HStack className="justify-between mx-2 mb-4">
          <StatCard title="Posts" value={user.postCount || 0} icon="pen-square" />
          <StatCard title="Friends" value={user.friends?.length || 0} icon="user-friends" />
          <StatCard
            title="Popularity"
            value={`${user.userScore || 0}%`}
            icon="star"
            popularity={user.userScore || 0}
          />
        </HStack>

        <UserSection
          title="Member Since"
          content={<Text className="text-sm text-gray-700">{formatDateString(user.createdAt)}</Text>}
          icon="calendar-alt"
        />

        <UserSection
          title="Mutual Friends"
          icon="users"
          content={
            user.commonFriends && user.commonFriends.length > 0 ? (
              <MembersList
                label="Mutual Friends"
                images={user?.commonFriends?.map(friend => friend?.image)}
              />
            ) : (
              <Text className="text-gray-500">No mutual friends yet</Text>
            )
          }
        />

        <UserSection
          title="Mutual Servers"
          icon="server"
          content={
            <VStack className="space-y-3">
              {user?.commonServers?.map((server: any) => (
                <HStack key={server.id} className="items-center">
                  <Image source={server.image} width={24} height={24} style="mr-3 rounded-full w-10 h-10" />
                  <Text className="text-sm text-gray-700">{server.name}</Text>
                </HStack>
              ))}
            </VStack>
          }
        />

        <UserSection
          title="Connections"
          icon="link"
          content={
            <HStack className="flex-wrap">
              {user?.connections?.map((connection: User) => (
                <Badge key={connection.id} className="m-1 bg-blue-100 text-blue-800">
                  {connection.username}
                </Badge>
              ))}
            </HStack>
          }
        />

        <UserSection
          title="Achievements"
          icon="trophy"
          content={
            <VStack className="space-y-2">
              {user?.achievements?.map((achievement: any, index: number) => (
                <HStack key={index} className="items-center">
                  <FontAwesome5 name="medal" size={16} color="#FFD700" className="mr-2" />
                  <Text className="text-sm text-gray-700">{achievement}</Text>
                </HStack>
              ))}
            </VStack>
          }
        />
      </Animated.ScrollView>
    </View>
  );
};

export default UserProfile;
