import { useMechanic } from "@/context/MechanicContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotificationRequests() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { mechanic } = useMechanic();

  const handleBack = async () => {
    navigation.navigate("index");
  };

  const handleReqDetails = async (item) => {
    try {
      const res = await axios.get(
        "https://roadmateassist.onrender.com/api/notifications/reqNotification"
      );

      // filter only inprogress requests
      const hasActive = res.data.filter(
        (req: any) =>
          req.status === "InProgress" &&
          mechanic.personalNumber == req.servicedBy
      );

      if (hasActive.length !== 0) {
        Alert.alert(
          "Multiple Request Alert",
          "Kindly complete the previous Request you had marked InProgress first before you proceed...!"
        );
        console.log(hasActive);
      } else {
        navigation.navigate(
          "RequestDescription" as never,
          {
            id: item._id,
            driverId: item?.driverId,
            requestType: item?.requestType,
            details: item?.details,
            curStatus: item.status,
            latitude: item?.location[0] || 0,
            longitude: item?.location[1] || 0,
          } as never
        );
      }
    } catch (error: any) {
      console.log("Error fetching requests:", error.message);
    }
  };

  // Fetch requests from API
  const getRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://roadmateassist.onrender.com/api/notifications/reqNotification"
      );

      // filter only pending requests
      const pending = res.data.filter((req: any) => req.status === "pending");
      setData(pending);
    } catch (error: any) {
      console.log("Error fetching requests:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={styles.title}>{item?.requestType || "Unknown"}</Text>

        {/* truncate long descriptions */}
        <Text style={styles.sub} numberOfLines={1} ellipsizeMode="tail">
          {item?.details || "No details"}
        </Text>

        <Text style={styles.time}>
          Pending · {new Date(item.updatedAt).toLocaleString()}
        </Text>
      </View>

      {/* Navigate to RequestDescription with item._id + location */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => handleReqDetails(item)}
      >
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
        <Text style={styles.headerTitle}>Notification Requests</Text>
        <Ionicons name="notifications-outline" size={30} color="#CED46A" />
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Complete Requests to increase your earnings
        </Text>
      </View>

      {/* Loader or List */}
      {loading ? (
        <ActivityIndicator size="large" color="#CED46A" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }} // leave space for FAB
          ListEmptyComponent={
            <Text
              style={{ color: "#CED46A", fontSize: 18, textAlign: "center" }}
            >
              No pending requests yet.
            </Text>
          }
        />
      )}

      {/* Floating Refresh Button */}
      <TouchableOpacity style={styles.fab} onPress={getRequests}>
        <Ionicons name="refresh" size={28} color="#075538" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#075538",
    paddingTop: 35,
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
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#CED46A" },
  sub: { fontSize: 18, color: "#CED46A", flexShrink: 1 },
  time: { fontSize: 16, color: "#CED46A", marginTop: 4 },
  btn: {
    backgroundColor: "#CED46A",
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnText: { fontSize: 18, color: "#075538", fontWeight: "bold" },

  // Floating Action Button
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#CED46A",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
