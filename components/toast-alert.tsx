import { Alert,Center, CloseIcon, HStack, IconButton, Text, VStack, useToast } from "native-base";
import {  } from "react-native";

interface Toast {
  id:string
  title:string,
  description:string,
  variant?:string,
  isClosable?:boolean
}
const ToastAlert = ({
  id,
  title,
  description,
  variant,
  isClosable,
  ...rest
}:Toast) => {
  const toast = useToast();
  // const ToastDetails = [ {
  //   title: "Invalid email address",
  //   variant: "outline",
  //   description: "Please enter a valid email address"
  // }];

  return <Alert maxWidth="100%" alignSelf="center" flexDirection="row" status={status ? status : "info"} variant={variant} {...rest}>
  <VStack space={1} flexShrink={1} w="100%">
    <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
      <HStack space={2} flexShrink={1} alignItems="center">
        <Alert.Icon />
        <Text fontSize="md" fontWeight="medium" flexShrink={1} color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
          {title}
        </Text>
      </HStack>
      {isClosable ? <IconButton variant="unstyled" icon={<CloseIcon size="3" />} _icon={{
      color: variant === "solid" ? "lightText" : "darkText"
    }} onPress={() => toast.close(id)} /> : null}
    </HStack>
    <Text px="6" color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
      {description}
    </Text>
  </VStack>
</Alert>;
};

export default ToastAlert;