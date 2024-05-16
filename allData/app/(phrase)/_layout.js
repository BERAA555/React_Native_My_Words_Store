import { Stack, useRouter } from "expo-router";
import { Text, View, Button, Pressable, Dimensions } from "react-native";
import { ModalPage, ModalPagePhrase } from "../../constant/import";
import { AntDesign } from "@expo/vector-icons";

export default function StackLayout() {
  const router = useRouter(); //
  const { height, width } = Dimensions.get("window");
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Phrases"
        options={{
          headerTitle: "Phrases",
          headerShown: true,
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#000",
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerTitleStyle: {},
          headerLeft: () => (
            <Pressable onPress={() => router.push("/Phrase")}>
              <AntDesign name="left" size={24} color="black" />
            </Pressable>
          ),
        }}
      ></Stack.Screen>
    </Stack>
  );
}
