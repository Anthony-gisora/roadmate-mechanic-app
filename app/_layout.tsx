import { MechanicProvider } from "@/context/MechanicContext";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";

const CLERK_PUBLISHABLE_KEY =
  "pk_test_c3RpcnJlZC1tdWRmaXNoLTM2LmNsZXJrLmFjY291bnRzLmRldiQ";

// Token persistence for Expo
const tokenCache = {
  getToken: (key) => SecureStore.getItemAsync(key),
  saveToken: (key, value) => SecureStore.setItemAsync(key, value),
};

export default function App() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <MechanicProvider>
        <Slot />
      </MechanicProvider>
    </ClerkProvider>
  );
}
