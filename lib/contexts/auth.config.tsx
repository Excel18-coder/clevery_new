import React, { useState, useCallback, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { makeRedirectUri } from 'expo-auth-session';
import axios from 'axios';
import { Alert } from 'react-native';
import { endpoint } from '../env';

// Ensure WebBrowser is configured for AuthSession
WebBrowser.maybeCompleteAuthSession();

// Define types
type AuthProvider = 'google' | 'github' | 'email';

interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

const GITHUB_CLIENT_ID = "Ov23li2owdPoRMAWaRif";
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID;

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (provider: AuthProvider, token?: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  githubLogin: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Google Auth
  const [, , googlePromptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    androidClientId: GOOGLE_CLIENT_ID,
    // webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  // GitHub Auth
  const githubDiscovery = {
    tokenEndpoint: 'https://clevery-api.vercel.app/api/auth/signin/github',
    revocationEndpoint: `https://clevery-api.vercel.app/api/auth/signin/github`,
    userInfoEndpoint: 'https://clevery-api.vercel.app/api/auth/signin/github',
    clientId: GITHUB_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: 'com.clevery.app',
      path: '/',
    }),
  };

  const [req, , githubPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ['identity'],
      redirectUri: githubDiscovery.redirectUri,
    },
    { authorizationEndpoint: `https://clevery-api.vercel.app/api/auth/callback/google` }
  );

  const login = useCallback(async (provider: AuthProvider, token?: string) => {
    try {
      let response;
      if (provider === 'email') {
        response = await axios.post(`${endpoint}/auth/login`, { email: token, password: token });
      } else {
        response = await axios.post(`${endpoint}/auth/callback/${provider}`, { token });
      }

      if (response.status === 200) {
        const { token, user } = response.data;
        await SecureStore.setItemAsync('authToken', token);
        setIsAuthenticated(true);
        setUser(user); 
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Authentication Error', 'Failed to authenticate. Please try again.');
    }
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync('authToken');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const googleLogin = useCallback(async () => {
    const result = await googlePromptAsync();
    console.log(result)
    if (result.type === 'success') {
      await login('google', result.params.id_token);
    }
  }, [googlePromptAsync, login]);

  const githubLogin = useCallback(async () => {
    console.log(req);
    const result = await githubPromptAsync();
    if (result.type === 'success') {
      await login('github', result.params.access_token);
    }
  }, [githubPromptAsync, login]);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        try {
          const response = await axios.get(`${endpoint}/auth/user`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.status === 200) {
            setIsAuthenticated(true);
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          await logout();
        }
      }
    };
    checkToken();
  }, [logout]);

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    googleLogin,
    githubLogin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};