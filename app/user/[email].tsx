import { memo, useState } from 'react';
import { TextInput, FlatList } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Text, View, UserCard, Loader, UserInfo } from '@/components';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { selector, urlForImage, useGetUserById, useGetUsers } from '@/lib';
import { Image } from 'expo-image';

interface UserProfileProps {
  route: any;
}


const UserBanner = ({ bannerImage }: { bannerImage: string }) => {
  return (
    <Image
      source={{
        uri: bannerImage
          ? urlForImage(bannerImage).width(300).url()
          : 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=400',
      }}
      className='w-full h-[150px]'
    />
  );
};

const UserSection = ({ title, content }: { title: string; content?: any }) => {
  return (
    <View className='m-2.5 mr-[10px] br-[10px] p-2.5 flex-1'>
      <Text className='text-[15px] font-pmedium my-2.5'>{title}</Text>
      {content ? <Text>{content}</Text> : <Text>No data yet</Text>}
    </View>
  );
};

const UserNote = ({ note, onChangeNote }: { note: string; onChangeNote: (newNote: string) => void }) => {
  return (
    <View className='mt-4 rounded-[10px] p-2.5 border-[#ccc]'>
      <Text className='text-[15px] font-pmedium my-2.5'>Note</Text>
      <TextInput
        className="text-base min-h-[100px] align-text-top"
        placeholder="Add a note"
        multiline
        value={note}
        onChangeText={onChangeNote}
      />
    </View>
  );
};

const UserProfile: React.FC<UserProfileProps> = () => {
  const {email} = useLocalSearchParams()

  const {  data:user, isPending: loading, isError: netError } = useGetUserById(email as string);
  const {  data:commonFriends} = useGetUsers();

  
  const [note, setNote] = useState<string>('');


  const userNavigate = (userId: string) => {
    router.push(`/conversation/${userId}`);
  };
  // Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle
  if (loading || netError) {
    return <Loader loadingText="Loading user..." />;
  }
  

  return (
    <FlatList
      data={[{ key: 'a' }]}
      renderItem={() => (
        <View>
          <UserBanner bannerImage={user?.bannerImage!} />
          <UserInfo profile={user} />
          <Text className='font-rmedium mt-[15px]'>About Me:  <Text className='text-sm font-rregular mt-2.5'>{user?.bio}</Text></Text>
        <Text className='font-rmedium mt-[15px]'>Member Since:  <Text className='text-sm font-rregular mt-2.5' >{format(parseISO(user?._createdAt as string), 'dd MMM yyyy')}</Text></Text>
          <UserSection title="Member Since" content={format(parseISO(user?._createdAt!), 'MMM dd yyyy')} />
          <UserSection 
            title="Mutual Friends" 
            content={
            !!commonFriends.length ? 
              <FlatList data={commonFriends} 
                keyExtractor={(item) => item?._id} 
                renderItem={({ item }) => <UserCard key={item._id} user={item} 
                handleAddFriend={() => {}} 
                showlastMessage 
                onSelectUser={() => userNavigate(item._id)} />} 
              /> : <Text>No Common Friends yet</Text>} />
          <UserSection title="Mutual Groups" />
          <UserSection title="Connections" />
          <UserNote note={note} onChangeNote={setNote} />
        </View>
      )}
    />
  );
};

export default memo(UserProfile);