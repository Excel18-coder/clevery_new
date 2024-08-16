import { useState } from 'react';
import { FlatList } from 'react-native';
import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Avatar,
  Input,
  Button,
  IconButton,
  useDisclose,
  AlertDialog,
  Divider,
  ScrollView,
  Fab,
} from 'native-base';
import { showToastMessage, useProfileStore } from '@/lib';
import { Server,Channel, User, ServerMember } from '@/types';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native';

interface StateProps {
  serverName: string,
  members:ServerMember[],
  channels:Channel[],
  selectedChannel: Channel | undefined
}

interface AdminDashboardProps {
  server:Server
  onClose:any
}

const AdminDashboard = ({
  id,
  name,
  channels,
  members
}:Server) => {
  const [state, setState] = useState<StateProps>({
    serverName: name,
    members,
    channels,
    selectedChannel: undefined
  });

  const { isOpen: isDeleteServerOpen, onOpen: onDeleteServerOpen, onClose: onDeleteServerClose } = useDisclose();
  const { isOpen: isDeleteChannelOpen, onOpen: onDeleteChannelOpen, onClose: onDeleteChannelClose } = useDisclose();
  const { profile } = useProfileStore()
  const updateState = (key:string, value:any) => {
    setState(prevState => ({ ...prevState, [key]: value }));
  };
  const bannerImageUrl = 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=400'
  const currentUser = members.find(member => member.id === profile.id)

  const handleSubmit = () => {
    // Here you can use the state object to submit all changes
    console.log('Submitting changes:', state);
    showToastMessage("Changes saved successfully");
  };

  const handleDeleteMember = (memberId:string) => {
    updateState('members', state.members.filter(member => member.id !== memberId));
    showToastMessage("Member deleted successfully");
  };

  const handleChangeRole = (memberId:string) => {
    updateState('members', state.members.map(member =>
      member.id === memberId
        ? { ...member, role: member.role === 'MEMBER' ? 'MODERATOR' : 'MEMBER' }
        : member
    ));
    showToastMessage("Member role updated");
  };

  const handleDeleteChannel = () => {
    if (state.selectedChannel) {
      updateState('channels', state.channels.filter(channel => channel.id !== state?.selectedChannel?.id));
      onDeleteChannelClose();
      showToastMessage(`Channel "${state.selectedChannel.name}" deleted`);
    }
  };

  const handleDeleteServer = () => {
    // Implement server deletion logic here
    onDeleteServerClose();
    showToastMessage("Server deleted successfully");
  };

  return (
    <Box
      bg={{
        linearGradient: {
          colors: ['#4c669f', '#3b5998', '#192f6a'],
          start: [0, 0],
          end: [1, 1],
        },
      }}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <Box safeArea p={2}>
            <Image
              className='w-full h-[180px] flex-1 z-10 shadow-sm '
              source={{ uri: bannerImageUrl }}
            />
          <HStack justifyContent="space-between" alignItems="center" mb={6}>
            <Text fontSize="3xl" className='font-rbold' color="white">
              Server Dashboard
            </Text>
            {currentUser?.role == "ADMIN" &&
            <TouchableOpacity
              className='rounded-lg bg-rose-700 p-2 px-4 my'
              onPress={onDeleteServerOpen}
            >
              <Text className='text-sm  text-white font-rregular'>Delete</Text>
            </TouchableOpacity>
          }
          </HStack>

          <VStack space={6}>
            <Box  
              rounded="xl" 
              shadow={5} 
              p={5}
              bg={{
                linearGradient: {
                  colors: ['gray.400', '#3b5998', '#192f6a'],
                  start: [0, 0],
                  end: [1, 1],
                },
              }}
            >
              <Text fontSize="xl"  className='font-rmedium text-lg' mb={4}>
                Server Settings
              </Text>
              <Input
                value={state.serverName}
                // onChangeText={setState()}
                placeholder="Server Name"
                mb={4}
              />
              <HStack space={3}>
                <Button 
                  flex={1} 
                  leftIcon={<Icon as={MaterialIcons} name="image" />}
                  
                >
                  <Text className='font-rregular text-white text-sm'>Change Server Image</Text>
                </Button>
                <Button flex={1} leftIcon={<Icon as={MaterialIcons} name="panorama" />}>
                  <Text className='font-rregular text-white text-sm'>Change Banner</Text>
                </Button>
              </HStack>
            </Box>

            <Box
              rounded="xl" 
              shadow={5} p={5}
              bg={{
                linearGradient: {
                  colors: ['gray.400', '#3b5998', '#192f6a', '#192f6a'],
                  start: [0, 0],
                  end: [1, 1],
                },
              }}
            >
              <Text fontSize="xl" className='font-rmedium text-lg' mb={4}>
                Members
              </Text>
              <FlatList
                data={members}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <HStack justifyContent="space-between" alignItems="center" mb={3}>
                    <HStack space={3} alignItems="center">
                      <Avatar source={{ uri: item.image! }} />
                      <VStack>
                        <Text className='font-rmedium text-xs'>
                          {item.name}
                          {item.role == "ADMIN" &&
                            <Ionicons name='shield-checkmark-outline' color={'red'} size={14} style={{marginLeft:6}}/>
                          }
                        </Text>
                        <Text fontSize="xs" color="gray.500" className='font-rregular '>
                          {item.role}
                        </Text>
                      </VStack>
                    </HStack>

                    {item.role !== "ADMIN" &&
                      <HStack space={2}>
                        <IconButton
                          icon={<Icon as={MaterialIcons} name="edit" />}
                          size="sm"
                          variant="ghost"
                          onPress={() => handleChangeRole(item.id)}
                        />
                        <IconButton
                          icon={<Icon as={MaterialIcons} name="delete" />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onPress={() => handleDeleteMember(item.id)}
                        />
                      </HStack>
                    }
                  </HStack>
                )}
                ItemSeparatorComponent={() => <Divider my={2} />}
              />
            </Box>

            <Box
              rounded="xl" 
              shadow={5} 
              p={5}
              bg={{
                linearGradient: {
                  colors: ['gray.400', '#3b5998', '#3b5998', '#192f6a'],
                  start: [0, 0],
                  end: [1, 1],
                },
              }}
            >
              <Text fontSize="xl"  mb={4} className='font-rmedium text-lg'>
                Channels
              </Text>
              <FlatList
                data={channels}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <HStack justifyContent="space-between" alignItems="center" mb={3}>
                    <Text className='font-rregular'>{item.name}</Text>
                    
                    {item.name !== "general" &&
                      <HStack>
                        <IconButton
                          icon={<Icon as={Feather} name="edit" />}
                          size="sm"
                          colorScheme="black"
                          variant="ghost"
                        />
                        <IconButton
                          icon={<Icon as={MaterialIcons} name="delete" />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onPress={() => {
                            updateState('selectedChannel',item);
                            onDeleteChannelOpen();
                          }}
                        />
                      </HStack>
                    }
                  </HStack>
                )}
                ItemSeparatorComponent={() => <Divider my={2} />}
              />
            </Box>
          </VStack>
        </Box>
      </ScrollView>

      <Fab
        renderInPortal={false}
        shadow={2}
        size="sm"
        icon={<Icon color="white" as={MaterialIcons} name="add" size="sm" />}
        label="New Channel"
        onPress={()=>router.navigate(`/create-channel/${id}`)}
      />

      <AlertDialog isOpen={isDeleteServerOpen} onClose={onDeleteServerClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            <HStack >
              <Text className='font-rmedium  text-lg flex-row items-center'>Delete Server</Text>
              <Icon as={AntDesign} name="warning" ml={3} mt={1} colorScheme={'red'} color={'red.500'}/>
            </HStack>
          </AlertDialog.Header>
          <AlertDialog.Body>
          <Text className='font-rregular  text-xs'>
            Are you sure you want to delete this server? This action cannot be undone.
          </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onDeleteServerClose}>
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={handleDeleteServer}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      <AlertDialog isOpen={isDeleteChannelOpen} onClose={onDeleteChannelClose} >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header className='flex-col'>
            <HStack >
              <Text className='font-rmedium  text-lg flex-row items-center'>Delete Channel</Text>
              <Icon as={AntDesign} name="warning" ml={3} mt={1} colorScheme={'red'} color={'red.500'}/>
            </HStack>
          </AlertDialog.Header>
          <AlertDialog.Body >
            
          <Text className='font-rregular  text-xs'>
            Are you sure you want to delete the channel "{state.selectedChannel?.name}"?
            This action cannot be undone.
          </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onDeleteChannelClose}>
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={handleDeleteChannel}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Box>
  );
};

export default AdminDashboard;