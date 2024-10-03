import { StyleSheet } from 'react-native';
import Animated, {
  FadeInDown, 
  FadeInUp 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Stack } from 'expo-router';

import { HStack, Text, View, VStack } from '@/components';
import { Image } from 'expo-image';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Something went wrong', presentation: "fullScreenModal" }} />
      <LinearGradient
        colors={['#f3e7e9', '#e3eeff']}
        style={{ flex: 1 }}
      >
        <VStack style={styles.container}>
          <Animated.View entering={FadeInDown.delay(300).duration(1000)}>
            <Image
              source={{uri:'https://cdn.sanity.io/files/mqczcmfz/production/8fb8af8eca62a6df498f3877d8052819709b677b.gif'}}
              style={styles.image}
              contentFit='cover'
              transition={1000}
            />
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(600).duration(1000)}>
            <Text style={styles.title}>Unexpected Error</Text>
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(900).duration(1000)}>
            <Text style={styles.subtitle}>
              We're sorry, but Clevery encountered an unexpected issue.
            </Text>
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(1200).duration(1000)} style={styles.fullWidth}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>What you can do:</Text>
              <HStack style={styles.infoItem}>
                <View style={[styles.iconBackground, { backgroundColor: '#EBF5FF' }]}>
                  <Ionicons name="refresh-circle-outline" size={28} color="#3B82F6" />
                </View>
                <Text style={styles.infoText}>Try refreshing the page</Text>
              </HStack>
              <HStack style={styles.infoItem}>
                <View style={[styles.iconBackground, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="time-outline" size={28} color="#10B981" />
                </View>
                <Text style={styles.infoText}>Wait a few minutes and try again</Text>
              </HStack>
              <HStack style={styles.infoItem}>
                <View style={[styles.iconBackground, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="mail-outline" size={28} color="#8B5CF6" />
                </View>
                <Text style={styles.infoText}>Contact support if the issue persists</Text>
              </HStack>
            </View>
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(1500).duration(1000)}>
            <Link href="/" style={styles.link}>
              <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <HStack style={styles.buttonContent}>
                  <Ionicons name="home-outline" size={24} color="white" />
                  <Text style={styles.buttonText}>Return to Home</Text>
                </HStack>
              </LinearGradient>
            </Link>
          </Animated.View>
        </VStack>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  image: {
    flex: 1,
    width: '120%',
  },
  title: {
    fontFamily: 'rbold',
    fontSize: 30,
    marginTop: 32,
    color: '#DC2626',
  },
  subtitle: {
    fontFamily: 'rregular',
    fontSize: 18,
    marginTop: 8,
    textAlign: 'center',
    color: '#374151',
  },
  fullWidth: {
    width: '100%',
  },
  infoBox: {
    marginTop: 24,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  infoTitle: {
    fontFamily: 'rmedium',
    fontSize: 20,
    marginBottom: 16,
    color: '#1F2937',
  },
  infoItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBackground: {
    padding: 8,
    borderRadius: 9999,
  },
  infoText: {
    fontFamily: 'rregular',
    fontSize: 16,
    marginLeft: 16,
    color: '#4B5563',
  },
  link: {
    marginTop: 32,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 9999,
  },
  buttonContent: {
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'rmedium',
    color: 'white',
    fontSize: 18,
    marginLeft: 8,
  },
});