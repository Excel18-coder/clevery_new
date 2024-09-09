import { useState, useRef, useEffect } from 'react';
import { TextInput, Pressable, Linking, Text as RNText, View as RNView, KeyboardAvoidingView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeOut,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import Image from '@/components/image';
import { Text, View } from '@/components/themed'; 
import { formatDateString } from '@/lib';
import MessageOptionsPopup from './options';

interface Message {
  id: string;
  createdAt: string;
  text: string;
  timestamp: string;
  sender: {
    image: string;
    name: string;
    isAdmin?: boolean;
  };
  isSeparator?: boolean;
  file?: string;
  reactions?: { [key: string]: string[] };
  replyTo?: {
    id: string;
    text: string;
    sender: {
      name: string;
    };
  };
}


const MessageSeparator = ({ timestamp }: { timestamp: string }) => (
  <RNView className='flex-row items-center my-3'>
    <RNView className='flex-1 h-[0.35px] bg-gray-400' />
    <Text className="font-rregular mx-2 text-[8px]">
      {formatDateString(timestamp)}
    </Text>
    <RNView className='flex-1 h-[0.35px] bg-gray-400' />
  </RNView>
);
const MessageItem: React.FC<{ 
  message: Message; 
  onReply: (text: string, messageId: string) => void;
  onReact: (reaction: string, messageId: string) => void;
  previousMessage?: Message;
}> = ({ message, onReply, onReact, previousMessage }) => {
  const [replyText, setReplyText] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isReplying, setIsReplying] = useState(false);
const [isPopupVisible, setIsPopupVisible] = useState(false);


const messageOptions = [
  { icon: 'at-sign', label: 'Mention', onPress: () => { /* Handle mention */ } },
  { icon: 'copy', label: 'Copy', onPress: () => { /* Handle copy */ } },
  { icon: 'smile', label: 'React', onPress: () => { /* Handle react */ } },
  { icon: 'pin', label: 'Pin', onPress: () => { /* Handle pin */ } },
  // Add more options as needed
];

  const handleReply = () => {
    if (!replyText.trim()) return;
    setIsReplying(true);
    onReply(replyText, message.id);
  }
   const gesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX + context.value.x;
      translateX.value = Math.max(0, Math.min(translateX.value, 100));
    })
    .onEnd(() => {
      'worklet';
      if (translateX.value > 50) {
        runOnJS(setIsReplying)(true);
        runOnJS(handleReply)();
      }
      translateX.value = withSpring(0, { damping: 15 });
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rReplyStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 100], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateX: interpolate(translateX.value, [0, 100], [-100, 0], Extrapolation.CLAMP) },
    ],
  }));

  useEffect(() => {
    if (isReplying) {
      if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    }
  }, [isReplying]);

  const renderTextWithMentionsAndLinks = (text: string) => {
    const parts = text.split(/(@\w+)|(https?:\/\/[^\s]+)/g);
    
    return parts.map((part, index) => {
      if (part?.startsWith('@')) {
        return <RNText key={index} className="text-blue-500 font-rmedium">{part}</RNText>;
      } else if (part?.startsWith('http')) {
        return (
          <RNText
            key={index}
            className="text-blue-500 underline font-rmedium"
            onPress={() => Linking.openURL(part)}
          >
            {part}
          </RNText>
        );
      }
      return <Text key={index} className="font-rregular">{part}</Text>;
    });
  };

  const renderFile = () => {
    if (!message.file) return null;
    if (message.file.match(/\.(jpeg|jpg|gif|png)$/i)) {
      return <Image source={message.file} width={270} height={288} style="w-full h-60 border border-gray-300 rounded-[10px] shadow-lg" />
    }
    return (
      <View className="flex-row items-center mt-2 bg-gray-100 p-2 rounded-lg">
        <Feather name="file" size={24} color="#4B5563" />
        <Text className="ml-2 text-gray-600 font-rmedium">Attached file</Text>
      </View>
    );
  };

  const renderReactions = () => {
    if (!message.reactions) return null;
    return (
      <View className="flex-row flex-wrap mt-2">
        {Object.entries(message.reactions).map(([reaction, users]) => (
          <Pressable
            key={reaction}
            className="bg-gray-100 px-2 py-1 rounded-full mr-2 mb-2 flex-row items-center"
            onPress={() => onReact(reaction, message.id)}
          >
            <Text className="mr-1">{reaction}</Text>
            <Text className="text-xs text-gray-600 font-rmedium">{users.length}</Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const renderReplyPreview = () => {
    if (!message.replyTo) return null;
    return (
      <View className="bg-gray-100 p-2 rounded-lg mb-2">
        <Text className="text-xs text-gray-500 font-rmedium">
          Replying to {message.replyTo.sender.name}
        </Text>
        <Text className="text-sm text-gray-700 font-rregular" numberOfLines={1}>
          {message.replyTo.text}
        </Text>
      </View>
    );
  };

  const isNewSender = !previousMessage || previousMessage.sender.name !== message.sender.name;

  
  if (message.isSeparator) {
    return <MessageSeparator timestamp={message?.timestamp} />;
  }

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View className="flex-row mb-1">
        <Animated.View style={[rReplyStyle]} className="absolute left-0 h-full justify-center">
          <View className="bg-blue-500 p-2 rounded-r-lg">
            <Feather name="corner-up-left" size={24} color="white" />
          </View>
        </Animated.View>
        <Animated.View style={[rStyle]} className="flex-1">
          <Pressable
            onLongPress={() => {
              longPressTimeout.current = setTimeout(() => setIsReplying(true), 500);
            }}
            onPressOut={() => {
              if (longPressTimeout.current) {
                clearTimeout(longPressTimeout.current);
              }
            }}
          >
            <View className="px-4">
              {isNewSender && (
                <View className="flex-row items-center mt-2 mb-1">
                  
                  <Image
                    source={message.sender?.image}
                    width={80}
                    height={80}
                    style="rounded-2xl border border-gray-300 h-10 w-10 mr-3"
                  />
                  <Text className="ml-2 font-rbold text-gray-800">{message.sender.name}</Text>
                  {message.sender.isAdmin && (
                    <Feather name="shield" size={14} color="#4B5563" className="ml-1" />
                  )}
                </View>
              )}
              <View className="flex-row">
                {!isNewSender && <View className="w-6" />}
                <View className="flex-1">
                  {renderReplyPreview()}
                  <Text className="text-gray-700 mb-1">{renderTextWithMentionsAndLinks(message.text)}</Text>
                  {renderFile()}
                  {renderReactions()}
                </View>
              </View>
              <Text className="text-xs text-gray-500 font-rregular mt-1">{message.timestamp}</Text>
            </View>
          </Pressable>
          {showReactions && (
            <Animated.View 
              entering={FadeIn.duration(200)} 
              exiting={FadeOut.duration(200)}
              className="flex-row justify-around mt-2 bg-gray-100 p-2 rounded-lg mx-4"
            >
              {['👍', '❤️', '😂', '😮', '😢', '😡'].map(reaction => (
                <Pressable
                  key={reaction}
                  onPress={() => {
                    onReact(reaction, message.id);
                    setShowReactions(false);
                  }}
                >
                  <Text className="text-2xl">{reaction}</Text>
                </Pressable>
              ))}
            </Animated.View>
          )}
          {isReplying && (
            <Animated.View 
              entering={FadeIn.duration(200)} 
              exiting={FadeOut.duration(200)}
              className="mt-2 px-4 py-2 rounded-lg flex-1 flex-row items-center"
            >
              <TextInput
                className="bg-gray-100 p-2 rounded-lg font-rregular flex-1 mr-2"
                placeholder="Type your reply..."
                value={replyText}
                onChangeText={setReplyText}
              />
              <Pressable
                className="bg-blue-500 p-2 rounded-lg items-center"
                onPress={() => {
                  onReply(replyText, message.id);
                  setReplyText('');
                  setIsReplying(false);
                  translateX.value = withSpring(0, { damping: 15 });
                }}
              >
                <Feather name='send' size={24} color="white" />
              </Pressable>
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default MessageItem;