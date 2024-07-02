import { Image } from 'expo-image'

import { Text, View } from '@/components/Themed'
import { urlForImage } from '@/lib'
import { image } from '@/types'

interface Props {
  channelName:string,
  description:string,
  channelIcon:image
  messages:any
}
const ChannelHeader = ({channelName,description,channelIcon,messages}:Props) => {

  return (
    <View className={`p-2.5 w-full mt-${!!messages?.length?'auto':'[100%]'}`} >
    <Image
      source={{ uri:urlForImage(channelIcon).width(100).url()}} 
      className='w-[60px] h-[60px] rounded-[20px]'
     />
      <Text className='font-rbold text-[30px]'>Welcome to #{channelName}</Text>
      <Text className='font-rregular text-[10px] ' >{description}</Text>
    </View>
  )
}

export default ChannelHeader