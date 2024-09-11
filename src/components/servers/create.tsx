import React from 'react';
import { Image, TouchableOpacity, ScrollView } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { CreateServerData, CreateChannelData, User } from '@/types';
import { selectImage } from '@/lib';
import UploadImage from "../uploadimage";
import { VStack } from '@/components/ui/vstack';
import { Text, View } from '@/components/themed';
import FormField from '@/components/shared/form_field';
import { HStack } from '@/components/ui/hstack';
import { Select, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type Fields = CreateServerData | CreateChannelData;

interface CreateProps {
  handleSubmit: () => void;
  selectedUsers?: User[];
  fields: Fields;
  setFields: React.Dispatch<React.SetStateAction<Fields>>;
  setSelectedUsers?: React.Dispatch<React.SetStateAction<User[]>>;
  setPopupVisible?: (visible: boolean) => void;
  type: 'server' | 'channel';
  loading: boolean;
}

const AnimatedVStack = Animated.createAnimatedComponent(VStack);

const InfoCard = ({ title, description, icon }) => (
  <Animated.View 
    entering={FadeInRight.delay(300).duration(500)} 
    className="bg-gray-800 p-4 rounded-lg mb-4"
  >
    <HStack className="items-center mb-2">
      <Feather name={icon} size={20} color="#60A5FA" />
      <Text className="text-lg font-rbold ml-2 text-white">{title}</Text>
    </HStack>
    <Text className="text-sm text-gray-300 font-pmedium">{description}</Text>
  </Animated.View>
);

const MembersList = ({ selectedUsers, setPopupVisible }) => (
  <VStack className="space-y-2 mb-4">
    <Text className="text-lg font-rmedium text-gray-300">Members:</Text>
    <HStack className="space-x-2 items-center flex-wrap">
      {selectedUsers?.map((user) => (
        <View key={user.id} className="bg-gray-700 rounded-full p-1 mb-2">
          <Image
            source={{ uri: user.image }}
            className="w-8 h-8 rounded-full"
          />
        </View>
      ))}
      <TouchableOpacity
        className="w-10 h-10 rounded-full bg-blue-600 justify-center items-center mb-2"
        onPress={() => setPopupVisible?.(true)}
      >
        <Feather name='user-plus' size={20} color="white" />
      </TouchableOpacity>
    </HStack>
  </VStack>
);

const ChannelTypeSelect = ({ fields, setFields }) => (
  <Select
    placeholder='Channel Type'
    accessibilityLabel='Channel Type'
    defaultValue='TEXT'
    onValueChange={(v) => setFields({ ...fields, type: v } as CreateChannelData)}
    selectedValue={(fields as CreateChannelData).type}
    className="bg-gray-700 border-gray-600 mb-4"
  >
    <SelectItem label='Text' value='TEXT'>
      <Feather name='hash' size={16} color="white" />
    </SelectItem>
    <SelectItem label='Voice' value='AUDIO'>
      <Feather name='mic' size={16} color="white" />
    </SelectItem>
    <SelectItem label='Video' value='VIDEO' >
      <Feather name='video' size={16} color="white" />
    </SelectItem>
  </Select>
);

const Create: React.FC<CreateProps> = ({
  fields,
  setFields,
  handleSubmit,
  selectedUsers,
  setPopupVisible,
  type,
  loading
}) => {
  const chooseImage = async () => {
    const image = await selectImage();
    if (image) {
      setFields({ ...fields, image: image[0] });
    }
  };

  const isServer = type === 'server';
  const title = isServer ? 'Server' : 'Channel';

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="p-6">
        <AnimatedVStack className='space-y-6 items-center' entering={FadeInDown.duration(500)}>
          <Text className="text-3xl font-rbold text-white mb-2">Create Your {title}</Text>
          <Text className="text-base text-gray-400 text-center font-pmedium mb-6">
            This is where you'll connect with your community. Let's make it awesome!
          </Text>

          {isServer && (
            <InfoCard 
              title="Server Basics" 
              description="A server is your digital space. Name it, give it an icon, and invite your friends to start chatting!"
              icon="server"
            />
          )}

          {!isServer && (
            <InfoCard 
              title="Channel Types" 
              description="Choose between text, voice, or video channels to suit your community's needs."
              icon="layers"
            />
          )}

          {isServer && (
            <UploadImage
              image={fields.image!}
              chooseImage={chooseImage}
              removeImage={() => setFields({ ...fields, image: '' })}
            />
          )}

          <FormField
            title={`${title} Name`}
            value={fields.name}
            placeholder={isServer ? "e.g., Awesome Gaming Squad" : "e.g., general-chat"}
            onChangeText={(text) => setFields({ ...fields, name: text })}
            otherStyles="bg-gray-800 border-gray-700"
          />

          <FormField
            title="Description"
            value={fields.description!}
            placeholder={isServer ? "Describe what your server is about" : "What's this channel for?"}
            onChangeText={(text) => setFields({ ...fields, description: text })}
            otherStyles="bg-gray-800 border-gray-700"
          />

          {isServer && <MembersList selectedUsers={selectedUsers} setPopupVisible={setPopupVisible} />}

          {!isServer && <ChannelTypeSelect fields={fields} setFields={setFields} />}

          <Button
            onPress={handleSubmit}
            isDisabled={loading}
            className="font-semibold w-full bg-blue-600 py-3 rounded-lg"
          >
            {loading ? (
              <Text className="font-pregular text-white">Creating {title}...</Text>
            ) : (
              <Text className="font-pregular text-white">Create {title}</Text>
            )}
          </Button>
        </AnimatedVStack>
      </View>
    </ScrollView>
  );
};

export default Create;