import { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Text, Button, View } from '@/components';
import { Modal, ModalContent, ModalBody, ModalFooter } from '@/components/ui/modal';
import { endpoint } from '@/lib';

const FeedbackPage = () => {
  const theme = useTheme();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const handleRating = (value) => {
    setRating(value);
    buttonScale.value = withSpring(1.1, {}, () => {
      buttonScale.value = withSpring(1);
    });
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Oops!', 'Please select a rating before submitting.');
      return;
    }
    setIsModalVisible(true);
    
    await fetch(`${endpoint}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating, comment:feedback}),
    });
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setRating(0);
    setFeedback('');
  };

  return (
    <ScrollView 
      className="flex-1 p-5" 
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <Text className="text-3xl font-rbold mb-5">We Value Your Feedback!</Text>
        
        <View className="bg-blue-100 rounded-lg p-4 mb-5">
          <Text className="text-lg font-rmedium mb-2">Help Us Improve</Text>
          <Text className="text-base font-rregular">
            Your feedback is crucial in shaping the future of our app. Take a moment to share your thoughts and help us create an even better experience for you!
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-rmedium mb-3">How would you rate your experience?</Text>
          <View className="flex-row justify-between">
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => handleRating(value)}
                className={`p-2 rounded-full ${rating >= value ? 'bg-cyan-400' : 'bg-gray-500'}`}
              >
                <Feather 
                  name={rating >= value ? 'star' : 'star'} 
                  size={32} 
                  color={rating >= value ? '#fff' : '#666'} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-rmedium mb-3">Tell us more (optional)</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Share your thoughts, suggestions, or any issues you've encountered..."
            className="border border-gray-300 rounded-lg p-3 text-base"
            textAlignVertical="top"
          />
        </View>

        <Animated.View style={animatedButtonStyle}>
          <Button
            onPress={handleSubmit}
            className="bg-blue-500  rounded-lg"
          >
            <Text className="text-white text-lg font-rbold text-center">Submit Feedback</Text>
          </Button>
        </Animated.View>

        <View className="mt-6 bg-green-100 rounded-lg p-4">
          <Text className="text-lg font-rmedium mb-2">Did You Know?</Text>
          <Text className="text-base font-rregular">
            Your feedback directly influences our development priorities. Many of our recent features were inspired by user suggestions just like yours!
          </Text>
        </View>
      </Animated.View>

      <Modal isOpen={isModalVisible} onClose={closeModal}>
        <ModalContent className={'bg-white rounded-3xl'} style={{ backgroundColor: theme.colors.background }}>
          <ModalBody>
            <Feather name="check-circle" size={64} color="green" style={{ alignSelf: 'center', marginBottom: 20 }} />
            <Text className="text-2xl font-rbold text-center mb-4">Thank You!</Text>
            <Text className="text-lg font-rregular text-center mb-6">
              Your feedback has been successfully submitted. We appreciate your input and will use it to improve our app.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onPress={closeModal} className="bg-blue-500 px-4 py-2 rounded-full w-full">
              <Text className="text-white font-rmedium text-center">Close</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
};

export default FeedbackPage;