import { ServerComponent } from '@/components';
import { useLocalSearchParams } from 'expo-router';
import { memo } from 'react';

const Server = () => {
  const {id} = useLocalSearchParams()
  return <ServerComponent serverId={id as string} />
}

export default memo(Server)