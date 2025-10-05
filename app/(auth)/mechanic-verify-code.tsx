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

const URL_API =
  "https://roadmateassist.onrender.com/api/auth/verify-reset-code";

const MechanicVerifyCode = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleVerifyCode = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = { data: { message: "reset success" } };
      // const res = await axios.post(URL_API, { code });
      setLoading(false);
      setMessage(res.data.message || "Code verified successfully!");

      setTimeout(() => {
        router.push({
          pathname: "/(auth)/mechanic-reset-password",
        });
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          "Invalid or expired code. Please check and try again."
      );
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
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Verify Reset Code</Text>
            <Text style={styles.subtitle}>
              Enter the verification code sent to your email to continue.
            </Text>

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

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {message ? <Text style={styles.success}>{message}</Text> : null}

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
