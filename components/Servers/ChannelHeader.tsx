import { Text, View } from '../Themed'
import { urlForImage } from '../../lib'
import { image } from '../../types'
import { Image } from 'expo-image'

interface Props {
  channelName:string,
  description:string,
  channelIcon:image
  messages:any
}
const ChannelHeader = ({channelName,description,channelIcon,messages}:Props) => {

  return (
    <View className={`p-2.5 w-full mt-${!messages||messages===null||messages?.length<1 ?'[100%]':'auto'}`} >
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