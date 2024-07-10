import { KindeSDK } from '@kinde-oss/react-native-sdk-0-7x';
import { endpoint } from './env';

const KINDE_ISSUER=process.env.EXPO_PUBLIC_KINDE_ISSUER_URL!
const KINDE_POST_CALLBACK_URL= "https://clevery.vercel.app"!
const KINDE_CLIENT_ID=process.env.EXPO_PUBLIC_KINDE_CLIENT_ID!
const KINDE_LOGOUT_REDIRECT_URL = process.env.EXPO_PUBLIC_KINDE_POST_LOGOUT_REDIRECT_URL|| "/"!

console.log(KINDE_ISSUER,KINDE_POST_CALLBACK_URL,KINDE_CLIENT_ID,KINDE_LOGOUT_REDIRECT_URL)
export const authClient = new KindeSDK(
  KINDE_ISSUER, 
  KINDE_POST_CALLBACK_URL, 
  KINDE_CLIENT_ID, 
  KINDE_LOGOUT_REDIRECT_URL,
);
