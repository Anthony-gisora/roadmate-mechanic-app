import { Stack } from "expo-router";

const authLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="mechanic-login" options={{ headerShown: false }} />
      <Stack.Screen name="mechanic-signup" options={{ headerShown: false }} />
    </Stack>
  );
};

export default authLayout;
