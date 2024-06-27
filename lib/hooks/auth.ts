import  *as Google  from 'expo-auth-session/providers/google'
import  *as Facebook  from 'expo-auth-session/providers/facebook'
import { env } from '../env';
import { useAuthRequest } from 'expo-auth-session/providers/google';

export const authHooks = () => {
  const [googleReq, googleRes, googleAsync] = Google.useAuthRequest({
    androidClientId: env.androidClient,
    iosClientId: env.iosClient,
    clientId:env.expoClientId,
    scopes: ['profile', 'email','phone'],
    })
    const [facebookReq, facebookRes, facebookAsync] = Facebook.useAuthRequest({
    androidClientId: '419395183801398',
    scopes: ['profile', 'email'],
    });
    const [gitReq, gitRes, gitAsync] = useAuthRequest({
        clientId: env.androidClient,
        redirectUri: 'https://clevery.vercel.app/api/auth/signin',
    }
    );

    async function handleResponse() {
      if (googleRes?.type === 'success') {
          const { id_token } = googleRes.params;
          console.log(googleRes)
      }
      if (facebookRes?.type === 'success') {
        
      } 
        if (gitRes?.type === "success") {
          
        }
      }

    return{
        googleReq,googleRes, googleAsync,facebookReq, facebookRes, facebookAsync,gitReq, gitRes, gitAsync,handleResponse
    }
}

