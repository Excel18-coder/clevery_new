import { image } from '@/types';
import AuthorInfo from './AuthorInfo';
import { Text, View } from '../Themed';

interface Comment{
  user:{
    _id:string;
    name: string;
    username: string;
    image: image;
    isVerified: boolean;
    email: string;
  };
  comment:string;
  timestamp:string;
  likes:number;
}
const UserComment = ({comment}:{comment:Comment}) => {
  return (
    <View>
      <AuthorInfo
       author={comment.user}
       timestamp={comment.timestamp}
       iscomment
      />
      <Text
      className='font-pregular text-[10px] ml-[70px] mt-[-15]'>{comment.comment}</Text>
    </View>
  )
}

export default UserComment