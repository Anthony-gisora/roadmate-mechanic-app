import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const apiUrl = {
  dev: "http://localhost:5000/api/auth/reset-password",
  prod: "https://roadmateassist.onrender.com/api/auth/reset-password",
};

const URL_API = apiUrl.prod;

export default function MechanicProfileScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [image, setImage] = useState(user?.imageUrl || null);
  // const [tag, setTag] = useState(user?.publicMetadata?.tag || "");
  const [password, setPassword] = useState("");

  // const { mechanic } = useMechanic();

  // Redirect if mechanic not found
  // useEffect(() => {
  //   setTimeout(() => {
  //     router.replace("/(auth)/mechanic-login" as never);
  //   }, 1000);
  // }, [mechanic]);

  const navigation = useNavigation();
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleChangePass = async () => {
    Alert.alert(
      "Password Reset Alert",
      "You have successfully changed your password...! But NOT YET UPDATED"
    );
    // try {
    //   const res = await axios.post(URL_API, {
    //     personalNumber: mechanic.personalNumber,
    //     newPassword: password,
    //   });
    //   setPassword("");
    //   console.log(res)
    //   Alert.alert(
    //     "Password Reset Alert",
    //     "You have successfully changed your password...!"
    //   );
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Banner */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={26} color="#CED46A" />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: image || "https://via.placeholder.com/120" }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.name}>{user?.fullName || "Arnoldy Chafe"}</Text>
        <Text style={styles.username}>@{user?.username || "Mechanic"}</Text>
        <Text style={styles.location}>
          Kenya • Joined{" "}
          {user?.createdAt ? new Date(user.createdAt).toDateString() : "Recent"}
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryText}>Rate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ChatScreen" as never)}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Discover</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Website</Text>
          <Text style={styles.infoValue}>www.roadmate.co.ke</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>
            {user?.emailAddresses?.[0]?.emailAddress || "mechanic@roadmate.com"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>+254 712 345 678</Text>
        </View>

        {/* <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tag</Text>
          <TextInput
            placeholder="e.g., Bodywork Specialist"
            value={tag}
            onChangeText={setTag}
            style={styles.input}
          />
        </View> */}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Password</Text>
          <TextInput
            placeholder="Enter new password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          onPress={() => handleChangePass()}
          style={styles.updateBtn}
        >
          <Text style={styles.updateTxt}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#075538",
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#075538",
    padding: 8,
    borderRadius: 10,
  },

  profileCard: {
    backgroundColor: "#fff",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: -60,
    borderRadius: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#CED46A",
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#075538",
    marginTop: 10,
  },
  username: { fontSize: 14, color: "#075538", opacity: 0.8 },
  location: { color: "#075538", fontSize: 12, marginTop: 4, opacity: 0.7 },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: "#075538",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  primaryText: { color: "#CED46A", fontWeight: "600" },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#075538",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  secondaryText: { color: "#075538", fontWeight: "600" },

  infoSection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#075538",
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  infoLabel: { color: "#075538", fontWeight: "600" },
  infoValue: { color: "#075538", fontWeight: "500", opacity: 0.8 },

  input: {
    borderWidth: 1,
    borderColor: "#CED46A",
    borderRadius: 8,
    padding: 8,
    width: "60%",
    color: "#075538",
  },
  updateBtn: {
    width: "full",
    height: 35,
    margin: 8,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#075538",
  },

  updateTxt: {
    fontSize: 20,
    color: "#CED46A",
  },
});
