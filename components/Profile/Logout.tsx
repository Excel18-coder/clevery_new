import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoutComponentProps {
  onLogout: () => void;
  onCancel: () => void;
  username: string;
}

const LogoutComponent: React.FC<LogoutComponentProps> = ({ onLogout, onCancel, username }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleLogoutPress = () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    } else {
      onLogout();
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <View style={styles.content}>
        <LottieView
          source={require('../../assets/animations/loading.json')}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.title}>We'll Miss You, {username}!</Text>
        <Text style={styles.subtitle}>Are you sure you want to leave?</Text>
        <View style={styles.benefitsContainer}>
          <BenefitItem icon="star" text="Exclusive content waiting for you" />
          <BenefitItem icon="notifications" text="Stay updated with latest features" />
          <BenefitItem icon="people" text="Connect with your friends" />
        </View>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.button, showConfirmation && styles.logoutButton]}
            onPress={handleLogoutPress}
          >
            <Text style={[styles.buttonText, showConfirmation && styles.logoutText]}>
              {showConfirmation ? 'Confirm Logout' : 'Log Out'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Stay Logged In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const BenefitItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View style={styles.benefitItem}>
    <Ionicons name={icon as any} size={24} color="#FFD700" />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#192f6a',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#4c669f',
    marginTop: 10,
    textAlign: 'center',
  },
  benefitsContainer: {
    marginTop: 20,
    width: '100%',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#3b5998',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF6347',
  },
  logoutText: {
    color: 'white',
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelText: {
    color: '#3b5998',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogoutComponent;