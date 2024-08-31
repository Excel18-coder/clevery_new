import { View, TextInput,TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

interface CommentInputProps {
  showComment: boolean;
  setShowComment: (showComment: boolean) => void;
  commentText: string;
  setCommentText: (commentText: string) => void;
  handleCommentPost: () => void;
  colorScheme: string;
}

const CommentInput: React.FC<CommentInputProps> = ({
  showComment,
  setShowComment,
  commentText,
  setCommentText,
  handleCommentPost,
  colorScheme,
}) => {
  return (
    <View>
      {showComment && (
        <>
          <TouchableOpacity onPress={() => setShowComment(false)}>
            <Ionicons name="close" size={20} />
          </TouchableOpacity>
          <TextInput
          className={`h-10 border mb-2.5 px-[5px] border-gray-500 text-${colorScheme === 'light' ? '[#000]' : '[#fff]' }`}
            placeholder="Add a comment"
            onChangeText={(e) => setCommentText(e)}
          />
          <TouchableOpacity className='bg-[#4287f5] p-2.5 rounded-[5px] ' onPress={handleCommentPost}>
            <FontAwesome name={'send'} size={12} color="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default CommentInput;