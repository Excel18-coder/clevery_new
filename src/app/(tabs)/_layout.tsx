import { View } from '@/components';
import { useProfileStore } from '@/lib';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const ProfImage = () => {
    const { profile } = useProfileStore();
    const userImage = profile?.image ? profile?.image : ''

    if (profile?.image == '') {
      return <Ionicons name="person" size={20} color="grey" />
    }

    return (
      <View>
        <Image source={{ uri: userImage }}
          className='h-[30px] w-[30px] rounded-[15px] border-[0.5px] border-gray-400'
        />
      </View>
    )
  }

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,

        tabBarIcon: ({ color, size }) => {
          if (route.name === 'home') {
            return <Ionicons name="home" size={size} color={color} />
          } else if (route.name === 'search') {
            return <Feather name="search" size={size} color={color} />
          } else if (route.name === 'profile') {
            return <ProfImage />;
          } else if (route.name === 'create-post') {
            return <Feather name="image" size={size} color={color} />
          } else if (route.name === 'messages') {
            return <Feather name="message-circle" size={size} color={color} />
          }
        }, 
      })}
    >
      <Tabs.Screen name="home" /> 
      <Tabs.Screen name="search" />
      <Tabs.Screen name="create-post" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="profile" />
    </Tabs> 
  );
}

