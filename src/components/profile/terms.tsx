import { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Text, View } from '@/components/themed';

const TOSSection = ({ title, content, icon }) => {
  const [expanded, setExpanded] = useState(false);
  const rotateValue = useSharedValue(0);

  const toggleExpand = () => {
    setExpanded(!expanded);
    rotateValue.value = withSpring(expanded ? 0 : 1);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateValue.value * 180}deg` }],
    };
  });

  return (
    <View className="mb-4 bg-white rounded-lg shadow-md overflow-hidden">
      <Pressable onPress={toggleExpand} className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center">
          <Feather name={icon} size={24} color="#6B46C1" className="mr-3" />
          <Text className="text-lg font-rmedium">{title}</Text>
        </View>
        <Animated.View style={animatedStyle}>
          <Feather name="chevron-down" size={24} color="#6B46C1" />
        </Animated.View>
      </Pressable>
      {expanded && (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="p-4 bg-purple-50">
          <Text className="text-base font-rregular">{content}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const TermsOfServicePage = () => {
  const theme = useTheme();

  const tosSections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing or using our app, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.",
      icon: "check-circle"
    },
    {
      title: "Use License",
      content: "We grant you a limited, non-exclusive, non-transferable, revocable license to use our app for your personal, non-commercial purposes. This license is subject to these Terms of Service.",
      icon: "key"
    },
    {
      title: "User Account",
      content: "To access certain features of our app, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
      icon: "user"
    },
    {
      title: "Intellectual Property",
      content: "The app and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.",
      icon: "briefcase"
    },
    {
      title: "User-Generated Content",
      content: "You retain all rights to any content you submit, post or display on or through the app. By submitting, posting or displaying content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate and distribute it.",
      icon: "edit"
    },
    {
      title: "Prohibited Uses",
      content: "You agree not to use the app for any unlawful purpose or to violate any laws in your jurisdiction. This includes, but is not limited to, copyright laws and laws regarding the export of data.",
      icon: "slash"
    },
    {
      title: "Termination",
      content: "We may terminate or suspend your account and bar access to the app immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.",
      icon: "x-octagon"
    },
    {
      title: "Limitation of Liability",
      content: "In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the app.",
      icon: "shield-off"
    },
    {
      title: "Changes to Terms",
      content: "We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.",
      icon: "refresh-cw"
    }
  ];

  return (
    <ScrollView 
      className="flex-1 p-5" 
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Animated.View entering={FadeIn} className="mb-6">
        <Text className="text-3xl font-rbold mb-2">Terms of Service</Text>
        <Text className="text-base font-rregular text-gray-600">
          Please read these terms carefully before using our app. By using the app, you agree to be bound by these terms.
        </Text>
      </Animated.View>

      <View className="bg-purple-100 rounded-lg p-4 mb-6">
        <Text className="text-lg font-rmedium mb-2">Last Updated: September 1, 2024</Text>
        <Text className="text-base font-rregular">
          These Terms of Service govern your use of our app and provide important information about your rights and obligations.
        </Text>
      </View>

      {tosSections.map((section, index) => (
        <TOSSection key={index} {...section} />
      ))}

      <View className="mt-6 bg-green-100 rounded-lg p-4">
        <Text className="text-lg font-rmedium mb-2">Contact Us</Text>
        <Text className="text-base font-rregular">
          If you have any questions about these Terms of Service, please contact us at support@clevery.com.
        </Text>
      </View>
    </ScrollView>
  );
};

export default TermsOfServicePage;