import React, { useState, useCallback } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { showToastMessage, useProfileStore } from '@/lib';
import { Server, Channel, ServerMember } from '@/types';
import { router } from 'expo-router';
import { Image } from 'react-native';
import { AvatarImage } from '../ui/avatar';
import { Text } from '../ui/text';
import { Divider } from '../ui/divider';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Box } from '../ui/box';
import { Button, ButtonText } from '../ui/button';
import { Input, InputField } from '../ui/input';
import { Fab, FabIcon, FabLabel } from '../ui/fab';
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from '../ui/alert-dialog';
import { AlertIcon } from '../ui/alert';
import { AddIcon, EditIcon, Icon } from '../ui/icon';
import { LinearGradient } from 'expo-linear-gradient';

// Component for rendering a single member
const MemberItem = React.memo(({ item, onChangeRole, onDeleteMember }: { item: ServerMember; onChangeRole: (id: string) => void; onDeleteMember: (id: string) => void }) => (
  <Animated.View entering={FadeIn} exiting={FadeOut}>
    <HStack className="justify-between items-center mb-3 p-2bg-opacity-30 rounded-lg">
      <HStack space='md' className="items-center space-x-3 gap-4 flex-row">
        <Image source={{ uri: item.image }} className="w-12 h-12 rounded-full border-2 border-blue-300 z-10" />
        <VStack>
          <HStack className="items-center space-x-2">
            <Text className="font-rbold text-white text-base">{item.name}</Text>
            {item.role === "ADMIN" && <Ionicons name="shield-checkmark" color="yellow" size={18} />}
          </HStack>
          <Text className="text-xs text-blue-200">{item.role}</Text>
        </VStack>
      </HStack>
      {item.role !== "ADMIN" && (
        <HStack className="space-x-2">
          <Button variant="outline" onPress={() => onChangeRole(item.id)} className="p-2 rounded-full">
            <Icon as={EditIcon} color="white"/>
          </Button>
          <Button variant="outline" onPress={() => onDeleteMember(item.id)} className="p-2 bg-rose-400 rounded-full">
            <MaterialIcons name="delete" color="white"/>
          </Button>
        </HStack>
      )}
    </HStack>
  </Animated.View>
));

// Component for rendering a single channel
const ChannelItem = React.memo(({ item, onEdit, onDelete }: { item: Channel; onEdit: () => void; onDelete: () => void }) => (
  <Animated.View entering={FadeIn} exiting={FadeOut}>
    <HStack className="justify-between items-center mb-3 p-2 bg-opacity-30 rounded-lg">
      <Text className="text-white text-lg font-rregular"># {item.name}</Text>
      {item.name !== "general" && (
        <HStack className="space-x-2">
          <Button variant="outline" onPress={onEdit} className="p-2 bg-blue-700 rounded-full">
            <Icon as={EditIcon} color="white"/>
          </Button>
          <Button variant="outline" onPress={onDelete} className="p-2 bg-red-700 rounded-full">
            <MaterialIcons name="delete" color="white"/>
          </Button>
        </HStack>
      )}
    </HStack>
  </Animated.View>
));

