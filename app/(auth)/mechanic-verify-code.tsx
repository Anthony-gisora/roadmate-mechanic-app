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

export const apiUrl = {
  dev: "http://localhost:5000/api/auth/verify-reset-code",
  prod: "https://roadmateassist.onrender.com/api/auth/verify-reset-code",
};

const URL_API = apiUrl.prod;

const MechanicVerifyCode = () => {
  const [personalNumber, setPersonalNumber] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleVerifyCode = async () => {
    if (!personalNumber.trim() || !code.trim()) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(URL_API, { personalNumber, code });
      setLoading(false);
      setMessage(res.data.message || "Code verified successfully!");

      // Navigate to reset password screen
      setTimeout(() => {
        router.push({
          pathname: "/(auth)/mechanic-reset-password",
          params: { personalNumber },
        });
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          "Invalid or expired code. Please check and try again."
      );
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            {/* Logo */}
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Verify Reset Code</Text>
            <Text style={styles.subtitle}>
              Enter Your verified mechanic PersonalNumber to continue.
            </Text>

            {/* personalNumber */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Registered Personal Number</Text>
              <TextInput
                value={personalNumber}
                onChangeText={setPersonalNumber}
                placeholder="e.g. Mech-XXX"
                placeholderTextColor="#888"
                style={styles.input}
                keyboardType="personalNumber-address"
                autoCapitalize="none"
              />
            </View>

            {/* Code */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="Enter the code you received"
                placeholderTextColor="#888"
                style={styles.input}
                keyboardType="number-pad"
              />
            </View>

            {/* Feedback */}
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {message ? <Text style={styles.success}>{message}</Text> : null}

            {/* Verify Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#075538" />
              ) : (
                <Text style={styles.buttonText}>Verify Code</Text>
              )}
            </TouchableOpacity>

            {/* Back to Forgot Password */}
            <Text style={styles.footerText}>
              Didn’t get a code?{" "}
              <Text
                style={styles.link}
                onPress={() => router.push("/(auth)/mechanic-forgot-password")}
              >
                Resend
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#075538",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#444",
    marginBottom: 25,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 18,
  },
  label: {
    color: "#075538",
    fontWeight: "600",
    marginBottom: 6,
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
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#075538",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
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

export default MechanicVerifyCode;
