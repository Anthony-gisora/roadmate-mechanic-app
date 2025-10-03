import { useMechanic } from "@/context/MechanicContext";
import { handleDownload } from "@/utils/downloadOrg/download";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CompletedRequests() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const { mechanic } = useMechanic();

  const handleBack = async () => {
    navigation.navigate("index");
  };

  // Fetch requests from API
  const getRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://roadmateassist.onrender.com/api/notifications/reqNotification"
      );

      // filter only completed requests
      const completed = res.data.filter(
        (req: any) =>
          req.status === "completed" &&
          req.servicedBy == mechanic.personalNumber
      );

      setData(completed);
    } catch (error: any) {
      console.log("Error fetching requests:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloads = () => {
    handleDownload(data);
  };

  useEffect(() => {
    getRequests();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={styles.title}>{item.requestType}</Text>

        {/* Truncate long description */}
        <Text style={styles.sub} numberOfLines={1} ellipsizeMode="tail">
          {item.details}
        </Text>

        <Text style={styles.time}>
          Completed · {new Date(item.updatedAt).toLocaleString()}
        </Text>
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={30} color="#CED46A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Completed Request</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("NotificationRequests" as never)}
        >
          <Ionicons name="notifications-outline" size={34} color="#CED46A" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Congratulations! Keep going...</Text>
        <TouchableOpacity onPress={() => handleDownloads()}>
          <Text>Download</Text>
        </TouchableOpacity>
      </View>

      {/* Loading indicator */}
      {loading ? (
        <View>
          <ActivityIndicator size="large" color="#CED46A" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text
              style={{ color: "#CED46A", fontSize: 18, textAlign: "center" }}
            >
              No completed requests yet.
            </Text>
          }
        />
      )}

      {/* Floating Refresh Button */}
      <TouchableOpacity style={styles.fab} onPress={getRequests}>
        <Ionicons name="refresh" size={30} color="#075538" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#075538", padding: 18 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#CED46A" },
  banner: {
    backgroundColor: "#CED46A",
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
    alignItems: "center",
  },
  bannerText: { color: "#075538", fontWeight: "600", fontSize: 18 },
  card: {
    backgroundColor: "#0A6A44",
    borderRadius: 12,
    padding: 20,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#CED46A" },
  sub: { fontSize: 18, color: "#CED46A", flexShrink: 1 },
  time: { fontSize: 16, color: "#CED46A", marginTop: 4 },
  btn: {
    backgroundColor: "#CED46A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnText: { color: "#075538", fontWeight: "bold", fontSize: 16 },

  // Floating button styles
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#CED46A",
    padding: 18,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
