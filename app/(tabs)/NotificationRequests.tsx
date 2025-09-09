import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const pendingData = [
  { id: "1", title: "Flat Tire", user: "Anthony", time: "4 min ago" },
  { id: "2", title: "Flat Tire", user: "Anthony", time: "16 min ago" },
  { id: "3", title: "Flat Tire", user: "Anthony", time: "29 min ago" },
  { id: "4", title: "Flat Tire", user: "Anthony", time: "48 min ago" },
];

export default function NotificationRequests() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{item?.title || "title"}</Text>
        <Text style={styles.sub}>{item?.user || "user"}</Text>
        <Text style={styles.time}>Pending · {item?.time || "time"}</Text>
      </View>
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={30} color="#CED46A" />
          <Text style={styles.headerTitle}>Notification Requests</Text>
          <Ionicons name="notifications-outline" size={30} color="#CED46A" />
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Complete Requests to increase your earnings
          </Text>
        </View>

        <FlatList
          data={pendingData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#075538",
    paddingTop: 25,
    padding: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#CED46A" },
  banner: {
    backgroundColor: "#CED46A",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  bannerText: { fontSize: 18, color: "#075538", fontWeight: "600" },
  card: {
    backgroundColor: "#0A6A44",
    borderRadius: 12,
    padding: 20,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#CED46A" },
  sub: { fontSize: 18, color: "#CED46A" },
  time: { fontSize: 16, color: "#CED46A", marginTop: 4 },
  btn: {
    backgroundColor: "#CED46A",
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  btnText: { fontSize: 18, color: "#075538", fontWeight: "bold" },
});
