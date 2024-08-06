import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { 
  Call,
  CallContent, 
  MemberRequest, 
  StreamCall, 
  StreamVideo, 
  StreamVideoClient, 
  User, 
  VideoRendererProps, 
  useAutoEnterPiPEffect 
} from '@stream-io/video-react-native-sdk';
import { Text, View } from './Themed';
import { useProfileStore } from '@/lib';
import { requestAndUpdatePermissions } from '@/lib/utils';
import uuid from 'react-native-uuid';
import { AntDesign } from '@expo/vector-icons';
import CustomVideoRenderer from './calls/video-render';

interface AudioVideoProps {
  channelName: string;
  callType: string;
  video?: boolean;
  members?: MemberRequest[];
}

export default function AudioVideoComponent({
  channelName,
  callType,
  members,
  video
}: AudioVideoProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useAutoEnterPiPEffect();

  const { profile } = useProfileStore();
  const user: User = { id: profile.id };
  const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!;
  
  const initializeClient = useCallback(async () => {
    try {
      setIsLoading(true);
      await requestAndUpdatePermissions();
      const myClient = new StreamVideoClient({ apiKey, user, token: profile.streamToken! });
      setClient(myClient);
      const newCall = myClient.call(callType, uuid.v4() as string);
      await newCall.getOrCreate();
      setCall(newCall);
    } catch (err) {
      console.error('Error initializing client:', err);
      setError('Failed to initialize video call. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [profile, callType]);

  useEffect(() => {
    initializeClient();

    return () => {
      if (client) {
        client.disconnectUser();
        if (call) call.endCall();
        setClient(null);
        setCall(null);
      }
    };
  }, [initializeClient]);

  const CustomCallTopView = () => (
    <View className="absolute top-0 left-0 right-0 flex-row justify-between items-center p-4 bg-black bg-opacity-50">
      <Text className="text-white font-bold text-lg">{channelName}</Text>
      <TouchableOpacity
        onPress={() => call?.endCall()}
        className="bg-red-500 rounded-full p-2"
      >
        <AntDesign name="phone" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  // const CustomVideoRenderer = ({ participant }: VideoRendererProps) => (
  //   <View className="flex-1 rounded-lg overflow-hidden">
  //     {/* Implement your custom video renderer here */}
  //     <Text className="text-white text-center absolute bottom-2 left-0 right-0">
  //       {participant.name || participant.userId}
  //     </Text>
  //   </View>
  // );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="text-white mt-4">Initializing call...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <StatusBar barStyle="light-content" />
        <AntDesign name="warning" size={48} color="#FFC107" />
        <Text className="text-white mt-4 text-center px-6">{error}</Text>
        <TouchableOpacity
          onPress={initializeClient}
          className="mt-6 bg-blue-500 py-3 px-6 rounded-full"
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!client || !call) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />
      <StreamVideo client={client}>
        <StreamCall call={call}>
        <CallContent 
          VideoRenderer={(props) => <CustomVideoRenderer participant={props.participant} />}
          CallTopView={CustomCallTopView}
        />
        </StreamCall>
      </StreamVideo>
    </SafeAreaView>
  );
}