import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from 'nativewind';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { MessagingProvider } from './contexts/messaging';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { useThemeStore } from './zustand/store';
import { AuthProvider } from './contexts/auth';

export const Providers = ({ children }:{children:React.ReactNode}) => {

  const queryClient = new QueryClient();
  const { mode } = useThemeStore();
  const defaultMode = useColorScheme()
    const lightmode = (): 'light' | 'dark' => {
      //@ts-ignore
    if (mode === 'default') return defaultMode.colorScheme;
    return mode;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <AuthProvider>
          <MessagingProvider>
            <GluestackUIProvider mode={lightmode()} >
              <OverlayProvider>
                {children}
              </OverlayProvider>
            </GluestackUIProvider>
          </MessagingProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}

export default Providers