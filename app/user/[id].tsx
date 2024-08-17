import Animated, { FadeInDown, FadeInRight, FadeIn } from 'react-native-reanimated';
import { Feather, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { 
  Box, 
  VStack, 
  HStack,
  Icon, 
  Avatar, 
  useTheme,
  ScrollView,
} from 'native-base';

import { Loader, Text, UserInfo, View } from '@/components';
import { formatDateString, useUser } from '@/lib';
import MembersList from '@/components/members-list';
import Image from '@/components/image';
import { User } from '@/types';
import Badge from '@/components/badges/user';

const AnimatedBox = Animated.createAnimatedComponent(Box);

interface UserBannerProps {
  bannerImage: string;
}

const UserBanner: React.FC<UserBannerProps> = ({ bannerImage }) => (
  <AnimatedBox entering={FadeInDown.duration(800).springify()} position="relative">
    <Image
      source={bannerImage}
      width={350}
      height={192}
      style="w-full h-56"
    />
    <AnimatedBox
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 112
      }}
      entering={FadeIn.duration(1000)}
    />
  </AnimatedBox>
);

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  popularity?: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon,popularity }) => {
  const { colors } = useTheme();
  
  return (
    <Box
      p={4} 
      rounded="xl" 
      shadow={2} 
      flex={1} 
      mr={2} 
      alignItems="center"
      bg={{
        linearGradient: {
          colors: ['gray.400', '#3b5998', '#192f6a'],
          start: [0, 0],
          end: [1, 1],
        },
      }}
    >
      {title === "Popularity"
      ?
      //  <Icon as={Badge} name={icon} size={6} color={colors.blue[500]} mr={4}/>
       <Badge popularity={popularity} />
      :<Icon as={FontAwesome5} name={icon} size={6} color={colors.blue[500]} />
      }
      <Text className='font-rbold text-lg'>{value}</Text>
      <Text className='font-rregular'>{title}</Text>
    </Box>
  );
};

interface UserSectionProps {
  title: string;
  content: React.ReactNode;
  icon: string;
}

const UserSection: React.FC<UserSectionProps> = ({ title, content, icon }) => (
  <AnimatedBox 
    m={4} p={4} rounded="xl" shadow={2}
    entering={FadeInRight.duration(600).delay(200).springify()}
    bg={{
      linearGradient: {
        colors: ['gray.400', '#3b5998', '#192f6a'],
        start: [0, 0],
        end: [1, 1],
      },
    }}
  >
    <HStack alignItems="center" mb={2}>
      <Icon as={FontAwesome5} name={icon} size={5} color="gray.600" />
      <Text className='font-rbold ml-5'>{title}</Text>
    </HStack>
    {content}
  </AnimatedBox>
);

const UserProfile: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: user, isPending: loading, isError: netError } = useUser(id as string);
  const { colors } = useTheme();

  if (loading || netError) {
    return <Loader loadingText="Loading user profile..." />;
  }

  if (!user) {
    return <Text>User not found</Text>;
  }
  
  return (
    <ScrollView flex={1} className='flex-1 w-full h-full'>
      <UserBanner bannerImage={user.bannerImage || ''} />
      <Box px={4} mt={5}>
        <UserInfo profile={user} />
      </Box>

      <AnimatedBox 
         m={4} p={4} rounded="xl" shadow={2}
        entering={FadeInDown.duration(600).delay(400).springify()}
        bg={{
          linearGradient: {
            colors: ['gray.400', '#3b5998', '#192f6a'],
            start: [0, 0],
            end: [1, 1],
          },
        }}
      >
        <Text className='font-rbold text-lg'>About Me</Text>
        <Text className='font-rregular text-sm'>{user.bio || 'No bio available'}</Text>
      </AnimatedBox>

      <AnimatedBox 
        flexDirection="row" justifyContent="between" mx={4} mb={4}
        entering={FadeInRight.duration(600).delay(300).springify()}
      >
        <StatCard title="Posts" value={user.postCount || 0} icon="pen-square" />
        <StatCard title="Friends" value={user.friends?.length || 0} icon="user-friends" />
        <StatCard title="Popularity" value={user.userScore || 0} icon="star" popularity={user.userScore || 0}/>
      </AnimatedBox>

      <UserSection 
        title="Member Since" 
        content={<Text className='font-rregular text-sm'>{formatDateString(user.createdAt)}</Text>}
        icon="calendar-alt"
      />
      
      <AnimatedBox 
        m={4}
        entering={FadeInRight.duration(600).delay(600).springify()}
        bg={{
          linearGradient: {
            colors: ['gray.400', '#3b5998', '#192f6a'],
            start: [0, 0],
            end: [1, 1],
          },
        }}
      >
        <Text className='font-rbold text-lg'>Mutual Friends</Text>
        {user.commonFriends && user.commonFriends.length > 0 ? (
          <MembersList 
            label="Mutual Friends"
            images={user.commonFriends.map(friend => friend?.image)} 
          />
        ) : (
          <Text className='text-white'>No mutual friends yet</Text>
        )}
      </AnimatedBox>

      <UserSection 
        title="Mutual Servers" 
        icon="server" 
        content={
          <VStack space={2}>
            {user.commonServers?.map((server: any) => (
              <HStack key={server.id} alignItems="center">
                <Avatar source={{ uri: server.image }} size="sm" mr={2} />
                <Text className='font-rregular text-sm'>{server.name}</Text>
              </HStack>
            ))}
          </VStack>
        } 
      />

      <UserSection 
        title="Connections" 
        icon="users" 
        content={
          <HStack flexWrap="wrap">
            {user.connections?.map((connection: User) => (
              // <Badge key={connection.id} colorScheme="blue" m={1}>
              //   {connection.username}
              // </Badge>
              <></>
            ))}
          </HStack>
        } 
      />

      <UserSection
        title="Achievements"
        icon="trophy"
        content={
          <VStack space={2}>
            {user?.achievements?.map((achievement:any, index:any) => (
              <HStack key={index} alignItems="center">
                <Icon as={FontAwesome5} name="medal" size={4} color={colors.yellow[500]} mr={2} />
                <Text className='font-rregular text-sm'>{achievement}</Text>
              </HStack>
            ))}
          </VStack>
        }
      />
    </ScrollView>
  );
};

export default UserProfile;