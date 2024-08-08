import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StreamVideoRN } from '@stream-io/video-react-native-sdk';
import { NativeBaseProvider } from 'native-base'

import { MessagingProvider } from './contexts/messaging';
import { AuthProvider } from './contexts/custom';
// import { AuthProvider } from '@/lib/contexts/auth.config';


StreamVideoRN.updateConfig({
  foregroundService: {
    android: {
      notificationTexts: {
        title: 'Call is in progress',
        body: 'Tap to return to the call',
      },
    },
  },
});
export const Providers = ({ children }:{children:React.ReactNode}) => {

  const queryClient = new QueryClient();

  const config = {
    dependencies: {
      "linear-gradient": require("expo-linear-gradient").LinearGradient,
    },
  };
  return(
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider config={config} >
          <MessagingProvider>
            {children}
          </MessagingProvider>
        </NativeBaseProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default Providers