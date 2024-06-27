import { FlatList } from 'react-native'

import ServerCard from '@/components/Servers/ServerCard'
import { Text, View } from '@/components/Themed'
import Loader from '@/components/Loader'
import { useGetServers } from '@/lib'
import { router } from 'expo-router'
export default function Status() {
  
 const {data:serversDocuments ,isLoading:loading} = useGetServers()

 const onPress=(serverId:string)=>{
 router.push(`/server/${serverId}`)
 }
 const servers= serversDocuments?.pages[0]
 
 if(loading) return <Loader loadingText='Loading servers'/>
 
 return (
    <View style={{flex:1}} >
      <FlatList
      data={servers}
      renderItem={({ item }) => (
        <ServerCard {...item}
         id={item._id}
         name={item?.name} 
         icon={item?.icon}
         onPress={() => onPress(item._id)} 
         />
      )}
      keyExtractor={(item) => item?._id}
    />
    </View>
  )
}