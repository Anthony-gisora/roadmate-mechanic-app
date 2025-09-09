import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/Ionicons";

const MechanicDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.userName}>John</Text>
        </View>
        <Icon name="notifications-outline" size={34} color="#CED46A" />
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

      {/* Dashboard */}
      <Text style={styles.sectionTitle}>Dashboard</Text>

      {/* Active Request */}
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
            <Text style={styles.cardNumber}>1</Text>
            <Text style={styles.cardLabel}>Active Request</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewButton}>
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
            <Text style={styles.cardNumber}>26</Text>
            <Text style={styles.cardLabel}>Completed Requests</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewButton}>
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
            <Text style={styles.cardNumber}>16</Text>
            <Text style={styles.cardLabel}>Pending Requests</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>
      </Animatable.View>
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
});

export default MechanicDashboard;
