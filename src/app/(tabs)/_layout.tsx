import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Tabs } from 'expo-router';

import { useProfileStore } from '@/lib';
import { View } from '@/components';

export default function TabLayout() {
  const ProfImage = () => {
    const { profile } = useProfileStore();
    const userImage = profile?.image ? profile?.image : ''

    if (profile?.image == '') {
      return <Ionicons name="person" size={20} color="grey" />
    }

    return (
      <View>
        <Image
          source={userImage}
          style={{height:30, width:30, borderRadius:15, borderColor:'gray', borderWidth:0.5}}
        />
      </View>
    )
  }

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,

        tabBarIcon: ({ color, size }) => {
          if (route.name === 'index') {
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
      <Tabs.Screen name="index" /> 
      <Tabs.Screen name="search" />
      <Tabs.Screen name="create-post" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="profile" />
    </Tabs> 
  );
}

