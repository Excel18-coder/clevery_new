import { useLocalSearchParams, usePathname } from 'expo-router';
import ServerComponent from '@/components/Servers/server';
import { memo } from 'react';

const Server = () => {
  const {serverId} = useLocalSearchParams()
  
  return <ServerComponent serverId={serverId as string} />
}

export default memo(Server)