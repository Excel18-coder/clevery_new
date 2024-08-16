import React from 'react';
import { Modal, Pressable } from 'native-base';
import { Image } from 'react-native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface FullScreenImageProps {
  isOpen: boolean;
  onClose: () => void;
  imageUri: string;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({ isOpen, onClose, imageUri }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <Modal.Content maxWidth="400px" width={width} height={height}>
        <Modal.CloseButton />
        <Modal.Body p={0}>
          <Pressable onPress={onClose}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
          </Pressable>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default FullScreenImage;