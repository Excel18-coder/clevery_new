import { View } from "../Themed";
import Post from "../Home/Post";
import { FlatList } from "react-native";
import { Post as PostType, Server, User } from "@/types";

interface SearchResultsProps {
  result: PostType[] | Server[] | User[];
  resultType: "media-links" | "posts" | "users" | "servers";
}
const SearchResults = ({result, resultType }:SearchResultsProps) => {
  
  if (resultType ==='media-links'){
    return (
      <View className="flex-1 justify-center items-center">
        <FlatList
          data={result}
          renderItem={({ item }) =><Post key={item.id} {...item} />}
          keyExtractor={(item) => item?.id} 
          onEndReachedThreshold={0.5}
        />
      </View>
    )
  }
};


export default SearchResults;
