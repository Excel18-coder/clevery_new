import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
  ZoomOut
} from 'react-native-reanimated';
import { formatDateString, useCurrentUserWithActivity } from '@/lib';
import { HStack, Loader, Text, View } from '@/components';
import PopularityBadge from '../badge/popularity';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedIcon = ({ name, size, color }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    scale.value = withSpring(1.2, {}, () => {
      scale.value = withSpring(1);
    });
  }, []);

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        <Feather name={name} size={size} color={color} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const ActivityCard = ({ icon, title, count, color }) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1);
    });
  }, []);

  return (
    <Pressable onPress={handlePress}>
      <Animated.View 
        style={animatedStyle}
        className="rounded-xl p-5 w-full shadow-md items-center bg-white"
        entering={ZoomIn.springify()}
      >
        <View className="mb-2 p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <AnimatedIcon name={icon} size={24} color={color} />
        </View>
        <View>
          <Text className="text-lg font-rbold text-center" style={{ color }}>{count}</Text>
          <Text className="text-sm font-rregular text-center" style={{ color: theme.colors.text }}>{title}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const ActivityTimeline = ({ data }) => {
  return (
    <View className="mt-6">
      {data.map((item, index) => (
        <Animated.View 
          key={item.id} 
          entering={SlideInRight.delay(index * 100)}
          exiting={SlideOutLeft}
        >
          <View className="flex-row">
            <View className="items-center mr-4">
              <View className="w-3 h-3 rounded-full bg-blue-500" />
              {index < data?.length - 1 && <View className="w-0.5 h-16 bg-blue-200" />}
            </View>
            <View className="flex-1 pb-6">
              <Text className="text-lg font-rbold">{item.title}</Text>
              <Text className="text-sm font-rregular text-gray-500">{item.content}</Text>
              <Text className="text-xs text-gray-400 mt-1">{formatDateString(item.createdAt)}</Text>
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const ActivityChart = ({ data }) => {
  const theme = useTheme();
  const [selectedSlice, setSelectedSlice] = useState(null);

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const chartData = [
    {
      name: 'Posts',
      population: data.contentCreation.posts?.length,
      color: '#FF6B6B',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Comments',
      population: data.contentCreation.comments?.length,
      color: '#854d0e',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Likes',
      population: data.engagement.interactions.likes?.length,
      color: '#FF69B4',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Saves',
      population: data.engagement.interactions.saves?.length,
      color: '#FFA500',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Friends',
      population: data.networkGrowth.socialNetwork.friends,
      color: '#6A5ACD',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Visitors',
      population: data.networkGrowth.socialNetwork.visitors,
      color: '#06b6d4',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }
  ];

  return (
    <Animated.View entering={FadeIn.duration(1000)}>
      <PieChart
        data={chartData}
        width={SCREEN_WIDTH - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      {selectedSlice !== null && (
        <Animated.View 
          className="bg-white rounded-lg p-4 mt-4 shadow-md"
          entering={ZoomIn.springify()}
          exiting={ZoomOut.springify()}
        >
          <Text className="text-lg font-rbold">{chartData[selectedSlice].name}</Text>
          <Text className="text-base">Count: {chartData[selectedSlice].population}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const AnimatedHeader = ({ scrollY }) => {
  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 100],
            [0, -50],
            Extrapolation.CLAMP
          )
        }
      ]
    };
  });

  return (
    <Animated.View style={[headerStyle, { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }]}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        className="p-5 pt-12"
      >
        <Animated.Text className="text-3xl font-rbold mb-2 text-white">Activity Overview</Animated.Text>
        <Animated.Text className="text-base font-rregular mb-5 text-white opacity-80">
          Here's a summary of your recent platform activity
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
};

const ProgressBar = ({ progress, color }) => {
  const width = useSharedValue(0);

  React.useEffect(() => {
    width.value = withTiming(progress, { duration: 1000 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <Animated.View
        className="h-full rounded-full"
        style={[animatedStyle, { backgroundColor: color }]}
      />
    </View>
  );
};

const EngagementMetric = ({ title, current, total, color }) => {
  const progress = total > 0 ? current / total : 0;

  return (
    <Animated.View 
      className="bg-white rounded-lg p-4 mb-4 shadow-md"
      entering={FadeIn.duration(500)}
    >
      <Text className="text-lg font-rbold mb-2">{title}</Text>
      <ProgressBar progress={progress} color={color} />
      <Text className="text-sm text-gray-500 mt-2">{`${current} / ${total}`}</Text>
    </Animated.View>
  );
};

const ActivityPage = () => {
  const theme = useTheme();
  const scrollY = useSharedValue(0);

  const {
    data: activity,
    refetch: refetchActivity,
    isLoading: isLoadingActivity
  } = useCurrentUserWithActivity();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (isLoadingActivity) return <Loader loadingText="We're loading your activity" />;

  if (!activity) {
    return (
      <View className="flex-1 justify-center items-center">
        <Feather name="alert-circle" size={64} color={theme.colors.text} />
        <Text className="mt-4 text-lg font-rmedium">No activity data available</Text>
      </View>
    );
  }

  //@ts-ignore
  const { userInfo, contentCreation, engagement, communityInvolvement, networkGrowth, communication, userFeedback } = activity;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <AnimatedHeader scrollY={scrollY} />
      <Animated.ScrollView
        className="flex-1"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={{ height: 200 }} />
        <View className="p-5">
          <View className="flex-row justify-between items-center mb-5">
            <ActivityCard icon="file-text" title="Posts" count={contentCreation.posts?.length} color="#FF6B6B" />
            <ActivityCard icon="message-square" title="Comments" count={contentCreation.comments?.length} color="#4ECDC4" />
          </View>
          
          <View className="flex-row gap-8 mb-5">
            <ActivityCard icon="heart" title="Likes" count={engagement.interactions.likes?.length} color="#FF69B4" />
            <ActivityCard icon="bookmark" title="Saves" count={engagement.interactions.saves?.length} color="#FFA500" />
          </View>

          <Animated.View entering={FadeIn.duration(1000).delay(300)}>
            <Text className="text-3xl font-rbold mt-8 mb-4">Your Stats</Text>
            <Text className="text-base font-rregular mt-2 mb-4">{userInfo.summary}</Text>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(600)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Activity Stats</Text>
            <ActivityChart data={activity} />
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(900)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Engagement Metrics</Text>
            <EngagementMetric 
              title="Post Engagement"
              current={engagement.interactions.likes?.length + engagement.interactions.comments?.length}
              total={contentCreation.posts?.length * 10}
              color="#FF6B6B"
            />
            <EngagementMetric 
              title="Community Participation"
              current={communityInvolvement.eventsAttended}
              total={communityInvolvement.totalEvents}
              color="#4ECDC4"
            />
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(900)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Recent Activity</Text>
            <ActivityTimeline 
              data={[
                ...contentCreation.posts.map(post => ({
                  id: post.id,
                  title: 'Created a Post',
                  content: post.title,
                  createdAt: post.createdAt
                })),
                ...contentCreation.comments.map(comment => ({
                  id: comment.id,
                  title: 'Left a Comment',
                  content: comment.content,
                  createdAt: comment.createdAt
                }))
              ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)}
            />
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(1200)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Server Memberships</Text>
            {communityInvolvement.serverActivity.memberships.map((membership, index) => (
              <Animated.View
                key={membership.id}
                entering={FadeIn.duration(500).delay(index * 100)}
                className="rounded-xl p-4 shadow-md mb-3 bg-white"
              >
                <Text className="text-base font-rbold">{`Server: ${membership.serverName}`}</Text>
                <Text className="text-sm text-gray-500">{`Role: ${membership.role}`}</Text>
                <Text className="text-xs text-gray-400 mt-1">
                  {`Joined: ${formatDateString(membership.joinedAt)}`}
                </Text>
              </Animated.View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(1500)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Network Growth</Text>
            <View className="bg-white rounded-xl p-4 shadow-md mb-3">
              <Text className="text-lg font-rmedium">Friends: {networkGrowth.socialNetwork.friends}</Text>
              <Text className="text-lg font-rmedium">Profile Visitors: {networkGrowth.socialNetwork.visitors}</Text>
              <Text className="text-lg font-rmedium">Invites Sent: {networkGrowth.socialNetwork.invites?.length}</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(1800)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Communication</Text>
            <View className="bg-white rounded-xl p-4 shadow-md mb-3">
              <Text className="text-lg font-rmedium">
                Initiated Conversations: {communication.messaging.initiatedConversations}
              </Text>
              <Text className="text-lg font-rmedium">Recent Conversations: {communication.messaging.recentConversations?.length}</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(2100)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">User Feedback</Text>
            <View className="bg-white rounded-xl p-4 shadow-md mb-3">
              <Text className="text-lg font-rmedium">Notifications: {userFeedback.notifications?.length}</Text>
              <Text className="text-lg font-rmedium">Feedbacks Provided: {userFeedback.feedbacks?.length}</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(2400)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Achievement Badges</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { icon: 'award', title: 'Top Contributor', color: '#FFD700' },
                { icon: 'thumbs-up', title: 'Most Liked', color: '#FF69B4' },
                { icon: 'users', title: 'Social Butterfly', color: '#4169E1' },
                { icon: 'star', title: 'Rising Star', color: '#FFA500' },
              ].map((badge, index) => (
                <Animated.View 
                  key={badge.title}
                  className="mr-4 items-center"
                  entering={ZoomIn.delay(index * 200)}
                >
                  <View className="w-16 h-16 rounded-full justify-center items-center mb-2" style={{ backgroundColor: badge.color }}>
                    <Feather name={badge.icon} size={32} color="white" />
                  </View>
                  <Text className="text-sm font-rmedium text-center">{badge.title}</Text>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(2700)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Activity Streak</Text>
            <View className="bg-white rounded-xl p-4 shadow-md mb-3">
              <Text className="text-lg font-rmedium mb-2">Current Streak: 7 days</Text>
              <View className="flex-row justify-between">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <View key={day} className="items-center">
                    <View className={`w-8 h-8 rounded-full ${day <= 7 ? 'bg-green-500' : 'bg-gray-300'} justify-center items-center`}>
                      <Feather name="check" size={16} color="white" />
                    </View>
                    <Text className="text-xs mt-1">Day {day}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(3000)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Upcoming Events</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { title: 'Community Meetup', date: '2023-10-15', icon: 'users' },
                { title: 'Webinar: Advanced Techniques', date: '2023-10-22', icon: 'video' },
                { title: 'Q&A Session', date: '2023-10-29', icon: 'help-circle' },
              ].map((event, index) => (
                <Animated.View 
                  key={event.title}
                  className="mr-4 bg-white rounded-xl p-4 shadow-md"
                  style={{ width: SCREEN_WIDTH * 0.7 }}
                  entering={SlideInRight.delay(index * 200)}
                >
                  <View className="flex-row items-center mb-2">
                    <Feather name={event.icon} size={24} color={theme.colors.primary} />
                    <Text className="text-lg font-rbold ml-2">{event.title}</Text>
                  </View>
                  <Text className="text-sm text-gray-500">{event.date}</Text>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ActivityPage;