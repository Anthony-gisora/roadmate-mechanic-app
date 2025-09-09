import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.bottomNav}>
      {state.routes.map((route, index) => {
        let iconName;
        if (route.name === "index") iconName = "home";
        if (route.name === "NotificationRequests")
          iconName = "notifications-outline";
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
  );
}

export default function RootLayout() {
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
});
