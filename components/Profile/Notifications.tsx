import React, { useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Text, View } from '../Themed';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Switch } from 'native-base';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  content: string;
  time: string;
  read: boolean;
}

interface NotificationChannel {
  id: string;
  name: string;
  enabled: boolean;
  icon: string;
}
const notificationData: Notification[] = [
  { id: '1', type: 'like', content: 'John Doe liked your post', time: '2m ago', read: false },
  { id: '2', type: 'comment', content: 'Alice left a comment on your photo', time: '15m ago', read: false },
  { id: '3', type: 'follow', content: 'Bob started following you', time: '1h ago', read: true },
  { id: '4', type: 'message', content: 'You have a new message from Sarah', time: '3h ago', read: true },
  // Add more notifications as needed
];

const initialChannels: NotificationChannel[] = [
  { id: 'like', name: 'Likes', enabled: true, icon: 'heart' },
  { id: 'comment', name: 'Comments', enabled: true, icon: 'chatbubble' },
  { id: 'follow', name: 'Follows', enabled: true, icon: 'person-add' },
  { id: 'message', name: 'Messages', enabled: true, icon: 'mail' },
];
const NotificationItem: React.FC<{ item: Notification; onPress: () => void }> = ({ item, onPress }) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return 'heart';
      case 'comment': return 'chatbubble';
      case 'follow': return 'person-add';
      case 'message': return 'mail';
      default: return 'notifications';
    }
  };

  return (
    <Animated.View style={[styles.notificationItem, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={handlePress} style={styles.notificationContent}>
        <LinearGradient
          colors={item.read ? ['#e0e0e0', '#f5f5f5'] : ['#4c669f', '#3b5998']}
          style={styles.iconContainer}
        >
          <Ionicons name={getIcon(item.type)} size={24} color={item.read ? '#666' : '#fff'} />
        </LinearGradient>
        <View style={styles.textContainer}>
          <Text style={[styles.notificationText, !item.read && styles.unreadText]}>{item.content}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    </Animated.View>
  );
};

const ChannelToggle: React.FC<{ 
  channel: NotificationChannel; 
  onToggle: (id: string, enabled: boolean) => void 
}> = ({ channel, onToggle }) => {
  return (
    <View style={styles.channelItem}>
      <View style={styles.channelInfo}>
        <Ionicons name={channel.icon as any} size={24} color="#4c669f" style={styles.channelIcon} />
        <Text style={styles.channelName}>{channel.name}</Text>
      </View>
      <Switch
        value={channel.enabled}
        onValueChange={(enabled) => onToggle(channel.id, enabled)}
        trackColor={{ false: "#767577", true: "#4c669f" }}
        thumbColor={channel.enabled ? "#f4f3f4" : "#f4f3f4"}
      />
    </View>
  );
};
const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationData);
  const [channels, setChannels] = useState(initialChannels);
  const [showSettings, setShowSettings] = useState(false);

  const handleNotificationPress = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleChannelToggle = (id: string, enabled: boolean) => {
    setChannels(channels.map(channel => 
      channel.id === id ? { ...channel, enabled } : channel
    ));
  };

  const filteredNotifications = notifications.filter(notif => 
    channels.find(channel => channel.id === notif.type)?.enabled
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
        <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
          <Ionicons name={showSettings ? "close" : "settings-outline"} size={24} color="#4c669f" />
        </TouchableOpacity>
      </View>

      {showSettings ? (
        <ScrollView style={styles.settingsContainer}>
          <Text style={styles.settingsHeader}>Notification Settings</Text>
          {channels.map(channel => (
            <ChannelToggle 
              key={channel.id} 
              channel={channel} 
              onToggle={handleChannelToggle} 
            />
          ))}
        </ScrollView>
      ) : (
        <>
          {filteredNotifications.length > 0 ? (
            <FlatList
              data={filteredNotifications}
              renderItem={({ item }) => (
                <NotificationItem item={item} onPress={() => handleNotificationPress(item.id)} />
              )}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={64} color="#888" />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 16,
  },
  notificationItem: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
  },
  settingsContainer: {
    flex: 1,
  },
  settingsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  channelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelIcon: {
    marginRight: 12,
  },
  channelName: {
    fontSize: 16,
  },
});


export default Notifications;