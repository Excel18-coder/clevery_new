import {StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';

interface ErrorComponentProps {
  message: string; 
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorComponentProps> = ({ message, onRetry }) => {
  return (
    <View className='flex-1 justify-center items-center' >
      <Text className='text-center  ' style={styles.errorMessage}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily:'robotto-regular'
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ErrorMessage;