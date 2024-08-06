import { createContext, useContext, useEffect, useState } from 'react';
import { StreamVideoClient } from '@stream-io/video-react-native-sdk';
import { router } from 'expo-router';

import { useProfileStore } from '@/lib/zustand/store';
import { userApi } from '../actions/users';

const AuthContext = createContext<any>({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { profile,setProfile } = useProfileStore();

  const fetchAndSetProfile = async () => {
    try {
      const currentAccount = await userApi.getCurrentUser();
      if (!currentAccount && !profile.id) {
        return router.push('/sign-in');
      }
      setProfile(currentAccount);
      return router.push('/');
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAndSetProfile();
  }, []);

  const value = {
    checkAuthUser: () => {
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const checkAuthUser = () => useContext(AuthContext);

