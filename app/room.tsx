import { View, Text } from 'react-native'
import AudioVideoComponent from '@/components/audio-video-call'

const Room = () => {
  return (
    <View className='flex-1'>
      <AudioVideoComponent
        channelid='test-channel'
        callType='default'
        video
      />
    </View>
  )
}

export default Room