import { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Clevery',
  slug: 'clevery',
  version: '2.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: ['clevery','com.clevery.app'],
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#1f2023',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.clevery.app',
  },
  android: {
    googleServicesFile: './google-services.json',
    package: 'com.clevery.app',
    allowBackup: true,
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#ffffff',
    },
    versionCode: 1, // Add this line
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-notifications',
      {
        sounds: ['./assets/Sounds/notification.wav'],
      },
    ],
    [
      '@stream-io/video-react-native-sdk',
      {
        "enableScreenshare": true,
        androidPictureInPicture: {
          enableAutomaticEnter: true
        },
      }
    ],
    [
      '@config-plugins/react-native-webrtc',
      {
        cameraPermission: 'Allow Clevery to access your camera',
        microphonePermission: 'Allow Clevery to access your microphone',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          minSdkVersion: 24,
        },
      },
    ],
  ],
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '3df3e8bc-4bda-4ac6-bfbe-a38f7122ff3a',
    },
  },
  owner: 'larrydean',
  runtimeVersion: {
    policy: 'sdkVersion', // Change this line
  },
  updates: {
    fallbackToCacheTimeout: 0, // Add this line
    url: 'https://u.expo.dev/3df3e8bc-4bda-4ac6-bfbe-a38f7122ff3a',
  },
});

// eas build -p android --profile preview