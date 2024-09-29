import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { Text, Button, View } from '@/components';
import Animated, {
  FadeIn, 
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal'; 
import { Image } from 'expo-image';

// Mock data for linked devices (unchanged)
const initialDevices = [
  { id: '1', name: 'iPhone 12', type: 'mobile', lastActive: '2 hours ago' },
  { id: '2', name: 'MacBook Pro', type: 'desktop', lastActive: 'Active now' },
  { id: '3', name: 'iPad Air', type: 'tablet', lastActive: '3 days ago' },
];

const DeviceItem = ({ device, onRemove, index }) => {
  const theme = useTheme();
  const offset = useSharedValue(0);
  
  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile': return 'smartphone';
      case 'desktop': return 'monitor';
      case 'tablet': return 'tablet';
      default: return 'device-unknown';
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const handlePressIn = () => {
    offset.value = withSpring(-20);
  };

  const handlePressOut = () => {
    offset.value = withSpring(0);
  };

  return (
    <Animated.View 
      entering={SlideInRight.delay(index * 100)}
      exiting={SlideOutLeft}
      className="flex-row items-center justify-between py-4 border-b border-gray-200"
      style={animatedStyle}
    >
      <TouchableOpacity 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="flex-row items-center flex-1"
      >
        <View className="bg-blue-500 p-3 rounded-lg mr-4">
          <Feather name={getDeviceIcon(device.type)} size={24} color={theme.colors.primary} />
        </View>
        <Animated.View>
          <Text className="text-base font-rmedium">{device.name}</Text>
          <Text className="text-sm text-gray-500">{device.lastActive}</Text>
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onRemove(device.id)} className="p-2">
        <Feather name="x-circle" size={24} color="red" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const AnimatedButton = ({ onPress, children, className }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View className={className} style={animatedStyle}>{children}</Animated.View>
    </TouchableOpacity>
  );
};

const SecurityTip = ({ icon, text }) => (
  <Animated.View className="flex-row items-center mb-3">
    <Animated.View className="bg-yellow-400 p-2 rounded-lg mr-3">
      <Feather name={icon} size={18} color="white" />
    </Animated.View>
    <Animated.Text className="text-sm flex-1 font-rregular">{text}</Animated.Text>
  </Animated.View>
);

const StatCard = ({ title, value, icon }) => (
  <View className="bg-white rounded-lg p-4 mb-4 shadow">
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-sm text-gray-500 font-rregular">{title}</Text>
      <Feather name={icon} size={20} color="#3B82F6" />
    </View>
    <Text className="text-2xl font-rbold">{value}</Text>
  </View>
);

const ActivityLog = ({ activities }) => (
  <View className="mb-6">
    <Text className="text-lg font-rmedium mb-3">Recent Activity</Text>
    {activities.map((activity, index) => (
      <View key={index} className="flex-row items-center mb-2">
        <View className="bg-blue-500 p-2 rounded-lg mr-3">
          <Feather name={activity.icon} size={24} color="gray" />
        </View>
        <View>
          <Text className="text-sm font-rmedium">{activity.description}</Text>
          <Text className="text-xs text-gray-500">{activity.time}</Text>
        </View>
      </View>
    ))}
  </View>
);

const DevicesPage = () => {
  const [devices, setDevices] = useState(initialDevices);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const theme = useTheme();
  const scrollY = useSharedValue(0);

  const removeDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  const linkNewDevice = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const addNewDevice = () => {
    const newDevice = {
      id: `${devices.length + 1}`,
      name: `New Device ${devices.length + 1}`,
      type: 'mobile',
      lastActive: 'Just now'
    };
    setDevices([...devices, newDevice]);
    closeModal();
  };

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 100], [1, 0], Extrapolate.CLAMP),
    transform: [{ translateY: interpolate(scrollY.value, [0, 100], [0, -50], Extrapolate.CLAMP) }],
  }));

  const recentActivities = [
    { icon: 'log-in', description: 'New login from MacBook Pro', time: '2 hours ago' },
    { icon: 'shield', description: 'Security settings updated', time: 'Yesterday' },
    { icon: 'smartphone', description: 'iPhone 12 disconnected', time: '3 days ago' },
  ];

  return (
    <>
      <Animated.View style={[headerStyle, { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: 20, backgroundColor: theme.colors.background }]}>
        <Text className="text-3xl font-rbold">Devices</Text>
      </Animated.View>
      
      <Animated.ScrollView 
        className="flex-1 px-5"
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={{ paddingTop: 70 }}
        scrollEventThrottle={16}
      >
        <Animated.View entering={FadeIn.delay(300)} className="bg-blue-100 rounded-lg p-4 mb-6">
          <Text className="text-lg font-rmedium mb-2">Device Management</Text>
          <Text className="text-sm font-rregular">
            Monitor and manage your connected devices. Ensure the security of your account by reviewing active sessions and removing unfamiliar devices.
          </Text>
        </Animated.View>

        <View className="flex-row justify-between mb-6">
          <View className="w-[48%]">
            <StatCard title="Active Devices" value={devices.length} icon="smartphone" />
          </View>
          <View className="w-[48%]">
            <StatCard title="Last Login" value="2h ago" icon="clock" />
          </View>
        </View>

        <AnimatedButton onPress={linkNewDevice} className="bg-blue-500 rounded-lg py-3 mb-6">
          <Animated.Text className="text-white text-center font-rmedium">Link New Device</Animated.Text>
        </AnimatedButton>

        <ActivityLog activities={recentActivities} />

        <Animated.View entering={FadeIn.delay(600)} className="mb-6">
          <Text className="text-xl font-rmedium mb-3">Your Devices</Text>
          {devices.map((device, index) => (
            <DeviceItem key={device.id} device={device} onRemove={removeDevice} index={index} />
          ))}
        </Animated.View>

        <Animated.View entering={FadeIn.delay(900)} className="bg-yellow-100 rounded-lg p-4 mb-6">
          <Text className="text-lg font-rmedium mb-3">Security Tips</Text>
          <SecurityTip icon="lock" text="Enable two-factor authentication for an extra layer of security." />
          <SecurityTip icon="refresh-cw" text="Regularly review and remove devices you no longer use." />
          <SecurityTip icon="user-x" text="Never share your account credentials with anyone." />
        </Animated.View>
      </Animated.ScrollView>

      <Modal isOpen={isModalVisible} onClose={closeModal}>
        <ModalContent className="bg-white rounded-3xl">
          <ModalHeader>
            <Text className="text-xl font-rbold">Link New Device</Text>
            <ModalCloseButton onPress={closeModal} />
          </ModalHeader>
          <ModalBody>
            <Text className="text-base mb-4 font-rregular">Scan this QR code with your new device to link it to your account:</Text>
            <Animated.View className="items-center justify-center" entering={FadeIn.delay(300)}>
              <Image
                source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://clevery.vercel.app/' }}
                style={{ width: 200, height: 200, borderRadius: 12 }}
              />
            </Animated.View>
          </ModalBody>
          <ModalFooter>
            <AnimatedButton onPress={addNewDevice} className="bg-blue-500 rounded-lg py-2 px-4 w-full">
              <Text className="text-white text-center font-rmedium">Link Device</Text>
            </AnimatedButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DevicesPage;