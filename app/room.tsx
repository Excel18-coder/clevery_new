import { View, Text } from 'react-native'
import AudioVideoComponent from '@/components/audio-video-call'

const Room = () => {
  return (
    <View>
      <AudioVideoComponent
        channel='test-channel'
        video
      />
    </View>
  )
}

export default Room