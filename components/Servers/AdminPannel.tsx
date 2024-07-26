import React, { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Avatar,
  Image,
  Input,
  Button,
  Modal,
  AlertDialog,
  useToast,
  Pressable,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const AdminDashboard = () => {
  const [members, setMembers] = useState([
    { id: '1', name: 'John Doe', role: 'Member' },
    { id: '2', name: 'Jane Smith', role: 'Moderator' },
    // Add more members as needed
  ]);
  const [channels, setChannels] = useState([
    { id: '1', name: 'General' },
    { id: '2', name: 'Announcements' },
    // Add more channels as needed
  ]);
  const [serverName, setServerName] = useState('My Server');
  const [serverImage, setServerImage] = useState('https://example.com/server-image.jpg');
  const [bannerImage, setBannerImage] = useState('https://example.com/banner-image.jpg');
  const [isDeleteServerModalOpen, setIsDeleteServerModalOpen] = useState(false);
  const [isDeleteChannelModalOpen, setIsDeleteChannelModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const toast = useToast();

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter((member) => member.id !== memberId));
    toast.show({
      title: 'Member deleted',
      placement:"top",
      duration: 3000,
    });
  };

  const handleChangeRole = (memberId: string, newRole: string) => {
    setMembers(
      members.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
    toast.show({
      title: 'Role updated',
      placement:"top",
      duration: 3000,
    });
  };

  const handleDeleteChannel = (channelId: string) => {
    setChannels(channels.filter((channel) => channel.id !== channelId));
    setIsDeleteChannelModalOpen(false);
    toast.show({
      title: 'Channel deleted',
      placement:"top",
      duration: 3000,
    });
  };

  const handleDeleteServer = () => {
    // Implement server deletion logic here
    setIsDeleteServerModalOpen(false);
    toast.show({
      title: 'Server deleted',
      placement:"top",
      duration: 3000,
    });
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={{ flex: 1, padding: 20 }}
    >
      <Animatable.View animation="fadeIn" duration={1000}>
        <VStack space={4}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl" fontWeight="bold" color="white">
              Admin Dashboard
            </Text>
            <TouchableOpacity onPress={() => setIsDeleteServerModalOpen(true)}>
              <Icon
                as={MaterialIcons}
                name="delete-forever"
                size="6"
                color="red.500"
              />
            </TouchableOpacity>
          </HStack>

          <Box bg="white" rounded="lg" p={4}>
            <VStack space={4}>
              <Text fontSize="xl" fontWeight="bold">
                Server Settings
              </Text>
              <Input
                value={serverName}
                onChangeText={setServerName}
                placeholder="Server Name"
              />
              <Button onPress={() => console.log('Change server image')}>
                Change Server Image
              </Button>
              <Button onPress={() => console.log('Change banner image')}>
                Change Banner Image
              </Button>
            </VStack>
          </Box>

          <Box bg="white" rounded="lg" p={4}>
            <VStack space={4}>
              <Text fontSize="xl" fontWeight="bold">
                Members
              </Text>
              <FlatList
                data={members}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <HStack
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Avatar
                        size="sm"
                        source={{ uri: 'https://example.com/avatar.jpg' }}
                      />
                      <Text flex={1} mx={2}>
                        {item.name}
                      </Text>
                      <Text>{item.role}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          handleChangeRole(
                            item.id,
                            item.role === 'Member' ? 'Moderator' : 'Member'
                          )
                        }
                      >
                        <Icon
                          as={MaterialIcons}
                          name="edit"
                          size="5"
                          color="blue.500"
                          mr={2}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteMember(item.id)}>
                        <Icon
                          as={MaterialIcons}
                          name="delete"
                          size="5"
                          color="red.500"
                        />
                      </TouchableOpacity>
                    </HStack>
                  </Animatable.View>
                )}
              />
            </VStack>
          </Box>

          <Box bg="white" rounded="lg" p={4}>
            <VStack space={4}>
              <Text fontSize="xl" fontWeight="bold">
                Channels
              </Text>
              <FlatList
                data={channels}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Animatable.View animation="fadeInRight" duration={500}>
                    <HStack
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Text flex={1}>{item.name}</Text>
                      <TouchableOpacity
                        onPress={(item) => {
                          setSelectedChannel(item);
                          setIsDeleteChannelModalOpen(true);
                        }}
                      >
                        <Icon
                          as={MaterialIcons}
                          name="delete"
                          size="5"
                          color="red.500"
                        />
                      </TouchableOpacity>
                    </HStack>
                  </Animatable.View>
                )}
              />
            </VStack>
          </Box>
        </VStack>
      </Animatable.View>

      <AlertDialog
        isOpen={isDeleteServerModalOpen}
        onClose={() => setIsDeleteServerModalOpen(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Server</AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure you want to delete this server? This action cannot be
            undone.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => setIsDeleteServerModalOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={handleDeleteServer}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      <AlertDialog
        isOpen={isDeleteChannelModalOpen}
        onClose={() => setIsDeleteChannelModalOpen(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Channel</AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure you want to delete the channel "{selectedChannel?.name}"?
            This action cannot be undone.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => setIsDeleteChannelModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                colorScheme="danger"
                onPress={() => handleDeleteChannel(selectedChannel?.id)}
              >
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </LinearGradient>
  );
};

export default AdminDashboard;