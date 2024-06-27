import { Feather, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

 import { ProfImage } from '@/components';


export default function TabLayout() {
  return (
    <Tabs  
      initialRouteName="index"
      screenOptions={({ route }) => ({ 
        tabBarHideOnKeyboard: true,
        headerShown:false,

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
        <Tabs.Screen name="search"/>  
        <Tabs.Screen name="create-post" />
        <Tabs.Screen name="messages" />
        <Tabs.Screen name="profile" />
    </Tabs> 
  );
}

