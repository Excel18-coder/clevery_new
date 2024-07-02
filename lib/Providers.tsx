import { ReactNode } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ReduxProvider } from './redux/Provider'
import { QueryProvider } from './react-query/QueryProvider' 
import { NativeBaseProvider } from 'native-base'
// import { StreamProvider } from './stream/Provider'

export const Providers = ({ children }:{children:ReactNode}) => {

    return(
    <ReduxProvider>
      <QueryProvider>
        <AuthProvider>
          <NativeBaseProvider>
            {children}
          </NativeBaseProvider>
        </AuthProvider>
      </QueryProvider>
    </ReduxProvider>
   )
}

export default Providers