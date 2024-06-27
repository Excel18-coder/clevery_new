import { memo,useState } from 'react';
import { selector,useLikePost, useSavePost , useDeletePost, urlForImage} from '@/lib';
import {Text, View } from '../Themed';
import { User, author, image } from '@/types';
import ImageCont from './ImagesCont';
import AuthorInfo from './AuthorInfo';
import ActionStats from './ActionStats';
import { router } from 'expo-router';
import { checkIsLiked } from '@/lib/utils';
import { Image } from 'expo-image';

type PostCardProps = {
  props: {
    _id:string;
    author:author;
    content:string;
    images:image[];
    _createdAt:string;
    likes:User[];
    tags:any[];
    bookmarks:User[]
    comments:any
  };
};
 
const Post = ({props}:PostCardProps) => {
  const {author, content:caption, _createdAt:timestamp,_id:postId,images,likes:postLikes,bookmarks:savesList,tags,comments}= props
  const { profile } = selector((state) => state.profile)
  const userId=profile._id
  const [isSaved, setIsSaved] = useState(false);
  const likesList = postLikes?postLikes?.map((user:any) => user?._ref):[];
  const [likes, setLikes] = useState<string[]>(likesList);

  
  const { mutate: likePost ,isPending:likingPost} = useLikePost(); 
  const { mutate: savePost ,isPending:savingPost} = useSavePost();
  const { mutate: deletePost } = useDeletePost();
  
  const maxImages = 3;
  const commentedUserImages = comments && comments.length>0 &&
    comments?.map((comment: any) => 
    urlForImage(comment?.user?.image).width(20).url())
    .slice(0, maxImages);

  const handleLikePost = () => {
    const updatedLikes = likes.includes(userId)
      ? likes.filter((id) => id !== userId)
      : [...likes, userId];

    setLikes(updatedLikes);
    likePost({ postId, userId });
  };

  const handleSavePost = async() => {
    savePost({ userId: userId, postId: postId });
    setIsSaved(true);
  };
  
  const handleDeletePost=(postId:string,token:string,images?:string[])=>{
    //  deletePost({postId,token,images})
    router.push(`/edit-post/${postId}`)
  }

  const OverlappingImages = ({ images, numberofcomments }:{ images:string[], numberofcomments:string }) => {
    return (
      <View className='flex-row items-center gap-4xs py-[2.5px]' >
        <View className='flex-row overflow-hidden w-12.5'>
          {images?.map((imageSource, index) => (
            <Image
              key={index}
              source={imageSource}
              className='w-4 h-4 rounded-[10px] mr-[-10px]'
            />
          ))}
        </View>
        <Text className='tex-sm font-rmedium' >{numberofcomments} people commented</Text>
      </View>
    );
  };
  
  return (
    <View className='p-2.5 mb-3.5' >
      <AuthorInfo author={author} timestamp={timestamp} />
      <ImageCont images={images} caption={caption} />
      <View className='flex-row gap-1 w-auto'>
        {tags?.map((tag,index)=> <Text key={index} className='text-light p-2 text-xs font-rregular'>#{tag}</Text>)}
      </View>
      {comments&&comments?.length>0&&
        <OverlappingImages
        images={commentedUserImages}
        numberofcomments={comments?.length}
      />}
      <ActionStats
        author={author}
        postId={postId}
        isLiked={checkIsLiked(likes, userId)}
        likesList={likes}
        savesList={savesList}
        userId={userId}
        isSaved={isSaved}
        handleLikePost={handleLikePost}
        handleSavePost={handleSavePost}
        handleDeletePost={handleDeletePost}
      />
      
    </View>
  );
};

export default memo(Post);
