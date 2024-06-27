import { TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';

import { Text, View } from '@/components/Themed';
import { formatDateString } from '@/lib/utils';
import { selector, urlForImage } from '@/lib';
import { Image } from 'expo-image';

interface Message {
  _id: string;
  text: string;
  sender: {
    image: string;
    name: string;
  };
  timestamp: string;
  isSeparator?: boolean;
  image?: string;
  reactions?:string;
}

interface MessagesProps {
   item: Message ,
   onDelete:(key:string)=>void,
   onLongPress:()=>void;
   onPress:()=>void
  }

const MessagesContainer = ({ item ,onDelete,onLongPress,onPress}: MessagesProps) => {
  const {text, sender, timestamp, isSeparator, image,reactions } = item;
  const formattedTimestamp = format(parseISO(timestamp), 'hh:mm a');
  const { mode } = selector((state) => state.theme);
  
  
  if (isSeparator) {
    return (
      <View
       className='items-center  justify-center my-[5px] border-b-[.3px] border-gray-200'
       >
        <Text 
        className={`text-${mode === 'light' ? 'white' : 'gray-800'}
        font-medium text-[10px] z-10 mb-[-10px] text-gray-500 py-1 px-2 font-rregular`}
         >
          {formatDateString(timestamp)}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity className='flex flex-row items-start mb-[15px] px-[5px]'
    activeOpacity={1}
     onLongPress={()=>onLongPress()}
     onPress={()=>onPress()}
    >
      <TouchableOpacity>
        <Image
          source={{ uri: urlForImage(sender?.image).width(100).url() }}
          className='rounded-2xl border border-gray-300 h-10 w-10 mr-2.5'
        />
      </TouchableOpacity>
      <View className='flex-col'>
        <View className='flex-row items-center mb-1.5'>
          <Text className='font-rmedium mr-1.5 text-light' >
            {sender.name}
          </Text>
          <Text className='font-rmedium text-xs text-[#666] '>{formattedTimestamp}</Text>
        </View>
        {image && (<Image source={{ uri: urlForImage(image).width(280).height(150).url() }} className='w-[280px] h-[150px] border border-gray-300 rounded-[10px]'/>
        )}
        <Text className='text-sm mr-10 font-rregular mb-1.5'>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default MessagesContainer;