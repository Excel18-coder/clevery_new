import React, { useState, useCallback, memo, useEffect } from 'react';
import { KeyboardAvoidingView, ScrollView, Image, Pressable, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { showToastMessage, useProfileStore, useServer } from '@/lib';
import { Server, Channel, ServerMember } from '@/types';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AddIcon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/themed';
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { ErrorMessage, Loader } from '@/components';

const Custom = Animated.createAnimatedComponent(LinearGradient);

interface MemberItemProps {
  item: ServerMember;
  onChangeRole: (id: string) => void;
  onDeleteMember: (id: string) => void;
  isAdmin: boolean;
}
const MemberItem = memo(({ item, onChangeRole, onDeleteMember, isAdmin }: MemberItemProps) => (
  <HStack className="justify-between items-center mb-3 p-2 bg-transparent rounded-lg">
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
    {!isAdmin && (
      <HStack className="space-x-2">
        <Pressable onPress={() => onChangeRole(item.id)} className="p-2 rounded-full">
          <Ionicons name="create-outline" color="white" size={22}/>
        </Pressable>
        <Pressable onPress={() => onDeleteMember(item.id)} className="p-2 bg-rose-400 rounded-full">
          <MaterialIcons name="delete" color="white" size={22}/>
        </Pressable>
      </HStack>
    )}
  </HStack>
));

interface ChannelItemProps {
  item: Channel;
  onEdit: () => void;
  onDelete: () => void;
  isGeneral: boolean;
}
const ChannelItem = memo(({ item, onEdit, onDelete, isGeneral }: ChannelItemProps) => (
  <HStack className="justify-between items-center mb-3 p-2 bg-opacity-30 rounded-lg">
    <Text className="text-white text-lg font-rregular"># {item.name}</Text>
    {!isGeneral && (
      <HStack className="space-x-2">
        <Pressable onPress={onEdit} className="p-2 rounded-full">
          <Ionicons name="create-outline" color="white" size={22}/>
        </Pressable>
        <Pressable onPress={onDelete} className="p-2 rounded-full border-2">
          <MaterialIcons name="delete" color="red" size={22} className='text-red-700'/>
        </Pressable>
      </HStack>
    )}
  </HStack>
));

const SectionContainer = memo(({ title, children }: { title: string; children: React.ReactNode }) => (
  <Custom start={{ x: 0, y: 1 }} end={{ x: 1, y: 0.5 }} colors={['#0e7490', '#06b6d4']} entering={FadeIn.delay(200)} className=" rounded-xl p-5 mb-5 border border-blue-400 shadow-blue-600">
    <Text className="text-2xl font-rbold mb-4 text-white">{title}</Text>
    {children}
  </Custom>
));

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}
const ConfirmationDialog = memo(({ isOpen, onClose, onConfirm, title, message }: ConfirmationDialogProps) => (
  <AlertDialog isOpen={isOpen} onClose={onClose} size="md">
    <AlertDialogBackdrop />
    <AlertDialogContent>
      <AlertDialogHeader>
        <Text className="text-typography-950 font-semibold">{title}</Text>
      </AlertDialogHeader>
      <AlertDialogBody className="mt-3 mb-4">
        <Text size="sm">{message}</Text>
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button variant="outline" action="secondary" onPress={onClose} size="sm">
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button size="sm" onPress={onConfirm}>
          <ButtonText>Delete</ButtonText>
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
));

