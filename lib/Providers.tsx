import { ReactNode } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ReduxProvider } from './redux/Provider'
import { QueryProvider } from './react-query/QueryProvider'
import { ToastProvider } from 'react-native-toast-notifications'
// import { StreamProvider } from './stream/Provider'

export const Providers = ({ children }:{children:ReactNode}) => {

    return(
    <ReduxProvider>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
              {children}
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </ReduxProvider>
   )
}

export default Providers