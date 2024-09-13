import { createContext, useCallback, useContext, useEffect } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import axios from 'axios';

import { useAuthStore, useProfileStore } from '@/lib/zustand/store';
import { showToastAlert } from '@/components/alert';
import { userApi } from '@/lib/actions/users';
import { endpoint } from '@/lib/env';

// Configuration variables
const API_BASE_URL = endpoint;

/**
 * Represents the structure of a user object.
 */
interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

/**
 * Props for the AuthProvider component
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

export const googleSignIn = async () => {
  await fetch(`${endpoint}/sign-up/provider?provider=google`);
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const res = await GoogleSignin.signIn();
    if (!res) {
      throw new Error('Google Sign-In failed');
    }
    const { data:{ serverAuthCode} } = res

    console.log('Google Sign-In Successful');

    const tokenResponse = await axios.get(`${endpoint}/auth/callback/google?code=${serverAuthCode}&grant_type=code_verifier&state=abc123`);
    console.log(tokenResponse.data);
    const user = await userApi.getCurrentUser()
    console.log('Google auth res user: ', user)
    return { success: true, serverAuthCode };
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('Google Sign-In Cancelled');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Google Sign-In already in progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Play Services not available or outdated');
    } else {
      console.error('Google Sign-In Error:', error.message);
    }

    return { success: false, error: error.message };
  }
};


/**
 * AuthProvider component that wraps the application and provides authentication context
 * @param props - The component props
 * @returns The AuthProvider component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, token, loading, setUser, setLoading } = useAuthStore();
  const { profile, setProfile } = useProfileStore();

  useEffect(() => {
    const checkCurrentUser = async () => {
      if (profile?.id) return
      try {
        const currentAccount = await userApi.getCurrentUser();
        console.log('currentAccount: ', currentAccount)
        if (!currentAccount) {
          router.navigate('sign-up');
        }
        setProfile(currentAccount)
      } catch (error) {
        router.replace('sign-in');
      }
    };

    checkCurrentUser();
  }, []);

  /**
   * Handles the sign-in process for various providers
   * @param provider - The authentication provider
   * @param credentials - Optional credentials for email/password sign-in
   * @throws Error if credentials are not provided for 'credentials' provider
   */
  const signIn = useCallback(async (
    provider: 'google' | 'credentials',
    credentials?: { email: string; password: string }
  ) => {
    try {
      setLoading(true);

      if (provider === 'credentials') {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error('Email and password are required for credentials sign-in');
        }
        await handleCredentialsSignIn(credentials);
      } else {
          await googleSignIn();
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  /**
   * Handles the credentials (email/password) sign-in process
   * @param credentials - The user's email and password
   */
  const handleCredentialsSignIn = async (credentials: { email: string; password: string }) => {
    console.log('Sign in with credentials:', credentials);
    const response = await axios.post(`${API_BASE_URL}sign-in`, credentials);
    const data = response.data
    console.log('Server login res: ', data)
    await handleAuthSuccess({user:data,token:""}); 
    return data
  };

  /**
   * Handles the sign-up process
   * @param credentials - The user's username, email, and password
   */
  const signUp = async (credentials: {username: string, email: string; password: string }) => {
    const response = await axios.post(`${API_BASE_URL}sign-up`, credentials);
    const data = response.data
    console.log("CredRes 1", user)
    await handleAuthSuccess({user:data,token:""});
    return data
  };

  /**
   * Handles successful authentication
   * @param data - The user data returned from the server
   */
  const handleAuthSuccess = async ({ user, token }: { user: User; token: string }) => {
    showToastAlert({
      id: 'sign-up',
      title: 'Authentication successful',
      description: 'You are now logged in.',
    })
    //@ts-ignore
    setUser(user);
    //@ts-ignore
    setProfile(user)
    // showToastAlert({
    //   id: 'sign-up',
    //   title: 'Authentication successful',
    //   description: 'You are now logged in.',
    // })
    router.replace('/')
  };

  /**
   * Handles authentication errors
   * @param error - The error object
   */
  const handleAuthError = (error: unknown) => {
    let errorMessage = 'An unexpected error occurred during authentication';

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

  };

  /**
   * Signs out the current user
   */
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setUser(null);
      router.navigate('sign-in');
    } catch (error) {
      console.error('Error during sign out:', error);
      return handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser, router]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Authentication context
 */
const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  signUp: (credentials: {username:string, email: string; password: string }) => Promise<void>;
  signIn: (provider: 'google' | 'github' | 'credentials', credentials?: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  user: null,
  loading: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

/**
 * Custom hook to use the authentication context
 * @returns The authentication context data
 * @throws Error if used outside of an AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}