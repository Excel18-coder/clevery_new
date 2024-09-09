import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import notifee, { AndroidImportance, AndroidStyle, AndroidCategory, EventType } from '@notifee/react-native';

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
    
  return token?.data;
}


export enum NOTIFICATION_CHANNELS {
  ADDED_TO_SERVER ='',
  REMOVED_FROM_SERVER='',
  MENTIONED='',
  FRIEND_REQUEST_RECEIVED='',
  FRIEND_REQUEST_ACCEPTED='',
  MESSAGE_RECEIVED='',
  REACTION_RECEIVED='',
  ROLE_ASSIGNED='',
  ROLE_REMOVED='',
  SERVER_ANNOUNCEMENT='',
  SERVER_MEMBER_ADDED='',
  EVENT_REMINDER='',
  DIRECT_MESSAGE='',
  CHANNEL_INVITATION='',
  STREAM_STARTED='',
  ACHIEVEMENT_UNLOCKED='',
  SYSTEM_UPDATE='',
  FRIEND_ADDED='',
  POST_LIKED='',
  POST_SAVED='',
  POST_COMMENTED='',
  ONLINE_FRIENDS=''
}


export  const showMessageNotification = async (conversationId: string, senderName: string, messageContent: string, senderImage: string): Promise<void> => {
    try {
      const channelId = await notifee.createChannel({
        id: NOTIFICATION_CHANNELS['DIRECT_MESSAGE'],
        name: 'New Messages',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      await notifee.displayNotification({
        title: `New message from ${senderName}`,
        body: messageContent,
        android: {
          channelId,
          largeIcon: senderImage,
          importance: AndroidImportance.HIGH,
          style: {
            type: AndroidStyle.MESSAGING,
            person: {
              name: senderName,
              icon: senderImage,
            },
            messages: [
              {
                text: messageContent,
                timestamp: Date.now(),
              },
            ],
          },
          category: AndroidCategory.MESSAGE,
          actions: [
            {
              title: 'Reply',
              input: {
                placeholder: 'Type your reply...',
                allowFreeFormInput: true,
              },
              pressAction: {
                id: 'reply',
              },
            },
          ],
        },
        data: { conversationId },
      });
      console.log('Notification displayed for new message');
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };