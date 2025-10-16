import { useMechanic } from "@/context/MechanicContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { WebView } from "react-native-webview";

const RequestDescription = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const route = useRoute();
  const navigation = useNavigation() as any;

  const { mechanic } = useMechanic();

  if (!mechanic) {
    return console.log("no mechanic data");
  } else {
  }

  const {
    id,
    latitude,
    longitude,
    requestType,
    details,
    payment,
    userName,
    driverId,
  } =
    (route.params as {
      id: string;
      driverId: string;
      latitude: number;
      longitude: number;
      requestType?: string;
      details?: string;
      payment?: number;
      userName?: string;
    }) || {};

  const [mapHTML, setMapHTML] = useState("<h3>Loading map...</h3>");
  const [myCoords, setMyCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [status, setStatus] = useState<string>("pending"); // dynamic per request

  // Reset when a new request is opened
  useEffect(() => {
    setStatus("pending");
    setMapHTML("<h3>Loading map...</h3>");
    setMyCoords(null);
  }, [id]);

  // Get current device location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required.");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setMyCoords(loc.coords);
    })();
  }, [id]);

  // Build map HTML with two markers
  useEffect(() => {
    if (latitude && longitude && myCoords) {
      const leafletHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
            <style>
              #map { height: 100%; width: 100%; border-radius: 12px; }
              body { margin: 0; height: 100vh; }
            </style>
          </head>
          <body>
            <div id="map"></div>
            <script>
              var map = L.map('map').setView([${myCoords.latitude}, ${myCoords.longitude}], 14);

              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
              }).addTo(map);

              L.marker([${myCoords.latitude}, ${myCoords.longitude}], {title: "You"})
                .addTo(map)
                .bindPopup("📍 Your Position")
                .openPopup();

              L.marker([${latitude}, ${longitude}], {title: "Request"})
                .addTo(map)
                .bindPopup(" Request Destination 🚩")
                .openPopup();

              var group = new L.featureGroup([
                L.marker([${myCoords.latitude}, ${myCoords.longitude}]),
                L.marker([${latitude}, ${longitude}])
              ]);
              map.fitBounds(group.getBounds().pad(0.2));
            </script>
          </body>
        </html>
      `;
      setMapHTML(leafletHTML);
    }
  }, [latitude, longitude, myCoords, id]);

  // Accept request → update status
  const handleAccept = async () => {
    try {
      await axios.put(
        `https://roadmateassist.onrender.com/api/req/update-status/${id}`,

        { status: "inProgress", servicedBy: mechanic.personalNumber }
      );
      setStatus("inProgress");
      console.log(id);
    } catch (error: any) {
      console.error("Error updating request:", error.message);
      Alert.alert("Error", "Failed to update request. Try again.");
    }
  };

  // Complete request → update status
  const handleComplete = async () => {
    try {
      await handleSendPayment();
      await axios.put(
        `https://roadmateassist.onrender.com/api/req/update-complete/${id}`,
        { status: "completed", servicedBy: mechanic.personalNumber }
      );
      setShowPaymentModal(true);
      setStatus("completed");
      console.log(id);

      // Show Congrats for 3 seconds then navigate
      setTimeout(() => {
        navigation.navigate("NotificationRequests" as never);
      }, 3000);
    } catch (error: any) {
      console.error("Error completing request:", error.message);
      Alert.alert("Error", "Failed to complete request. Try again.");
    }
  };

  const handleSendPayment = async () => {
    if (!phoneNumber || !amount) {
      Alert.alert("Error", "Please enter phone number and amount");
      return;
    }

    try {
      setLoading(true);
      const stkResponse = await axios.post(
        "https://roadmateassist.onrender.com/stk/stkpush",
        {
          phone: phoneNumber,
          amount: Number(amount),
          requestId: id,
        }
      );

      if (stkResponse.data && stkResponse.data.ResponseDescription) {
        Alert.alert("STK Push Sent", "Please complete payment on your phone.");

        // Once STK push initiated, mark as completed
        await axios.put(
          `https://roadmateassist.onrender.com/api/req/update-complete/${id}`,
          { status: "completed", servicedBy: mechanic.personalNumber }
        );

        setStatus("completed");
        setShowPaymentModal(false);
        setPhoneNumber("");
        setAmount("");

        // Redirect after a short delay
        setTimeout(() => {
          navigation.navigate("NotificationRequests" as never);
        }, 3000);
      } else {
        Alert.alert("Error", "Failed to send STK push. Try again.");
      }
    } catch (error: any) {
      console.error("Payment error:", error.message);
      Alert.alert("Error", "Payment request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    navigation.navigate("NotificationRequests");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleDecline}>
            <Ionicons name="arrow-back" size={34} color="#CED46A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Request Description</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("NotificationRequests" as never)}
          >
            <Ionicons name="notifications-outline" size={34} color="#CED46A" />
          </TouchableOpacity>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: mapHTML }}
            style={styles.webview}
          />
        </View>

        {/* Bottom Card */}
        <View style={styles.bottomCard}>
          <View style={styles.userRow}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatar}
            />
            <Text style={styles.userText}>
              {userName || "Client"} - Request
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="car-outline"
              size={22}
              color="#075538"
              style={styles.icon}
            />
            <Text style={styles.cardText}>
              {requestType || "Service Request"}
            </Text>
          </View>

          {details && (
            <View style={styles.detailRow}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color="#075538"
                style={styles.icon}
              />
              <Text style={styles.cardText}>{details}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons
              name="location-outline"
              size={22}
              color="#075538"
              style={styles.icon}
            />
            <Text style={styles.cardText}>
              Request: Lat {latitude}, Lng {longitude}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("ChatScreen" as never)}
            style={styles.chatBtnView}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={38}
              color="#CED46A"
            />
            <Text style={styles.chatBtnText}>Open Chat</Text>
          </TouchableOpacity>

          {/* {myCoords && (
            <View style={styles.detailRow}>
              <Ionicons
                name="person-outline"
                size={22}
                color="#075538"
                style={styles.icon}
              />
              <Text style={styles.cardText}>
                You: Lat {myCoords.latitude.toFixed(5)}, Lng{" "}
                {myCoords.longitude.toFixed(5)}
              </Text>
            </View>
          )} */}

          {payment && (
            <View style={styles.detailRow}>
              <Ionicons
                name="cash-outline"
                size={22}
                color="#075538"
                style={styles.icon}
              />
              <Text style={styles.cardText}>Payment: Kshs. {payment}</Text>
            </View>
          )}

          {/* Action Buttons / Status */}
          <View style={styles.actionRow}>
            {status === "pending" && (
              <>
                <TouchableOpacity
                  style={styles.declineBtn}
                  onPress={handleDecline}
                >
                  <Text style={styles.declineBtnText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={handleAccept}
                >
                  <Text style={styles.acceptBtnText}>Accept</Text>
                </TouchableOpacity>
              </>
            )}

            {status === "inProgress" && (
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={handleComplete}
              >
                <Text style={styles.completeBtnText}>Complete</Text>
              </TouchableOpacity>
            )}

            {status === "completed" && (
              <View style={styles.congratsBox}>
                <Text style={styles.congratsText}>🎉 Congratulations! 🎉</Text>
              </View>
            )}
          </View>
        </View>
        {/* Payment Modal */}
        <Modal visible={showPaymentModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Complete Request - Payment</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter driver phone number (2547...)"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              {loading ? (
                <ActivityIndicator color="#075538" size="large" />
              ) : (
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setShowPaymentModal(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={handleSendPayment}
                  >
                    <Text style={styles.confirmText}>Send STK</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default RequestDescription;

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: 25, padding: 4, backgroundColor: "#075538" },
  container: { flex: 1, backgroundColor: "#075538" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#CED46A" },
  mapContainer: {
    flex: 1.3,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  webview: { flex: 1, borderRadius: 12 },
  bottomCard: {
    backgroundColor: "#CED46A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    padding: 16,
    paddingBottom: 20,
    flexShrink: 0,
    maxHeight: "50%",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  icon: { marginRight: 10 },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#CED46A",
  },
  userText: { fontSize: 20, color: "#333", fontWeight: "900" },
  cardText: { fontSize: 18, fontWeight: "600", color: "#333", flexShrink: 1 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  declineBtn: {
    flex: 1,
    padding: 14,
    marginRight: 8,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#a83232",
  },
  acceptBtn: {
    flex: 1,
    padding: 14,
    marginLeft: 8,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#075538",
  },
  completeBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#075538",
  },
  declineBtnText: { fontSize: 18, fontWeight: "bold", color: "#a83232" },
  acceptBtnText: { fontSize: 18, fontWeight: "bold", color: "#075538" },
  completeBtnText: { fontSize: 18, fontWeight: "bold", color: "#CED46A" },
  congratsBox: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#075538",
  },
  congratsText: { fontSize: 18, fontWeight: "bold", color: "#CED46A" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#CED46A",
    width: "85%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#075538",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#075538",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    color: "#075538",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginRight: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#075538",
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#075538",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  cancelText: { color: "#075538", fontWeight: "bold" },
  confirmText: { color: "#CED46A", fontWeight: "bold" },

  chatBtnView: {
    alignSelf: "center",
    padding: 2,
    width: "50%",
    backgroundColor: "#075538",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  chatBtnText: {
    fontSize: 18,
    color: "#CED46A",
    fontWeight: "bold",
  },
});
