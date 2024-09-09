import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Text, View } from '../themed'

const ChannelHeader = ({ channelName }: { channelName: string }) => {
  return (
    <View className='rounded-[5px] z-30 pb-2 justify-between flex-row border-b-[.5px] '>
      <Ionicons name="arrow-back" size={24} color="#007aff"
        onPress={() => router.back()} className='absolute left-[15px] mr-2.5 z-30 mb-2.5 rounded-[5px]' />
      <Text className='ml-[30px] mt-[5px] text-lg font-pbold'>
        #{channelName}
      </Text>
    </View>
  )
}

export default ChannelHeader
