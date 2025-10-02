import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MechanicRequest = () => {
  const { user } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState(`${user?.firstName || "user"}@gmail.com`);
  const [expertise, setExpertise] = useState("");
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Kenya");
  const [county, setCounty] = useState("");
  const [subCounty, setSubCounty] = useState("");

  const handleSubmit = () => {
    if (
      !email ||
      !expertise ||
      !experience ||
      !phone ||
      !country ||
      !county ||
      !subCounty
    ) {
      Alert.alert(
        " Missing Fields",
        "Please fill in all required fields before submitting."
      );
      return;
    }

    Alert.alert(" Success", "Request submitted successfully!");

    setEmail(`${user?.firstName || "user"}@gmail.com`);
    setExpertise("");
    setExperience("");
    setPhone("");
    setCountry("Kenya");
    setCounty("");
    setSubCounty("");

    router.replace("/(auth)/mechanic-login");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#CED46A" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            borderWidth: 2,
            borderColor: "#075538",
          }}
        >
          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={{ width: 90, height: 90, borderRadius: 45 }}
              resizeMode="contain"
            />
          </View>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#075538",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Mechanic Registration Request
          </Text>

          {/* First + Last Name */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#075538", fontWeight: "600" }}>
                First Name
              </Text>
              <TextInput
                value={user?.firstName || ""}
                editable={false}
                style={{
                  backgroundColor: "#CED46A",
                  borderWidth: 1,
                  borderColor: "#075538",
                  borderRadius: 8,
                  padding: 10,
                  color: "#075538",
                  marginTop: 4,
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#075538", fontWeight: "600" }}>
                Last Name
              </Text>
              <TextInput
                value={user?.lastName || ""}
                editable={false}
                style={{
                  backgroundColor: "#CED46A",
                  borderWidth: 1,
                  borderColor: "#075538",
                  borderRadius: 8,
                  padding: 10,
                  color: "#075538",
                  marginTop: 4,
                }}
              />
            </View>
          </View>

          {/* Email */}
          <Text style={{ color: "#075538", fontWeight: "600" }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={{
              backgroundColor: "#CED46A",
              borderWidth: 1,
              borderColor: "#075538",
              borderRadius: 8,
              padding: 10,
              color: "#075538",
              marginTop: 4,
              marginBottom: 12,
            }}
          />

          {/* Expertise */}
          <Text style={{ color: "#075538", fontWeight: "600" }}>
            What is your area of expertise? *
          </Text>
          <TextInput
            value={expertise}
            onChangeText={setExpertise}
            multiline
            numberOfLines={3}
            placeholder="e.g. Engine Repair, Diagnostics..."
            style={{
              backgroundColor: "#CED46A",
              borderWidth: 1,
              borderColor: "#075538",
              borderRadius: 8,
              padding: 10,
              color: "#075538",
              marginTop: 4,
              marginBottom: 12,
            }}
          />

          {/* Experience */}
          <Text style={{ color: "#075538", fontWeight: "600" }}>
            What is your level of experience? *
          </Text>
          <TextInput
            value={experience}
            onChangeText={setExperience}
            placeholder="Basic / Intermediate / Professional"
            style={{
              backgroundColor: "#CED46A",
              borderWidth: 1,
              borderColor: "#075538",
              borderRadius: 8,
              padding: 10,
              color: "#075538",
              marginTop: 4,
              marginBottom: 12,
            }}
          />

          {/* Phone */}
          <Text style={{ color: "#075538", fontWeight: "600" }}>
            Primary Phone Number *
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="07XX XXX XXX"
            style={{
              backgroundColor: "#CED46A",
              borderWidth: 1,
              borderColor: "#075538",
              borderRadius: 8,
              padding: 10,
              color: "#075538",
              marginTop: 4,
              marginBottom: 12,
            }}
          />

          {/* Country */}
          <Text style={{ color: "#075538", fontWeight: "600" }}>
            Country of Operation *
          </Text>
          <TextInput
            value={country}
            onChangeText={setCountry}
            style={{
              backgroundColor: "#CED46A",
              borderWidth: 1,
              borderColor: "#075538",
              borderRadius: 8,
              padding: 10,
              color: "#075538",
              marginTop: 4,
              marginBottom: 12,
            }}
          />

          {/* County */}
          <Text style={{ color: "#075538", fontWeight: "600" }}>
            County of Operation *
          </Text>
          <TextInput
            value={county}
            onChangeText={setCounty}
            placeholder="Select County"
            style={{
              backgroundColor: "#CED46A",
              borderWidth: 1,
              borderColor: "#075538",
              borderRadius: 8,
              padding: 10,
              color: "#075538",
              marginTop: 4,
              marginBottom: 12,
            }}
          />

          {/* Sub-county */}
          <Text style={{ color: "#075538", fontWeight: "600" }}>
            Sub-county *
          </Text>
          <TextInput
            value={subCounty}
            onChangeText={setSubCounty}
            placeholder="Enter your sub-county"
            style={{
              backgroundColor: "#CED46A",
              borderWidth: 1,
              borderColor: "#075538",
              borderRadius: 8,
              padding: 10,
              color: "#075538",
              marginTop: 4,
              marginBottom: 16,
            }}
          />

          {/* Submit button */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: "#075538",
              padding: 14,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Submit Request
            </Text>
          </TouchableOpacity>

          {/* Have account? Login */}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#333" }}>Have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/mechanic-login")}
            >
              <Text
                style={{ color: "#075538", fontWeight: "bold", marginLeft: 4 }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MechanicRequest;
