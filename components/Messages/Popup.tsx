import { StyleSheet,TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';
import { Animated } from 'react-native';

const PopupComponent = () => {
  const data = [
    { id: '1', icon: 'reply', text: 'Reply' },
    { id: '2', icon: 'content-copy', text: 'Copy Text' },
    { id: '3', icon: 'pin', text: 'Pin Message' },
    { id: '4', icon: 'link', text: 'Copy Link' },
  ];

  const renderItem = ({ item }:any) => (
    <TouchableOpacity style={styles.popupItem}>
      <MaterialCommunityIcons name={item.icon} size={20} color="#007aff" />
      <Text style={styles.popupText}>{item.text}</Text>
    </TouchableOpacity>
  );
  
  return (
    <Animated.View className={`
    flex-1 absolute bottom-0 left-0 right-0 h-40% w-full rounded-[10px] border-b-1.25 z-10 justify-center items-center px-5 bg-black mt-5`}
    //  style={styles.popup}
     >
      <FlatList 
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  popup: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    width: '100%',
    borderRadius: 10,
    borderBottomEndRadius:5,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'black',
    marginTop: 20,
  },
  popupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 150,
  },
  popupText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily:'robotto-medium'
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
});

export default PopupComponent;