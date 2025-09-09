import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const RequestDescription = () => {
  const [location, setLocation] = useState(null);

  // Request permission & fetch location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  // Build map HTML dynamically
  const leafletHTML = location
    ? `
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
            var map = L.map('map').setView([${location.latitude}, ${location.longitude}], 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            L.marker([${location.latitude}, ${location.longitude}]).addTo(map)
              .bindPopup("You are here 🚩")
              .openPopup();
          </script>
        </body>
      </html>
    `
    : "<h3 style='text-align:center;margin-top:50%;'>Fetching location...</h3>";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={34} color="#CED46A" />
          <Text style={styles.headerTitle}>Request Description</Text>
          <Ionicons name="notifications-outline" size={34} color="#CED46A" />
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: leafletHTML }}
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
            <Text style={styles.userText}>Tonny - Current Location</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="car-outline"
              size={22}
              color="#075538"
              style={styles.icon}
            />
            <Text style={styles.cardText}>Tire Bust</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="location-outline"
              size={22}
              color="#075538"
              style={styles.icon}
            />
            <Text style={styles.cardText}>Distance: 250 meters</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="cash-outline"
              size={22}
              color="#075538"
              style={styles.icon}
            />
            <Text style={styles.cardText}>Payment: Kshs. 500</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.declineBtn}>
              <Text style={styles.declineBtnText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptBtn}>
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RequestDescription;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 25,
    padding: 4,
    backgroundColor: "#075538",
  },
  container: {
    flex: 1,
    backgroundColor: "#075538",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#CED46A",
  },
  mapContainer: {
    flex: 1.3,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  webview: {
    flex: 1,
    borderRadius: 12,
  },
  bottomCard: {
    flex: 0.6,
    backgroundColor: "#CED46A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 22,
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#CED46A",
  },
  userText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "900",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#075538",
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#444",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
    marginRight: 8,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#075538",
  },
  declineBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#a83232",
  },
  acceptBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#075538",
  },
});
