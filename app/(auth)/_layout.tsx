import { Stack } from "expo-router";

const authLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="mechanic-login" options={{ headerShown: false }} />
      <Stack.Screen name="mechanic-signup" options={{ headerShown: false }} />
      <Stack.Screen
        name="mechanic-reset-password"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="mechanic-forgot-password"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="mechanic-verify-code"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default authLayout;
