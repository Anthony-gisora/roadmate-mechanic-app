import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.bottomNav}>
        {state.routes.map((route, index) => {
          let iconName;
          if (route.name === "index") iconName = "home";
          if (route.name === "NotificationRequests")
            iconName = "notifications-outline";
          if (route.name === "ActiveRequests") iconName = "briefcase-outline";
          if (route.name === "CompletedRequests")
            iconName = "checkmark-done-outline";
          if (route.name === "Earnings") iconName = "cash-outline";
          if (route.name === "RequestDescription")
            iconName = "document-text-outline";

          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabButton}
            >
              <Ionicons
                name={iconName}
                size={26}
                color={isFocused ? "#075538" : "#CED46A"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#075538" />
      </View>
    );
  }

  if (!isSignedIn) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />

      <Tabs.Screen
        name="NotificationRequests"
        options={{ title: "Notifications", headerShown: false }}
      />
      <Tabs.Screen
        name="ActiveRequests"
        options={{ title: "Active", headerShown: false }}
      />
      <Tabs.Screen
        name="CompletedRequests"
        options={{ title: "Completed", headerShown: false }}
      />
      <Tabs.Screen
        name="Earnings"
        options={{ title: "Earnings", headerShown: false }}
      />
      <Tabs.Screen
        name="RequestDescription"
        options={{ title: "Request", headerShown: false }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#333",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
});
