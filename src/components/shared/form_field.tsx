import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { EnterKeyHintTypeOptions, KeyboardType } from "react-native";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

interface Props {
  title: string,
  value: string,
  placeholder?: string,
  handleChangeText?: (v: string) => any,
  otherStyles?: string,
  keyboardType?: KeyboardType,
  enterKeyHint?: EnterKeyHintTypeOptions
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined
}
const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  autoCapitalize,
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-sm text-gray-100 font-pmedium">{title}</Text>

      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
        <TextInput
          className={`flex-1 text-white font-pregular text-sm`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType!}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>

            <Feather
              name={!showPassword ? "eye" : "eye-off"}
              className="w-6 h-6"
              color={"white"}
              size={15}
            />

          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
