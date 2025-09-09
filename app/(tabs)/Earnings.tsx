import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Earnings = () => {
  const jobs = [
    { id: 1, type: "Flat Tire", amount: 500, time: "4 min ago" },
    { id: 2, type: "Engine Repair", amount: 1500, time: "13 min ago" },
    { id: 3, type: "Tow", amount: 600, time: "17 min ago" },
    { id: 4, type: "Flat Tire", amount: 500, time: "45 min ago" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={34} color="#CED46A" />
          <Text style={styles.headerTitle}>Earnings</Text>
          <Ionicons name="notifications-outline" size={34} color="#CED46A" />
        </View>

        {/* Total Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceText}>Kshs. 2,000</Text>
          <TouchableOpacity style={styles.withdrawBtn}>
            <Text style={styles.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Earnings List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {jobs.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <View>
                <Text style={styles.jobTitle}>{job.type}</Text>
                <Text style={styles.jobAmount}>Kshs. {job.amount}</Text>
                <Text style={styles.jobTime}>Paid • {job.time}</Text>
              </View>
              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewText}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Earnings;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#075538",
    paddingTop: 10,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#075538",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#CED46A",
  },
  balanceCard: {
    backgroundColor: "#CED46A",
    padding: 24,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 22,
  },
  balanceLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#075538",
    marginBottom: 6,
  },
  balanceText: {
    fontSize: 28, // emphasized balance
    fontWeight: "bold",
    color: "#075538",
  },
  withdrawBtn: {
    marginTop: 14,
    backgroundColor: "#075538",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  withdrawText: {
    color: "#CED46A",
    fontSize: 18,
    fontWeight: "bold",
  },
  jobCard: {
    backgroundColor: "#CED46A",
    padding: 20,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 20, // bigger
    fontWeight: "bold",
    color: "#075538",
  },
  jobAmount: {
    fontSize: 18, // bigger
    color: "#075538",
    fontWeight: "600",
    marginTop: 4,
  },
  jobTime: {
    fontSize: 16, // bigger
    color: "#075538",
    marginTop: 6,
  },
  viewBtn: {
    backgroundColor: "#075538",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  viewText: {
    fontSize: 18, // bigger
    fontWeight: "bold",
    color: "#CED46A",
  },
});
