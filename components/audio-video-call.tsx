import * as React from 'react';
import {
  View,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { useEffect } from 'react';
import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
} from '@livekit/react-native';
import { Track, } from 'livekit-client';
import { endpoint } from '@/lib';
import Loader from './Loader';

interface AudioVideo {
  channel:string,
  video:boolean
}

export default function AudioVideoComponent({
  channel,
  video
}:AudioVideo) {
  const [token, setToken] = React.useState('')
  
  useEffect(() => {
    let start = async () => {
      await AudioSession.startAudioSession();
      console.log(await AudioSession.getAudioOutputs())
      try {
        const resp = await fetch(`${endpoint}/livekit/token?room=${channel}&username=${"dean"}`)
        const data = await resp.json()
        setToken(data?.token)
          
      } catch (e) {
        console.log(e)
      }
    };

    start();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  if(!token) return<Loader loadingText="We're creating your room "/>
  return (
    <LiveKitRoom
      serverUrl={process.env.EXPO_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true} screen
      options={{
        adaptiveStream: { pixelDensity: 'screen' },
      }}
      audio={true}
      video={true}
    >
      
      <RoomView />
    </LiveKitRoom>
  );
};

const RoomView = () => {
  // Get all camera tracks.
  const tracks = useTracks([Track.Source.Camera]);

  const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({item}) => {
    
    if(isTrackReference(item)) {
      return (<VideoTrack trackRef={item} style={{height:500}} />)
    } else {
      return (<View style={{height:300}} />)
    }
  };

  return (
    <View className='flex-1 items-stretch justify-center'>
      <FlatList
        data={tracks}
        renderItem={renderTrack}
      />
    </View>
  );
};

