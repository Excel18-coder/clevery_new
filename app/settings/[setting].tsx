import { TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { Account, Appearance, FriendRequests, MenuItems, Text, View } from '@/components';
import { selector } from '@/lib';

const Settings = () => {
  const {setting} = useLocalSearchParams()
  const profile = selector((state) => state.profile.profile);

  const HeaderContainer=({header}:{header:string})=>{
    return(
    <View className='flex-row items-center'>
      <TouchableOpacity onPress={()=>router.back()}>
      <Feather name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <Text className='font-rbold text-2xl ml-[20%]' >{header}</Text>
    </View>
    )
  }
  
  
  if (setting === 'account') {
    return (
      <View className='flex-1 mt-7.5'>
      <HeaderContainer header='Account'/>
        <Account
          userInfo={{
            id:profile._id,
            name: profile.name,
            username: profile.username,
            phoneNumber: '',
            email: profile.email,
          }}
        />
      </View>
    );
  } else if (setting === 'appearance') {
    return (
        <View className='flex-1 mt-7.5' >
          <HeaderContainer header='Apppearance'/>
          <Appearance />
        </View>
    )
  } else if (setting === 'notifications') {
    return (
        <View className='flex-1 mt-7.5' >
          <HeaderContainer header='Notifications'/>
          <Appearance />
        </View>
    )
  }  else if (setting === 'friend-requests') {
    return (
     <View className='flex-1 mt-7.5'>
        <HeaderContainer header='Friend Requests'/>
        <FriendRequests friendRequests={[]} />
     </View>
    );
  } else if (setting === 'devices') {
    return (
     <View className='flex-1 mt-7.5'>
        <HeaderContainer header='Devices'/>
     </View> 
    );
  } else if (setting === 'logout') {
    return (
     <View className='flex-1 mt-7.5'>
        <HeaderContainer header='Logout'/>
     </View>
    );
  } else {
    return (
      <View  className='flex-1 mt-7.5'>
        <MenuItems/>
      </View>
    );
  }
};

export default Settings;

