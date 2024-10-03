import React, { useState } from 'react';

import { Message as MessageType } from '@/types';
import { View } from '@/components/themed';
import PopupComponent from './popup';
import MessageItem from './item';
import Header from '../header';
import Animated from 'react-native-reanimated';

type Props = {
  currentChat: any
  isChannel?: boolean
  messages: MessageType[]
  setNewMessage: (text: string) => void; 
};
const MessagesContainer: React.FC<Props> = ({
  messages,
  isChannel,
  currentChat,
  setNewMessage,
}) => {
  const [popupVisible, setPopupVisible] = useState(false);

  const closePopup = () => setPopupVisible(false);

  const handleReply = (replyText, messageId) => {
    console.log(replyText, messageId);
    //TODO: Handle the reply logic here
  };

  const handleReact = (reaction, messageId) => {
    console.log(reaction, messageId);
    //TODO: Handle the reaction logic here
  };
  
  return (
    <View className="flex-1">
      <Animated.FlatList
        data={messages}
        renderItem={({ item }: { item: any }) => (
          <MessageItem
            message={item}
            onReply={handleReply}
            onReact={handleReact}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <Header
            name={currentChat?.name || currentChat?.user?.name}
            created={currentChat?.createdAt}
            description={currentChat?.description}
            image={currentChat?.user?.image}
            isChannel={isChannel}
          />
        )}
      />
      <PopupComponent isVisible={popupVisible} onClose={closePopup} username='Clevery' setMessage={setNewMessage} />
    </View>
  );
};

export default React.memo(MessagesContainer);