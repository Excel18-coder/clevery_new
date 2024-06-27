import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import {SplashScreen, Stack} from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider, useIsFocused} from '@react-navigation/native';

import { Providers,pusherConnector, selector } from '@/lib';
import * as Notifications from 'expo-notifications';
import { Linking, useColorScheme } from 'react-native';
import * as TaskManager from "expo-task-manager"

export { 
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
const [loaded, error] = useFonts({
  'roboto-regular': require('@/assets/fonts/Roboto-Regular.ttf'),
  'roboto-bold': require('@/assets/fonts/Roboto-Black.ttf'),
  'roboto-medium': require('@/assets/fonts/Roboto-Medium.ttf'),
  'roboto-thin': require('@/assets/fonts/Roboto-Thin.ttf'),
  "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
  "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
  "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
  "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
  "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
  "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
  "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
  "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
});

const ready= useIsFocused()
useEffect(() => { 
  if (error) throw error;
  if (ready&&loaded) SplashScreen.hideAsync(); 
  pusherConnector()
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    const url = response.notification.request.content.data.url;
    Linking.openURL(url);
    });
    
    
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
    console.log('Received a notification in the background!  ',data);
    // Do something with the notification data
  });

  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

  return () => subscription.remove();
}, [error,loaded]); 


  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  )
}

function RootLayoutNav() {
  const mode = selector((state) => state.theme.mode);
  const defaultMode = useColorScheme()

  const lightmode = () => {
    if (mode ==="default") return defaultMode;
     return mode; 
  }

  return (
    <ThemeProvider value={lightmode() === 'dark' ? DarkTheme : DefaultTheme}>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} /> 
      <Stack.Screen name="(server)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ presentation: 'modal' , headerShown: false }} />
      <Stack.Screen name="conversation/[friendid]" options={{ presentation: 'containedModal', headerShown: false  }} />
      <Stack.Screen name="user/[email]" options={{ presentation: 'modal', headerShown: false  }} />
      <Stack.Screen name="post/[id]" options={{ presentation: 'modal', headerShown: false  }} />
      <Stack.Screen name="settings/[setting]" options={{ presentation: 'card', headerShown: false  }} />
      <Stack.Screen name="edit-post/[postid]" options={{ presentation: 'card', headerShown: false  }} />
      <Stack.Screen name="users" options={{ presentation: 'modal' , headerShown: false }} />
    </Stack>
  </ThemeProvider>
  );
}


