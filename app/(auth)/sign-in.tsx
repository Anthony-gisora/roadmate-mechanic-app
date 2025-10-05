import { SignedIn, SignedOut, useSignIn, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useUser();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(auth)/mechanic-login");
    }
  }, [isSignedIn]);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError("");

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(auth)/mechanic-login");
      } else {
        console.log("Additional steps required:", signInAttempt);
      }
    } catch (err: any) {
      console.error("Sign-in error:", JSON.stringify(err, null, 2));
      setError("Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      <SignedOut>
        {/* Logo */}
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email address"
          onChangeText={setEmailAddress}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={password}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
        />

        {/*  Error message */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text>Don’t have an account?</Text>
          <Link href="/sign-up">
            <Text style={styles.link}> Sign up</Text>
          </Link>
        </View>
      </SignedOut>

      <SignedIn>
        <Text style={styles.redirectText}>Redirecting...</Text>
      </SignedIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
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
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#075538",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#075538",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  link: {
    color: "#075538",
    fontWeight: "bold",
  },
  redirectText: {
    textAlign: "center",
    color: "#075538",
    fontSize: 16,
  },
});
