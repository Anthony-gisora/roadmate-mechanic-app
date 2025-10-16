import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const MechanicDiscovery = () => {
  const navigation = useNavigation();
  const [coords, setCoords] = useState(null);
  const [places, setPlaces] = useState([]);
  const [mapHTML, setMapHTML] = useState("<h3>Loading map...</h3>");
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fadeAnim = new Animated.Value(0);

  const services = [
    { id: 1, name: "🔧 Engine Repair", desc: "Engine diagnostics & tune-up" },
    { id: 2, name: "🛞 Tire Replacement", desc: "Wheel alignment & tire fix" },
    { id: 3, name: "🧴 Oil Change", desc: "Quick oil & filter replacement" },
    { id: 4, name: "🔋 Battery Check", desc: "Test & replace car batteries" },
    { id: 5, name: "🚗 Brake Inspection", desc: "Brake pad & fluid check" },
    { id: 6, name: "⚙️ Gearbox Service", desc: "Transmission maintenance" },
    { id: 7, name: "🪞 Body & Paint Work", desc: "Body repair & polishing" },
  ];

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeIn();
  }, [showMap]);

  useEffect(() => {
    if (showMap) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Location access is required.");
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setCoords(loc.coords);
        fetchNearbyPlaces(loc.coords.latitude, loc.coords.longitude);
      })();
    }
  }, [showMap]);

  const fetchNearbyPlaces = async (lat, lon) => {
    setLoading(true);
    setError(false);

    const query = `
      [out:json];
      (
        node["amenity"="fuel"](around:800,${lat},${lon});
        node["shop"="car_parts"](around:800,${lat},${lon});
        node["amenity"="car_repair"](around:800,${lat},${lon});
        node["craft"="mechanic"](around:800,${lat},${lon});
      );
      out;
    `;

    const servers = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
    ];

    let success = false;

    for (let i = 0; i < servers.length && !success; i++) {
      const url = `${servers[i]}?data=${encodeURIComponent(query)}`;
      try {
        const res = await axios.get(url, { timeout: 8000 });
        if (res.data && res.data.elements) {
          setPlaces(res.data.elements);
          success = true;
        }
      } catch (err) {
        console.warn(`⚠️ Overpass server ${i + 1} failed:`, err.message);
        if (i === servers.length - 1) {
          setError(true);
        }
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (coords) {
      const markersJS = places
        .map(
          (p) => `
          L.marker([${p.lat}, ${p.lon}], {title: "${p.tags.name || "Unknown"}"})
            .addTo(map)
            .bindPopup("<b>${p.tags.name || "Unnamed"}</b><br>${
            p.tags.shop || p.tags.amenity || p.tags.craft || ""
          }");
        `
        )
        .join("");

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
              var map = L.map('map').setView([${coords.latitude}, ${coords.longitude}], 14);
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
              }).addTo(map);
              L.marker([${coords.latitude}, ${coords.longitude}], {title: "You"})
                .addTo(map)
                .bindPopup("📍 Your Location")
                .openPopup();
              L.circle([${coords.latitude}, ${coords.longitude}], {
                color: '#CED46A',
                fillColor: 'rgba(206,212,106,0.3)',
                radius: 150
              }).addTo(map);
              ${markersJS}
            </script>
          </body>
        </html>
      `;
      setMapHTML(leafletHTML);
    }
  }, [coords, places]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#075538" barStyle="light-content" />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#075538" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Discover Nearby</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="compass-outline" size={24} color="#075538" />
          </TouchableOpacity>
        </View>

        {!showMap ? (
          <>
            <Text style={styles.subTitle}>
              Select a service to find nearby help
            </Text>
            <FlatList
              data={services}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardDesc}>{item.desc}</Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
            <TouchableOpacity
              style={styles.fab}
              onPress={() => setShowMap(true)}
            >
              <Ionicons name="navigate" size={28} color="#075538" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.mapContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#CED46A" />
                  <Text style={styles.loadingText}>
                    Searching for garages & fuel stations...
                  </Text>
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={40} color="#CED46A" />
                  <Text style={styles.errorText}>
                    Failed to fetch nearby places
                  </Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() =>
                      fetchNearbyPlaces(coords.latitude, coords.longitude)
                    }
                  >
                    <Ionicons name="refresh" size={20} color="#075538" />
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : !coords ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#CED46A" />
                  <Text style={styles.loadingText}>
                    Fetching your location...
                  </Text>
                </View>
              ) : (
                <WebView
                  originWhitelist={["*"]}
                  source={{ html: mapHTML }}
                  style={styles.webview}
                />
              )}
            </View>

            <View style={styles.bottomCard}>
              <Text style={styles.bottomTitle}>
                Nearby Garages & Fuel Stations
              </Text>
              {places.length === 0 ? (
                <Text style={styles.bottomText}>
                  No nearby results within 800m.
                </Text>
              ) : (
                places.slice(0, 5).map((p, i) => (
                  <View key={i} style={styles.detailRow}>
                    <Ionicons name="build" size={18} color="#CED46A" />
                    <Text style={styles.bottomText}>
                      {p.tags.name || "Unnamed"}{" "}
                      {p.tags.shop ? `(${p.tags.shop})` : ""}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

export default MechanicDiscovery;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#075538" },
  container: { flex: 1, backgroundColor: "#075538" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  iconButton: {
    backgroundColor: "#CED46A",
    padding: 8,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#CED46A",
  },
  subTitle: {
    color: "#CED46A",
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 18,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#CED46A",
    marginHorizontal: 18,
    marginVertical: 6,
    borderRadius: 14,
    padding: 14,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#075538" },
  cardDesc: { color: "#075538", fontSize: 15, marginTop: 4 },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 25,
    backgroundColor: "#CED46A",
    padding: 18,
    borderRadius: 50,
    elevation: 5,
  },

  mapContainer: {
    flex: 1.2,
    margin: 18,
    borderRadius: 16,
    overflow: "hidden",
  },
  webview: { flex: 1 },

  bottomCard: {
    backgroundColor: "#CED46A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  bottomTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#075538",
    marginBottom: 8,
  },
  detailRow: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  bottomText: { color: "#075538", fontSize: 16, marginLeft: 8 },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#CED46A", marginTop: 8 },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#075538",
    padding: 20,
  },
  errorText: {
    color: "#CED46A",
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CED46A",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryText: {
    color: "#075538",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
});
