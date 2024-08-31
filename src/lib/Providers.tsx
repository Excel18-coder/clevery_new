import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MessagingProvider } from './contexts/messaging';
import { AuthProvider } from './contexts/auth';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';

export const Providers = ({ children }:{children:React.ReactNode}) => {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MessagingProvider>
          <GluestackUIProvider mode="light">
            <OverlayProvider>
              {children}
            </OverlayProvider>
          </GluestackUIProvider>
        </MessagingProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default Providers