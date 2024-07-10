import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { User } from '@/types';

import { ErrorMessage, InviteFriends, Loader } from '@/components';
import { useAddFriend, useGetUsers, useProfileStore } from '@/lib';
import LoadingUsers from '@/components/skeletons/loading-users';

const AddFriends: React.FC = () => {
  const  [filteredUsers, setFilteredUsers] = useState([])
  const { profile:{ _id, friends } } = useProfileStore();
  const { data: allUsers, isPending: loadingUsers, isError: errorUsers } = useGetUsers();
  const { mutateAsync: addFriend } = useAddFriend();
  
  const handleAddFriend = async (user:User) => {
    await addFriend( user._id);
  };

  useEffect(() => {
   filterNonFriends()
   .then((users:any)=>setFilteredUsers(users))
  }, [])
  
  
  if (loadingUsers ) return <LoadingUsers />;
  if (errorUsers ) return <ErrorMessage message="Failed to get users" />;

  async function filterNonFriends() {
    const friendIds = new Set(friends?.map((friend: any) => friend._id));
    return allUsers?.filter(
      (user: any) => user._id !== _id && !friendIds.has(user._id)
    );
  }
  return (
    <InviteFriends
      selectedUsers={[]}
      buttonText='Add Friend'
      onClose={()=>router.back()}
      onInvitePress={handleAddFriend}
      removeUser={()=>{}}
      users={filteredUsers}
    />
  )
};
export default AddFriends;
