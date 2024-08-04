import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync();
    
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token?.data;
}

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const { data } = notification.request.content;
    
    // If there's an image URL in the notification data, download it
    let attachments = [];
    if (data && data.senderImage) {
      const imageAsset = await downloadAndSaveImage(data.senderImage);
      if (imageAsset) {
        attachments.push(imageAsset);
      }
    }

    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      attachments,
    };
  },
});

async function downloadAndSaveImage(url: string): Promise<string | null> {
  try {
    const { uri } = await FileSystem.downloadAsync(
      url,
      FileSystem.cacheDirectory + 'temp_notification_image.jpg'
    );
    return uri;
  } catch (error) {
    console.error('Error downloading image:', error);
    return null;
  }
}