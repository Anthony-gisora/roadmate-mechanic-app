import { useMechanic } from "@/context/MechanicContext";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/Ionicons";

const urls = {
  dev: "http://localhost:5000",
  prod: "https://roadmateassist.onrender.com",
};

const MechanicDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCount, setActiveCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

  const { user } = useUser();
  const { signOut } = useAuth();
  const navigation = useNavigation();

  const { mechanic } = useMechanic();
  const router = useRouter();

  // Fetch requests from API
  const getRequests = async () => {
    if (!mechanic) {
      router.replace("/(auth)/mechanic-login");
    } else {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://roadmateassist.onrender.com/api/notifications/reqNotification"
        );

        const requests = res.data;

        setActiveCount(
          requests.filter(
            (r: any) =>
              r.status === "InProgress" &&
              r.servicedBy == mechanic.personalNumber
          ).length
        );
        setCompletedCount(
          requests.filter(
            (r: any) =>
              r.status === "completed" &&
              r.servicedBy == mechanic.personalNumber
          ).length
        );
        setPendingCount(
          requests.filter((r: any) => r.status === "pending").length
        );
        handleOfOnState();
      } catch (error: any) {
        console.log("Error fetching requests:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOfOnState = async () => {
    if (isOnline) {
      axios.put(`http://localhost:5000/api/auth/is-online/${mechanic.id}`, {
        online: "online",
      });
      console.log("you're online");
    } else {
      axios.put(`http://localhost:5000/api/auth/is-online/${mechanic.id}`, {
        online: "offline",
      });
      console.log("You're offline");
    }
  };

  useEffect(() => {
    getRequests();
  }, [user, mechanic, isOnline]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#CED46A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {user?.imageUrl ? (
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar} />
        )}

        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.userName}>
            {user?.firstName ? user.firstName : "Mechanic"}
          </Text>
        </View>

        {/* Notification and Menu */}
        <View style={styles.iconsRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate("NotificationRequests" as never)}
          >
            <Icon name="notifications-outline" size={32} color="#CED46A" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Icon name="menu-outline" size={36} color="#CED46A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Online Toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleTitle}>
          {isOnline ? "You are Online" : "Go Online"}
        </Text>
        <Switch
          value={isOnline}
          onValueChange={setIsOnline}
          thumbColor={isOnline ? "#CED46A" : "#fff"}
          trackColor={{ false: "#CED46A", true: "#CED46A" }}
        />
      </View>
      <Text style={styles.toggleSubtitle}>
        {isOnline
          ? "You are available for driver requests ✅"
          : "Switch on to be available for driver requests"}
      </Text>

      {/* Dashboard only visible when Online */}
      {isOnline && (
        <>
          <Text style={styles.sectionTitle}>Dashboard</Text>

          {/* Active Requests */}
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={200}
            style={styles.card}
          >
            <View style={styles.cardLeft}>
              <Icon
                name="time-outline"
                size={34}
                color="#075538"
                style={styles.cardIcon}
              />
              <View>
                <Text style={styles.cardNumber}>{activeCount}</Text>
                <Text style={styles.cardLabel}>Active Request</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => navigation.navigate("ActiveRequests" as never)}
            >
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </Animatable.View>

          {/* Completed Requests */}
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={400}
            style={styles.card}
          >
            <View style={styles.cardLeft}>
              <Icon
                name="checkmark-done-outline"
                size={34}
                color="#075538"
                style={styles.cardIcon}
              />
              <View>
                <Text style={styles.cardNumber}>{completedCount}</Text>
                <Text style={styles.cardLabel}>Completed Requests</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => navigation.navigate("CompletedRequests" as never)}
            >
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </Animatable.View>

          {/* Pending Requests */}
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={600}
            style={styles.card}
          >
            <View style={styles.cardLeft}>
              <Icon
                name="alert-circle-outline"
                size={34}
                color="#075538"
                style={styles.cardIcon}
              />
              <View>
                <Text style={styles.cardNumber}>{pendingCount}</Text>
                <Text style={styles.cardLabel}>Pending Requests</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() =>
                navigation.navigate("NotificationRequests" as never)
              }
            >
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </Animatable.View>
        </>
      )}

      {/* Floating Refresh Button */}
      {isOnline && (
        <TouchableOpacity style={styles.fab} onPress={getRequests}>
          <Icon name="refresh" size={30} color="#075538" />
        </TouchableOpacity>
      )}

      {/* Dropdown Menu Modal */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={async () => {
                setMenuVisible(false);
                await signOut();
              }}
            >
              <Icon name="log-out-outline" size={22} color="#075538" />
              <Text style={styles.menuText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#075538",
    paddingTop: 35,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#CED46A",
  },
  welcome: {
    flex: 1,
    marginLeft: 14,
  },
  welcomeText: {
    color: "#CED46A",
    fontSize: 19,
    opacity: 0.9,
  },
  userName: {
    color: "#CED46A",
    fontWeight: "bold",
    fontSize: 24,
  },
  iconsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  toggleTitle: {
    color: "#CED46A",
    fontWeight: "bold",
    fontSize: 21,
  },
  toggleSubtitle: {
    color: "#CED46A",
    fontSize: 17,
    marginBottom: 22,
    opacity: 0.9,
  },
  sectionTitle: {
    color: "#CED46A",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#CED46A",
    borderRadius: 14,
    padding: 22,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    marginRight: 16,
  },
  cardNumber: {
    color: "#075538",
    fontSize: 40,
    fontWeight: "900",
    marginBottom: -2,
  },
  cardLabel: {
    color: "#075538",
    fontSize: 19,
    fontWeight: "600",
  },
  viewButton: {
    backgroundColor: "#075538",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  viewText: {
    color: "#CED46A",
    fontWeight: "bold",
    fontSize: 18,
  },
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
  //  Top Menu Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "flex-end",
    paddingTop: 70,
    paddingRight: 12,
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 180,
    elevation: 5,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#075538",
  },
});

export default MechanicDashboard;
