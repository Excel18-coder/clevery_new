import { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {AppDispatch, selector } from '../redux/store';
import { setProfile } from '../redux/features/profileSlice';
import { router } from 'expo-router';
import { useNetInfo } from '@react-native-community/netinfo';
import { getCurrentUser } from '../api/users';

export const INITIAL_USER = {
  id: '',
  name: '',
  username: '',
  email: '',
  image: '',
  bio: '',
};

const AuthContext = createContext<any>({
  user: INITIAL_USER,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const {isConnected} = useNetInfo()
  
  const checkAuthUser = async () => {
    try {
      const currentAccount = await getCurrentUser();
      if(!currentAccount){
        router.push('/sign-in')
        return false 
      }
      if(currentAccount) {
        dispatch(
          setProfile({
            _id: currentAccount?._id,
            _createdAt:currentAccount?._createdAt,
            name: currentAccount?.name,
            username: currentAccount?.username,
            email: currentAccount?.email,
            image: currentAccount?.image,
            bio: currentAccount?.bio,
            friends:currentAccount?.friends
          })
        );
        router.push('/')
        return true
      }

    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    checkAuthUser();
  },[isConnected]);
  
  const value = {
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const checkAuthUser = () => useContext(AuthContext);
