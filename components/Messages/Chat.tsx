import { Text, View } from '@/components/Themed';
import UserCard from '@/components/UserCard';
import CustomButton from '../CustomButton';
import { FlatList } from 'react-native';
import { router } from 'expo-router';
import { selector } from '@/lib';

interface ChatProps {
  navigate: (userId: string) => void; 
}

const Chat: React.FC<ChatProps> = ({ navigate }) => {
  const {friends} = selector((state)=>state.profile.profile)
  
  if(!friends?.length ){
    return (
      <View className='flex-1 justify-center p-5 gap-2.5' >
        <Text className='text-sm font-rmedium' >You have no friends yet ,click to add a friend to start a conversation</Text>
        <CustomButton
         title={'Add friend'} 
         containerStyles='w-[30%] m-2.5 ' 
         handlePress={()=>router.push("/users")} 
        />
      </View>
    )
  }
  return (
    <FlatList
      data={friends}
      keyExtractor={(item: any) => item?._id}  
      renderItem={({ item }: any) => (
        <UserCard user={item}
          onSelectUser={navigate} 
          handleAddFriend={()=>{}} 
          showlastMessage
        />
      )}
    />
  );
};

export default Chat