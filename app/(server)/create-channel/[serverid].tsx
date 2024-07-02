import { memo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Toast } from 'native-base';

import { selector,showToastMessage, useCreateChannel } from '@/lib';
import { Loader,View,Create } from '@/components';
import ToastAlert from '@/components/toast-alert';

interface newChannel {
  name: string;
  description: string;
  channelType: string;
}

const CreateChannel: React.FC = () => {
  const profile = selector((state) => state.profile.profile);
  const [newChannel, setNewChannel] = useState<newChannel>({
    name: `${profile.name}'s channel`,
    description: '',
    channelType: 'TEXT',
  });
  const {serverid} = useLocalSearchParams()
  const { 
    mutateAsync: createChannel,
    isPending:creatingServer ,
    error 
  } = useCreateChannel();

  const handleSubmit = async () => {
    const {channelType:type,description,name} =newChannel
    
    try {
      if(!name) return Toast.show({title:'Please provide the channel name',placement:"top"})
      if(!description) return Toast.show({title:'Please provide the channel description',placement:"top"})
      if(serverid === '' ) return Toast.show({title:'No server id provided',placement:"top"});

      const res = await createChannel({
        serverId:serverid as string,
        name,
        description,
        type
      });
      console.log(res)
    } catch (error:any) {
      console.log(error.message)
      Toast.show({title:'Error creating server:',placement:"top"});
      return <ToastAlert id='channel' title='Failed to create channel' description={error.message}/>
    }
  };
  
if(creatingServer)return <Loader loadingText='Creating your channel'/>

   return (
    <View className='p-5 flex-1 '>
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