const AdminDashboard = ({ id, name, channels, members }: Server) => {
  const [state, setState] = useState({ serverName: name, members, channels, selectedChannel: undefined });
  const [isDeleteServerOpen, setIsDeleteServerOpen] = useState(false);
  const [isDeleteChannelOpen, setIsDeleteChannelOpen] = useState(false);
  const { profile } = useProfileStore();
  const currentUser = members.find(member => member.id === profile.id);

  const updateState = useCallback((key: string, value: any) => setState(prev => ({ ...prev, [key]: value })), []);

  const Custom = Animated.createAnimatedComponent(LinearGradient)

  const handleDeleteMember = useCallback((memberId: string) => {
    updateState('members', state.members.filter(member => member.id !== memberId));
    showToastMessage("Member deleted successfully");
  }, [state.members, updateState]);

  const handleChangeRole = useCallback((memberId: string) => {
    updateState('members', state.members?.map(member =>
      member.id === memberId ? { ...member, role: member.role === 'MEMBER' ? 'MODERATOR' : 'MEMBER' } : member
    ));
    showToastMessage("Member role updated");
  }, [state.members, updateState]);

  const handleDeleteChannel = useCallback(() => {
    if (state.selectedChannel) {
      updateState('channels', state.channels.filter(channel => channel.id !== state.selectedChannel?.id));
      setIsDeleteChannelOpen(false);
      showToastMessage(`Channel "${state.selectedChannel.name}" deleted`);
    }
  }, [state.selectedChannel, state.channels, updateState]);

  const handleDeleteServer = useCallback(() => {
    setIsDeleteServerOpen(false);
    showToastMessage("Server deleted successfully");
    // Add logic to navigate away or update UI after server deletion
  }, []);

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
        <Animated.View entering={FadeIn} className="p-1">
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=300' }}
            className="w-full h-56 rounded-xl mb-6 shadow-lg"
          />
          <HStack className="justify-between items-center mb-8">
            <Text className="text-4xl font-bold text-white shadow-text">Server Dashboard</Text>
            {currentUser?.role === "ADMIN" && (
              <Button
                className="bg-red-600 rounded-full px-4 py-2 shadow-lg"
                onPress={() => setIsDeleteServerOpen(true)}
              >
                <ButtonText className="text-sm font-rbold">Delete Server</ButtonText>
              </Button>
            )}
          </HStack>

          <VStack className="space-y-6">
          <Custom colors={['#0891b2','#155e75']} entering={FadeIn.delay(200)} className="bg-opacity-30 rounded-xl p-5 mb-5 border border-blue-400 shadow-blue-600">
              <Text className="text-2xl font-rbold mb-4 text-white">Server Settings</Text>
              <Input
                // value={state.serverName!}
                className="mb-4 bg-opacity-50 rounded-lg border-blue-300"
              >
                <InputField placeholder="Server Name" className="text-white" />
              </Input>
              <HStack className="space-x-3">
                <Button
                  className="flex-1 flex-row items-center justify-center rounded-lg py-1 bg-cyan-500"
                >
                  <MaterialIcons name="image" color="white"className="mr-2" />
                  <ButtonText className='font-rregular text-sm'>Change Server Image</ButtonText>
                </Button>
                <Button
                  variant="solid"
                  className="flex-1 flex-row items-center justify-center rounded-lg py-1 bg-cyan-500"
                >
                  <MaterialIcons name="panorama" color="white"className="mr-2" />
                  <ButtonText className='font-rregular text-sm'>Change Banner</ButtonText>
                </Button>
              </HStack>
            </Custom>

          <Custom
            colors={['#0891b2','#155e75']} 
            entering={FadeIn.delay(400)} 
            className="bg-blue-800 bg-opacity-30 rounded-xl mb-5 p-5 border border-blue-400 border-opacity-30 shadow-lg" 
          >
              <Text className="text-2xl font-rbold mb-4 text-white">Members</Text>
              <FlatList
                data={members}
                renderItem={({ item }) => (
                  <MemberItem
                    item={item}
                    onChangeRole={handleChangeRole}
                    onDeleteMember={handleDeleteMember}
                  />
                )}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <Divider className="my-2 bg-blue-300 opacity-30" />}
              />
            </Custom>

          <Custom
           colors={['#0891b2', '#155e75']} 
           entering={FadeIn.delay(600)} 
           className="bg-blue-800 bg-opacity-30 rounded-xl p-5 border border-blue-400 border-opacity-30 shadow-lg"
          >
            <Text className="text-2xl font-rbold mb-4 text-white">Channels</Text>
            <FlatList
              data={channels}
              renderItem={({ item }) => (
                <ChannelItem
                  item={item}
                  onEdit={() => {/* Add edit logic */ }}
                  onDelete={() => {
                    updateState('selectedChannel', item);
                    setIsDeleteChannelOpen(true);
                  }}
                />
              )}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <Divider className="my-2 bg-blue-300 opacity-30" />}
            />
            </Custom>
          </VStack>
        </Animated.View>

      <Fab
        size="lg"
        onPress={() => router.navigate(`/create-channel/${id}`)}
        className="absolute bottom-6 right-6 bg-blue-500 shadow-lg z-20"
      >
        <FabIcon as={AddIcon} />
        <FabLabel>New Channel</FabLabel>
      </Fab>

      <AlertDialog isOpen={isDeleteServerOpen} onClose={() => setIsDeleteServerOpen(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <HStack className="items-center space-x-2">
              <Text className="font-bold text-xl text-red-500">Delete Server</Text>
              <Icon as={AlertIcon} color="red" />
            </HStack>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-gray-700">Are you sure you want to delete this server? This action cannot be undone.</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="outline" onPress={() => setIsDeleteServerOpen(false)} className="mr-3">
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button variant="solid" onPress={handleDeleteServer} className="bg-red-500">
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog isOpen={isDeleteChannelOpen} onClose={() => setIsDeleteChannelOpen(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <HStack className="items-center space-x-2">
              <Text className="font-bold text-xl text-red-500">Delete Channel</Text>
              <AntDesign name="warning" color="red" size={24} />
            </HStack>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-gray-700">Are you sure you want to delete the channel "{state.selectedChannel?.name}"? This action cannot be undone.</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="outline" onPress={() => setIsDeleteChannelOpen(false)} className="mr-3">
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button variant="solid" onPress={handleDeleteChannel} className="bg-red-500">
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScrollView>
  );
};

export default AdminDashboard;