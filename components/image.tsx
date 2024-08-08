import { endpoint } from '@/lib';
import { Image as ExpoImage } from 'expo-image';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';

interface ImageProps {
  source: string;
  width: number;
  height: number;
  style?: ViewStyle;
}

export default function Image({ source, width, height, style }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const imageUrl = useMemo(async () => {
    const response = await fetch(
      `${endpoint}/optimizations?url=${source}&width=${width}&height=${height}`
    )
    const res= await response.json().then((res) => res.optimizedImage);
    return res;
  }, [source, width, height]);

  return (
    <>
      {isLoaded ? (
        <ExpoImage
          source={{ uri: imageUrl }}
          contentFit="cover"
          style={[styles.image, style]}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <ActivityIndicator size="large" style={styles.loader} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});