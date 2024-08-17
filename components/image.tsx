import { memo, useMemo } from 'react';
import { Image as ExpoImage } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from 'native-base';

import { endpoint } from '@/lib';

interface ImageProps {
  source: string;
  width: number;
  height: number;
  style?: string;
}

const fetchOptimizedImage = async (source: string, width: number, height: number) => {
  const response = await fetch(
    `${endpoint}/optimizations?url=${source}&width=${width}&height=${height}`
  );
  const data = await response.json();
  return data.optimizedImage;
};

const Image: React.FC<ImageProps> = memo(({ source, width, height, style }) => {
  const { data: optimizedImageUrl, isLoading } = useQuery({
    queryKey: ['optimizedImage', source, width, height],
    queryFn: () => fetchOptimizedImage(source, width, height),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const memoizedSkeleton = useMemo(() => (
    <Skeleton 
      size="16"
      startColor='gray.500' 
      endColor={'gray.800'}
      className={style} 
    />
  ), [style]);

  if (isLoading) {
    return memoizedSkeleton;
  }

  return (
    <ExpoImage
      source={{ uri: optimizedImageUrl }}
      contentFit="cover"
      className={style}
    />
  );
});

export default Image;