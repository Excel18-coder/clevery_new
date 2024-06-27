import { memo } from 'react';
import {
  FlatList,
} from 'react-native';
import { Text, View } from '../Themed';

interface FriendRequest {
  id: string;
  username: string;
}

interface FriendRequestsProps {
  friendRequests: FriendRequest[];
}

const FriendRequests: React.FC<FriendRequestsProps> = ({
  friendRequests,
}) => {

  
  const onAcceptPress=(id: string) => {
    
  }
  const onRejectPress=(id: string) => {
    
  }

  return (
    <View className='flex-1 p-4 mt-7.5'>
      {friendRequests.length === 0 && <Text
       className='text-sm mb-4 text-center font-rregular'>No friend requests at the moment.</Text>}
      {/* <FlatList
        data={friendRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      /> */}
    </View>
  );
};


export default memo(FriendRequests);