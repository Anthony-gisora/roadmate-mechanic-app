import { useMechanic } from "@/context/MechanicContext";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const URL_API = "https://roadmateassist.onrender.com/api/auth/login";

const MechanicLogin = () => {
  const [personalNumber, setPersonalNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useUser();
  const { setMechanic } = useMechanic();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(URL_API, {
        personalNumber,
        password,
        mechCLkId: user?.id,
      });

      const mechanic = res.data;
      setLoading(false);

      setMechanic(mechanic.mechanic);
      console.log(mechanic);

      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Login error:", err.message);
      setError("Check PersonalNumber, Password or email logged through");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* Logo */}
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Mechanic Login</Text>

            {/* Personal Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Personal Number</Text>
              <TextInput
                value={personalNumber}
                onChangeText={setPersonalNumber}
                placeholder="e.g. MECH-00123"
                placeholderTextColor="#888"
                style={styles.input}
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#888"
                secureTextEntry
                style={styles.input}
                returnKeyType="done"
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/mechanic-forgot-password")}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Error Message */}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#075538" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Register */}
            <Text style={styles.footerText}>
              Don’t have a personal number?{" "}
              <Text
                style={styles.link}
                onPress={() => router.push("/(auth)/mechanic-signup")}
              >
                Register as Mechanic
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CED46A",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#075538",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 18,
    width: "100%",
  },
  label: {
    color: "#075538",
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CED46A",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: "#075538",
    fontWeight: "600",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#075538",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#CED46A",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  footerText: {
    textAlign: "center",
    color: "#075538",
    marginTop: 20,
    fontSize: 14,
  },
  link: {
    color: "#075538",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});

export default MechanicLogin;
