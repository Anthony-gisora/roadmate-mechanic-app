// SignUpScreen.tsx
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // form fields (include all fields Clerk may require)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  // verification state
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper to surface Clerk missing fields
  const showWhichFields = (s: any) => {
    if (!s) return null;
    const missing = s.missingFields || s.requiredFields || [];
    if (missing.length === 0) return null;
    return `Missing: ${missing.join(", ")}`;
  };

  // Primary sign-up handler
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      const start = await signUp.create({
        emailAddress,
        password,
      });

      if (start.status === "missing_requirements") {
        await signUp.update({
          firstName,
          lastName,
          username,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        setPendingVerification(true);
        setLoading(false);
        return;
      }

      if (start.status === "complete") {
        if (start.createdSessionId) {
          await setActive({ session: start.createdSessionId });
          router.replace("/");
          return;
        }
      }

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error("Sign-up error:", err);
      if (err?.errors?.[0]?.code === "identifier_already_exists") {
        setError("An account with that email already exists.");
      } else {
        setError("Sign up failed. Please check your inputs and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        if (result.createdSessionId) {
          await setActive({ session: result.createdSessionId });
          router.replace("/(tabs)");
          return;
        } else {
          Alert.alert("Success", "Email verified — please sign in.");
          router.replace("/sign-in");
        }
      } else {
        setError(
          "Verification incomplete. Please check the code and try again."
        );
        console.log("Additional steps required:", showWhichFields(result));
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render verification UI
  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.info}>We sent a code to {emailAddress}</Text>

        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter verification code"
          keyboardType="numeric"
          onChangeText={setCode}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={onVerifyPress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // Default: full sign-up form
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        value={firstName}
        placeholder="First name"
        onChangeText={setFirstName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        placeholder="Last name"
        onChangeText={setLastName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        value={username}
        placeholder="Username"
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={emailAddress}
        placeholder="Email address"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={onSignUpPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/sign-in")}>
          <Text style={styles.link}> Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 18,
    color: "#075538",
    textAlign: "center",
  },
  info: { marginBottom: 12, textAlign: "center", color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#CED46A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#075538",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 18 },
  footerText: { color: "#333" },
  link: { color: "#075538", fontWeight: "700" },
  error: { color: "red", textAlign: "center", marginBottom: 8 },
});