const AdminDashboard = () => {
  const [isDeleteServerOpen, setIsDeleteServerOpen] = useState(false);
  const [isDeleteChannelOpen, setIsDeleteChannelOpen] = useState(false);
  const { profile } = useProfileStore();
  const {id:serverId }=useLocalSearchParams();
  
  const {
    data: { id, name, channels, members },
    isLoading: loadingServer,
    refetch: refetchServer,
    error
  } = useServer(serverId as string);
  const [state, setState] = useState({ serverName: name, members, channels, selectedChannel: null });


  const currentUser = members.find(member => member.id === profile.id);
  const updateState = useCallback((key, value) => setState(prev => ({ ...prev, [key]: value })), []);

  const handleDeleteMember = useCallback((memberId) => {
    updateState('members', state.members.filter(member => member.id !== memberId));
    showToastMessage("Member deleted successfully");
  }, [state.members, updateState]);

  const handleChangeRole = useCallback((memberId) => {
    updateState('members', state.members?.map(member =>
      member.id === memberId ? { ...member, role: member.role === 'MEMBER' ? 'MODERATOR' : 'MEMBER' } : member
    ));
    showToastMessage("Member role updated");
  }, [state.members, updateState]);

  const handleDeleteChannel = useCallback(() => {
    if (state.selectedChannel) {
      updateState('channels', state.channels.filter(channel => channel.id !== state.selectedChannel.id));
      setIsDeleteChannelOpen(false);
      showToastMessage(`Channel "${state.selectedChannel.name}" deleted`);
    }
  }, [state.selectedChannel, state.channels, updateState]);

  const handleDeleteServer = useCallback(() => {
    setIsDeleteServerOpen(false);
    showToastMessage("Server deleted successfully");
    // Add logic to navigate away or update UI after server deletion
  }, []);
  if(loadingServer) return <Loader loadingText='Loading Admin Dashboard' subText='Please wait while we load your data' />

  if (error) return <ErrorMessage message='Failed to load server data' onRetry={refetchServer} />

  return (
    <ScrollView className="flex-1">
      <KeyboardAvoidingView behavior="padding">
        <Animated.View entering={FadeIn} className="p-1">
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=300' }}
            className="w-full h-56 rounded-xl mb-6 shadow-lg"
          />
          <HStack className="justify-between items-center mb-8">
            <Text className="text-4xl font-rbold shadow-text text-gray-700">Server Dashboard</Text>
            {currentUser?.role === "ADMIN" && (
              <Button
                className="bg-red-600 rounded-full px-4 py-2 shadow-lg"
                onPress={() => setIsDeleteServerOpen(true)}
              >
                <ButtonText className="text-sm font-rbold">Delete Server</ButtonText>
              </Button>
            )}
          </HStack>

          <SectionContainer title="Server Settings">
            <Input className="mb-4 bg-opacity-50 rounded-lg border-blue-300">
              <InputField placeholder={name} className="text-white" />
            </Input>
            <HStack className="space-x-3">
              <Button className="flex-1 flex-row items-center justify-center rounded-lg py-1 bg-cyan-500">
                <MaterialIcons name="image" color="white" className="mr-2" />
                <ButtonText className='font-rregular text-sm'>Change Server Image</ButtonText>
              </Button>
              <Button className="flex-1 flex-row items-center justify-center rounded-lg py-1 bg-cyan-500">
                <MaterialIcons name="panorama" color="white" className="mr-2" />
                <ButtonText className='font-rregular text-sm'>Change Banner</ButtonText>
              </Button>
            </HStack>
          </SectionContainer>

          <SectionContainer title="Members">
            {members?.map((member) => (
              <MemberItem
                key={member.id}
                item={member}
                onChangeRole={handleChangeRole}
                onDeleteMember={handleDeleteMember}
                isAdmin={member.role === "ADMIN"}
              />
            ))}
          </SectionContainer>

          <SectionContainer title="Channels">
            {channels?.map((channel) => (
              <ChannelItem
                key={channel.id}
                item={channel}
                onEdit={() => {/* Add edit logic */}}
                onDelete={() => {
                  updateState('selectedChannel', channel);
                  setIsDeleteChannelOpen(true);
                }}
                isGeneral={channel.name === "general"}
              />
            ))}
          </SectionContainer>
        </Animated.View>
      </KeyboardAvoidingView>

      <ConfirmationDialog
        isOpen={isDeleteServerOpen}
        onClose={() => setIsDeleteServerOpen(false)}
        onConfirm={handleDeleteServer}
        title="Are you sure you want to delete this Server?"
        message="Deleting the server will remove it permanently and cannot be undone."
      />

      <ConfirmationDialog
        isOpen={isDeleteChannelOpen}
        onClose={() => setIsDeleteChannelOpen(false)}
        onConfirm={handleDeleteChannel}
        title="Are you sure you want to delete this Channel?"
        message="Deleting the channel will remove it permanently and cannot be undone."
      />

      <Fab
        size="sm"
        onPress={() => router.navigate(`/create-channel/${id}`)}
        className="bg-blue-500 shadow-lg"
      >
        <FabIcon as={AddIcon} />
        <FabLabel className='font-rbold'>New Channel</FabLabel>
      </Fab>
    </ScrollView>
  );
};

export default memo(AdminDashboard);