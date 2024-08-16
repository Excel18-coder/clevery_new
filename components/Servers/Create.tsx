import { Avatar, Button, Divider, HStack, Select, VStack } from "native-base";
import { CreateServerData, CreateChannelData, User } from '@/types';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import FormField from '@/components/auth/FormField';
import { Text, View } from '@/components/Themed';
import UploadImage from './upload-image';
import { selectImage } from '@/lib';

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
    <View className="flex-1 p-6">
      <VStack space={6} alignItems="center">
        <Text className="text-2xl font-rbold ">Create Your {title}</Text>
        <Text className="text-base text-gray-500 text-center font-pmedium">
          This is where you hang out with your friends. Create and start talking!
        </Text>

        {isServer && (
          <UploadImage
            image={fields.image}
            chooseImage={chooseImage}
            removeImage={() => setFields({ ...fields, image: '' })}
          />
        )}

        <FormField
          title={`${title} Name`}
          value={fields.name}
          placeholder={isServer ?"Your server name":"general"}
          handleChangeText={(text) => setFields({ ...fields, name: text })}
        />

        <FormField
          title="Description"
          value={fields.description!}
          placeholder={isServer ?"Describe your server ":"Describe your channel"}
          handleChangeText={(text) => setFields({ ...fields, description: text })}
        />

        {isServer && (
          <VStack space={3} w="100%">
            <Text className="text-lg font-rregular ">Members:</Text>
            <HStack flexWrap="wrap" space={2}>
              {selectedUsers?.map((user) => (
                <Avatar
                  key={user.id}
                  source={{ uri: user.image }}
                  size="md"
                >
                  {user.name.charAt(0)}
                </Avatar>
              ))}
              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-gray-600 justify-center items-center"
                onPress={() => setPopupVisible?.(true)}
              >
                <Feather name='user-plus' size={24} color="white" />
              </TouchableOpacity>
            </HStack>
          </VStack>
        )}

        {!isServer && (
          <Select
            placeholder='Channel Type'
            accessibilityLabel='Channel Type'
            _selectedItem={{ bg: "blue.600" }}
            defaultValue='TEXT'
            onValueChange={(v) => setFields({ ...fields, type: v } as CreateChannelData)}
            w="100%"
            borderColor="gray.700"
            color="gray.400"
            selectedValue={(fields as CreateChannelData).type}
          >
            <Select.Item label='Text' value='TEXT' leftIcon={<Feather name='hash' size={16} color="white" />} />
            <Select.Item label='Voice' value='AUDIO' leftIcon={<Feather name='mic' size={16} color="white" />} />
            <Select.Item label='Video' value='VIDEO' leftIcon={<Feather name='video' size={16} color="white" />} />
          </Select>
        )}

        <Divider my={4} bg="gray.600" />

        <Button
          onPress={handleSubmit}
          isLoading={loading}
          isLoadingText="Creating..."
          colorScheme="blue"
          size="lg"
          w="full"
          className="font-semibold"
        >
          <Text className="font-pregular text-white ">Create {title}</Text>
        </Button>
      </VStack>
    </View>
  );
};

export default Create;