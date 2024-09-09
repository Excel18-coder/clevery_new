import { memo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import { showToastMessage, useCreateChannel } from '@/lib';
import { Loader,View,Create } from '@/components';
import ToastAlert from '@/components/alert';
import { ChannelType } from '@/types';

interface newChannel {
  name: string;
  description: string;
  channelType: string;
}

const CreateChannel: React.FC = () => {
  const [newChannel, setNewChannel] = useState<newChannel>({
    name: ``,
    description: '',
    channelType: 'TEXT',
  });
  const {serverid} = useLocalSearchParams()
  const { 
    mutateAsync: createChannel,
    isPending:creatingServer ,
    error 
  } = useCreateChannel(serverid as string);

  const handleSubmit = async () => {
    const {channelType,description,name} =newChannel
    
    try {
      if(!name) return showToastMessage('Please provide the channel name' )
      if(!description) return showToastMessage('Please provide the channel description' )
      if(serverid === '' ) return showToastMessage('No server id provided' );

      console.log(newChannel)
      const res = await createChannel({
        name,
        description,
        type:ChannelType[channelType],
        isPrivate:false
      });
      
      router.push(`channel/${res.id}`)
    } catch (error:any) {
      console.log(error.message)
      showToastMessage('Error creating server:' );
      return <ToastAlert id='channel' title='Failed to create channel' description={error.message}/>
    }
  };
  
if(creatingServer)return <Loader loadingText='Creating your channel'/>

  return (
    <View className='flex-1 '>
      <Create
        fields={newChannel}
        setFields={setNewChannel}
        handleSubmit={handleSubmit}
        loading={creatingServer}
        type='channel'
      /> 
    </View>
  );
};


export default memo(CreateChannel)