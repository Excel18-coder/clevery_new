import { useState } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert } from "react-native";

import { CustomButton, FormField,Butttons } from "@/components";
import { authHooks, useCreateEmailUser } from "@/lib";
import { useToast } from "native-base";
import ToastAlert from "@/components/toast-alert";

type AuthProviders = "google" | "facebook" | "github";
const SignUp = () => {

  const {
     googleAsync,facebookAsync,gitAsync
   }= authHooks()
   const toast = useToast();
   
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  
const {
  mutateAsync:createUser,
  isPending:creating,
  isError:error
} = useCreateEmailUser()

const signInWithProvider = async (provider: AuthProviders) => {
  if (provider === 'google') return googleAsync();
  if (provider === 'facebook') return facebookAsync();
  if (provider === 'github') return gitAsync()
}

  const submit = async () => {
    const {email,password,username} =form
    if (username === "" || email === "" || password === "") {
      return  toast.show({
        title: "Please fill in all fields",
        placement: "top"
      })
    }

    try {
      await createUser(form)
       
      // router.replace("/");
    } catch (error:any) {
      console.log("Failed to create user: ",error.message)
      return(
      <ToastAlert
       title="Something went wrong" 
       description={error.message}
       id="sign-up" 
      />
    )
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-2"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Sign Up to Clevery
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e:any) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e:any) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e:any) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7 mb-3"
            isLoading={creating}
          />

        <Butttons
          signInWithProvider={(v)=>signInWithProvider(v)}
        />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
