import { memo, useState, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, FlatList, Image } from 'react-native';
import { router } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLikePost, useSavePost, useDeletePost, useProfileStore } from '@/lib';
import { checkIsLiked, showToastMessage, multiFormatDateString } from '@/lib/utils';
import { Text } from '../ui/text';
import { Post as PostType } from '@/types';

const OverlappingImages = memo(({ images, numberofcomments }:any) => (
  <View className="flex-row items-center gap-4xs py-[2.5px]">
    <View className="flex-row overflow-hidden w-12.5">
      {images?.map((imageSource, index) => (
        <Image key={index} source={{uri:imageSource}} className="w-4 h-4 rounded-[10px] mr-[-10px]" width={350} height={120}/>
      ))}
    </View>
    <Text className="text-sm font-rmedium">{numberofcomments} people commented</Text>
  </View>
));

const ImageComponent = memo(({ image, width, height }:any) => (
  <Image source={ {uri:image} } className={`m-[3px] rounded-[5px] ${height} ${width}`} width={width} height={height} />
));

const AuthorInfo = memo(({ author, timestamp, iscomment }: any) => (
  <View className='flex-row items-center mb-2.5'>
    <TouchableOpacity onPress={() => router.push(`/user/${author?.id}`)}>
      {author?.image && (
        <Image
          source={{uri:author?.image}}
          // height={80}
          // width={80}
          className='mr-2.5 w-[50px] h-[50px] rounded-3xl'
        />
      )}
    </TouchableOpacity>
    <View className='flex-1'>
      <View className='flex-row gap-1.5'>
        <Text className={`text-4 font-rmedium text-${iscomment ? "[12px]" : "[16px]"}`}>{author?.name}</Text>
      </View>
      <Text className={`text-[#aaa] font-pregular text-${iscomment ? "[8px]" : "[12px]"}`}>@{author?.username}</Text>
    </View>
    <Text className='font-pregular text-[10px] text-light'>{multiFormatDateString(timestamp)}</Text>
  </View>
));

const ActionStats = memo(({ author, likesList, postId, userId, isSaved, isLiked, handleLikePost, handleSavePost, handleDeletePost }: any) => (
  <View className='flex-row mb-2.5 mt-5'>
    <TouchableOpacity onPress={handleLikePost}>
      <Text className='font-rmedium text-rose-400 justify-evenly text-xs mr-2.5 pt-2'>
        <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={22} />
        {likesList?.length || 0}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.push(`/post/${postId}`)}>
      <Text className='text-light'>
        <Feather name="message-circle" color={'grey'} size={22} />
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleSavePost} className='ml-1.5 rounded-[5px]'>
      <Ionicons name={!isSaved ? "bookmark-outline" : "bookmark-sharp"} size={20} color={'gray'} />
    </TouchableOpacity>
    {author?.id == userId && (
      <TouchableOpacity onPress={() => handleDeletePost(postId, userId)} className='ml-auto rounded-[5px]'>
        <Feather name="edit" size={20} color="white" />
      </TouchableOpacity>
    )}
  </View>
));

const Post = memo(({ author, content: caption, createdAt: timestamp, id: postId, comments, images, tags, likes: initialLikes, saves: savesList }: PostType) => {
  const { profile: { id: userId } } = useProfileStore();
  const [saves, setSaves] = useState(savesList);
  const [likes, setLikes] = useState<string[]>(initialLikes);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deletePost } = useDeletePost();

  const commentedUserImages = useMemo(() => comments?.slice(0, 3).map(comment => comment?.user?.image) || [], [comments]);

  const handleLikePost = useCallback(() => {
    setLikes(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    likePost(postId);
    showToastMessage("Post liked");
  }, [userId, postId, likePost]);

  const handleSavePost = useCallback(() => {
    setSaves(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    savePost(postId);
    showToastMessage("Post saved");
  }, [postId, savePost]);

  const handleDeletePost = useCallback(() => {
    router.push(`/edit-post/${postId}`);
  }, [postId]);

  
  return (
    <View className="p-2.5 mb-3.5">
      <AuthorInfo author={author} timestamp={timestamp} />
      <View className="flex-1 flex-col justify-center p-1 items-center">
        <Text className="font-rmedium text-base mb-auto w-full">{caption}</Text>
        {images?.length === 1 ? (
          <ImageComponent image={images[0]} width="w-[350px]" height="h-[230px]" />
        ) : (
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <ImageComponent image={item} width="w-[160px]" height="h-[230px]" />
            )}
          />
        )}
      </View>
      <View className="flex-row flex-wrap gap-1">
        {!!tags?.length && tags?.map((tag, index) => (
          <Text key={index} className="text-light p-2 text-xs font-rregular">#{tag}</Text>
        ))}
      </View>
      {comments?.length > 0 && (
        <OverlappingImages
          images={commentedUserImages}
          numberofcomments={comments.length}
        />
      )}
      <ActionStats
        author={author}
        postId={postId}
        // @ts-ignore
        isLiked={checkIsLiked(likes.map(like => like.id), userId)}
        likesList={likes}
        savesList={savesList}
        userId={userId}
        isSaved={checkIsLiked(saves.map(like => like.id), userId)}
        handleLikePost={handleLikePost}
        handleSavePost={handleSavePost}
        handleDeletePost={handleDeletePost}
      />
    </View>
  );
});

export default Post;