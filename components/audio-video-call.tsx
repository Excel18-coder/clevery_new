import { useEffect, useState } from 'react';
import { CallContent, CallType, MemberRequest, StreamCall, StreamVideo, StreamVideoClient, User, VideoRendererProps, useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { requestAndUpdatePermissions } from '@/lib/utils';
import { RTCView } from '@stream-io/react-native-webrtc';
import { View } from './Themed';
import { useProfileStore } from '@/lib';
import { useAutoEnterPiPEffect } from '@stream-io/video-react-native-sdk';

import  uuid from 'react-native-uuid';
import { LocalVideoRenderer } from './calls/local-video';


interface AudioVideo {
  channelid:string;
  callType:string;
  video?:boolean;
  members?:MemberRequest[]
}

export default function AudioVideoComponent({
  channelid,
  callType,
  members,
  video
}:AudioVideo) {
  const [client, setClient] = useState<StreamVideoClient>();
  
useAutoEnterPiPEffect();

const { profile } = useProfileStore();

const user: User = { id: profile._id };
const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!

const fetchAndSetProfile = async () => {
  try {
    const myClient = new StreamVideoClient({ apiKey, user, token: profile.streamToken! });
    setClient(myClient);

  } catch (error) {
    console.error(error);
  }
};

const call = client?.call(callType, uuid.v4() as string);

  useEffect(() => {
    requestAndUpdatePermissions()
    fetchAndSetProfile();
    
    return () => {
      client?.disconnectUser();
      call?.endCall()
      setClient(undefined);
    };
  }, []);

  
  useEffect(() => {
    const getOrCreateCall = async () => {
      try {
        await call?.getOrCreate();
      } catch (error) {
        console.error('Failed to get or create call', error);
      }
    };

    getOrCreateCall();
  }, [call]);

  if(!client || !call) return


const CustomVideoRenderer = ({ participant }: VideoRendererProps) => {
  const { videoStream } = participant;
  console.log("Video stream ")
  return (
    <View className="absolute inset-0 flex items-center justify-center bg-gray-800">
      <LocalVideoRenderer/>
    </View>
  );
};
  return (
    <StreamVideo client={client!}>
      <StreamCall call={call}>
        <View className='flex-1'>
          <CallContent VideoRenderer={CustomVideoRenderer} />
        </View>
      </StreamCall>
    </StreamVideo>
  );
};
