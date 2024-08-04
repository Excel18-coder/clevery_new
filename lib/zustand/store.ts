import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import { User } from '@/types';

interface ProfileState {
  profile: Profile;
  setProfile: (profile: User) => void;
}

interface Profile extends User {
  bannerImage: string | null;
  friends?: User[];
  streamToken?: string | undefined;
  country?: string | undefined;
  connections:[]
  phoneNumber:string
}
interface Search {
  id: string;
  name: string;
  image: string;
}
interface SearchState {
  searches: Search[];
  addSearch: (search: Search) => void;
  removeSearch: (id: string) => void;
  clearSearch: () => void;
}

interface ThemeState {
  mode: 'light' | 'dark' | 'default';
  setMode: (mode: 'light' | 'dark' | 'default') => void;
}

const initialProfileState: Profile = {
  name: 'Guest Doe',
  id: '',
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
  address: '',
  emailVerified: null,
  phone: '',
  username: 'janedoe',
  email: '',
  image: '' as any,
  bio: '',
  friends: [],
  country: '',
  bannerImage: 'https://via.placeholder.com/350x150',
  streamToken: '',
  notificationToken: '',
  phoneNumber:'',
  connections:[]
};


const initialSearchState: SearchState = {
  searches: [],
  addSearch: (search: Search) => {},
  removeSearch: (id: string) => {},
  clearSearch: () => {},
};

const initialThemeState: ThemeState = {
  mode: 'default',
  setMode: (mode: 'light' | 'dark' | 'default') => {},
};

const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: initialProfileState,
      setProfile: (profile: Profile) => set({ profile }),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: initialThemeState.mode,
      setMode: (mode: 'light' | 'dark' | 'default') => set({ mode }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searches: initialSearchState.searches,
      addSearch: (search: Search) => set((state:any) => ({ searches: [...state.searches, search] })),
      removeSearch: (id: string) => set((state:any) => ({ searches: state.searches.filter((search:any) => search._id !== id) })),
      clearSearch: () => set({ searches: [] }),
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { useProfileStore, useThemeStore, useSearchStore };
