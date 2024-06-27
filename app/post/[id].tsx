import { ErrorMessage, Loader, MessageInput, Post, Text, UserComment, View } from '@/components'
import { selector, useCommentPost, useGetPostById } from '@/lib'
import { useLocalSearchParams, usePathname } from 'expo-router';
import { useState } from 'react';
import { FlatList } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

export default function PostComponent() {
  const [comment, setComment] = useState('')
  const {id} = useLocalSearchParams()
  const profile = selector((state) => state.profile.profile);
  const {data:post,isLoading:loading,error,refetch} = useGetPostById(id as string);
  const {mutateAsync:sendComment,isPending:commenting,error:errorCommenting} = useCommentPost()

  
const handleComment=async()=>{
  await sendComment({
    postid:post?._id!,
    userid:profile?._id,
    comment:comment
  })
  setComment('')
refetch()
}


if(loading) return <Loader loadingText="loading selected post" />
if (error) return <ErrorMessage message='Something went wrong' />

return (
  <View  className='flex-1 pt-8'>
    <Post
      props={post}
    />
    <Text>Comment on post</Text>
    <KeyboardAvoidingView behavior="position">
      <MessageInput
      caption={comment}
      onChooseFile={()=>{}}
      onMessageChange={(cmt)=>setComment(cmt)}
      onSend={()=>handleComment()}
      sending={commenting}
    />
    </KeyboardAvoidingView>
    <FlatList
      data={post?.comments}
      renderItem={({item}) => <UserComment comment={item as any}/>}
    />
  </View>
)
}