import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import { makeRedirectUri } from 'expo-auth-session';
import axios from 'axios';
import { Alert } from 'react-native';
import { endpoint } from '../env';

// Define types
type AuthProvider = 'google' | 'github' | 'email';

interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (provider: AuthProvider, token?: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  githubLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Google Auth
  const [, , googlePromptAsync] = Google.useAuthRequest({
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  // GitHub Auth
  const githubDiscovery = {
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: 'https://api.github.com/applications/YOUR_GITHUB_CLIENT_ID/token',
    userInfoEndpoint: 'https://api.github.com/user',
    clientId: process.env.GITHUB_CLIENT_ID!,
    redirectUri: makeRedirectUri({
      scheme: 'your.app.scheme',
      path: 'auth/callback/github',
    }),
  };

  const [, , githubPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.GITHUB_CLIENT_ID!,
      scopes: ['identity'],
      redirectUri: githubDiscovery.redirectUri,
    },
    { authorizationEndpoint: 'https://github.com/login/oauth/authorize' }
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
    if (result.type === 'success') {
      await login('google', result.params.id_token);
    }
  }, [googlePromptAsync, login]);

  const githubLogin = useCallback(async () => {
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};