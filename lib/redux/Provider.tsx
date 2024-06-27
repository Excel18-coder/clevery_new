import { Provider } from "react-redux";
import { persistor, store } from "./store";
import{ ReactNode } from 'react';
import { PersistGate } from "redux-persist/integration/react";


export function ReduxProvider({ children }:{children:ReactNode}) {
  
  return(
     <Provider store={store}> 
        <PersistGate  persistor={persistor}>
          {children} 
          </PersistGate>
     </Provider> 
     )
}  