import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}
const Error = ({ 
  title = 'Oops! Something went wrong', 
  message = 'We encountered an unexpected error. Please try again later.',
  onRetry
}: ErrorProps) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-6">
      <View className="bg-white rounded-2xl shadow-lg p-8 items-center max-w-md w-full">
        <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-6">
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
        </View>
        
        <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
          {title}
        </Text>
        
        <Text className="text-gray-600 text-center mb-8">
          {message}
        </Text>
        
        {onRetry && (
          <TouchableOpacity 
            onPress={onRetry}
            className="bg-blue-500 py-3 px-6 rounded-full"
          >
            <Text className="text-white font-semibold text-lg">
              Try Again
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Text className="text-gray-500 mt-8 text-center">
        If the problem persists, please contact our support team.
      </Text>
    </View>
  );
};

export default Error;