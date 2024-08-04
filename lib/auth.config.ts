import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import { endpoint } from './env';
// For Google
const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
  iosClientId: 'YOUR_IOS_CLIENT_ID',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID',
  webClientId: 'YOUR_WEB_CLIENT_ID',
});

// For GitHub

const githubDiscovery = {
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://api.github.com/applications/YOUR_GITHUB_CLIENT_ID/token',
  userInfoEndpoint: 'https://api.github.com/user',
  clientId: process.env.GITHUB_CLIENT_ID!,
  redirectUri : 'https://clevery.vercel.app/api/auth/callback/github',
};

const [githubRequest, githubResponse, githubPromptAsync] = AuthSession.useAuthRequest(githubDiscovery,{
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
});

const handleGoogleLogin = async () => {
  const result = await googlePromptAsync();
  if (result.type === 'success') {
    const { id_token } = result.params;
    await handleServerAuth('google', id_token);
  }
};

const handleGithubLogin = async () => {
  const result = await githubPromptAsync();
  if (result.type === 'success') {
    const { access_token } = result.params;
    await handleServerAuth('github', access_token);
  }
};

const handleServerAuth = async (provider: 'google' | 'github', token: string) => {
  try {
    const response = await fetch(`${endpoint}/auth/callback/${provider}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, token }),
    });

    if (!response.ok) throw new Error('Server authentication failed');

    const data = await response.json();
    await SecureStore.setItemAsync('authToken', data.token);
    console.log(data);
  } catch (error) {
    console.error('Authentication error:', error);
  }
};