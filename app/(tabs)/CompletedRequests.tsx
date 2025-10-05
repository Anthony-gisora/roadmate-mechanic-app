import { useMechanic } from "@/context/MechanicContext";
import { CreateAndSharePdf } from "@/utils/downloadOrg/download";
import { generateRecordTableHtml } from "@/utils/downloadOrg/generateDownloadFile";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { Asset } from "expo-asset";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CompletedRequests() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const navigation = useNavigation();
  const { mechanic } = useMechanic();

  const handleBack = () => {
    navigation.navigate("index");
  };

  // Fetch all completed requests
  const getRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://roadmateassist.onrender.com/api/notifications/reqNotification"
      );

      const completed = res.data.filter(
        (req: any) =>
          req.status === "completed" &&
          req.servicedBy === mechanic.personalNumber
      );

      setData(completed);
    } catch (error: any) {
      console.log("Error fetching requests:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter requests by selected date range
  const filterRequestsByDate = async () => {
    try {
      setShowFilter(false);
      setLoading(true);

      const res = await axios.get(
        "https://roadmateassist.onrender.com/api/notifications/reqNotification"
      );

      let completed = res.data.filter(
        (req: any) =>
          req.status === "completed" &&
          req.servicedBy === mechanic.personalNumber
      );

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        completed = completed.filter((req: any) => {
          const updatedAt = new Date(req.updatedAt);
          return updatedAt >= start && updatedAt <= end;
        });
      }

      setData(completed);
    } catch (error: any) {
      console.log("Error filtering requests:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate and download PDF
  const handleDownloads = async () => {
    const logoAsset = Asset.fromModule(require("../../assets/images/icon.png"));
    await logoAsset.downloadAsync(); // ensure image is available
    const logoUri = logoAsset.localUri || logoAsset.uri;
    CreateAndSharePdf(generateRecordTableHtml(data, logoUri));
  };

  useEffect(() => {
    getRequests();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={styles.title}>{item.requestType}</Text>
        <Text style={styles.sub} numberOfLines={1} ellipsizeMode="tail">
          {item.details}
        </Text>
        <Text style={styles.time}>
          Completed · {new Date(item.updatedAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={30} color="#CED46A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Completed Requests</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("NotificationRequests" as never)}
        >
          <Ionicons name="notifications-outline" size={34} color="#CED46A" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Congratulations! Keep going...</Text>
      </View>

      {/* Download + Filter Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.downloadBtn} onPress={handleDownloads}>
          <Ionicons
            name="print-outline"
            size={22}
            color="#075538"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.downloadBtnText}>Download Records</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowFilter(true)}
        >
          <Ionicons
            name="filter-outline"
            size={22}
            color="#075538"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.downloadBtnText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal visible={showFilter} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date Range</Text>

            {/* Start Date */}
            <Text style={styles.label}>Start Date:</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.dateText}>
                {startDate
                  ? startDate.toLocaleDateString()
                  : "Select Start Date"}
              </Text>
            </TouchableOpacity>

            {/* End Date */}
            <Text style={styles.label}>End Date:</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.dateText}>
                {endDate ? endDate.toLocaleDateString() : "Select End Date"}
              </Text>
            </TouchableOpacity>

            {/* Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={filterRequestsByDate}
              >
                <Text style={styles.modalBtnText}>Apply</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowFilter(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Start Date Picker */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        {/* End Date Picker */}
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}
      </Modal>

      {/* Loading Indicator / List */}
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

  // Buttons row
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 18,
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CED46A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CED46A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  downloadBtnText: {
    color: "#075538",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Cards
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

  // Floating Refresh
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "85%",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#075538",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    color: "#075538",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalBtn: {
    backgroundColor: "#075538",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalBtnText: {
    color: "#CED46A",
    fontWeight: "bold",
  },
  modalCancelBtn: {
    borderColor: "#075538",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalCancelText: {
    color: "#075538",
    fontWeight: "bold",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#075538",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#075538",
  },
});
