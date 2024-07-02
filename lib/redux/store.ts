import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';

import ExpoFileSystemStorage from "redux-persist-expo-filesystem" 
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { lastMessageReducer, messagesReducer, profileReducer, searchesReducer, themeSlice, userReducer } from './features';

const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  search: searchesReducer,
  lastMessage: lastMessageReducer,
  messages: messagesReducer,
  theme:themeSlice
});

const persistConfig = {
  key: 'root',
  storage: ExpoFileSystemStorage,
  whitelist: ['user', 'search', 'lastMessage', 'messages','auth','theme','profile']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selector: TypedUseSelectorHook<RootState>=useSelector;