import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

const CertificateIcon = () => {
  return (
    <View className='flex-row items-center' >
      <FontAwesome name="certificate" color="#007aff" size={15} className='mr-1.5'/>
      <View className='w-4 h-4 rounded-full items-center justify-center' style={styles.checkIconContainer}>
        <Icon name="check" size={12} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certificateIcon: {
    marginRight: 5,
  },
  checkIconContainer: {
    position: 'absolute',
    zIndex: 10,
    left: '50%',
    marginLeft: -8,
    top: '50%',
    marginTop: -6,
  },
});

export default CertificateIcon;