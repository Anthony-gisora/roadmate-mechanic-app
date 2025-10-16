import { useMechanic } from "@/context/MechanicContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import io from "socket.io-client";

export default function ChatScreen() {
  const router = useRouter();
  const { conversationId, members, token } = useLocalSearchParams();
  const memberArray = JSON.parse(members || "[]");

  const { mechanic } = useMechanic();
  const socket = useRef(null);

  const userId = mechanic._id;
  // const token = mechanic.token;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);

  // SOCKET SETUP
  useEffect(() => {
    socket.current = io("https://roadmateassist.onrender.com");
    socket.current.emit("addUser", userId);

    socket.current.on("getMessage", (data) => {
      if (data && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            senderId: data.senderId,
            messageText: data.text,
            createdAt: Date.now(),
          },
        ]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [userId]);

  // FETCH MESSAGES
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://roadmateassist.onrender.com/message/${conversationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (error) {
        console.error(
          "Error fetching messages:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    if (conversationId) fetchMessages();
  }, [conversationId]);

  // GET OTHER USER
  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const otherUserId = memberArray.find((id) => id !== userId);
        if (otherUserId) {
          const userRes = await axios.get(
            `https://roadmateassist.onrender.com/message/userProf/${otherUserId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setOtherUser(userRes.data);
        }
      } catch (error) {
        console.error(
          "Error fetching other user:",
          error.response?.data || error.message
        );
      }
    };
    fetchOtherUser();
  }, []);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (input.trim() === "") return;
    try {
      const res = await axios.post(
        `https://roadmateassist.onrender.com/message`,
        { conversationId, messageText: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessages((prev) => [...prev, res.data]);

      const otherUserId = memberArray.find((id) => id !== userId);
      socket.current.emit("sendMessage", {
        senderId: userId,
        otherUserId,
        text: input,
      });

      setInput("");
    } catch (error) {
      console.error(
        " Error sending message:",
        error.response?.data || error.message
      );
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.senderId === userId ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.senderId === userId
            ? styles.myMessageText
            : styles.theirMessageText,
        ]}
      >
        {item.messageText}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#075538" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#CED46A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {otherUser ? otherUser.username : "Chat"}
          </Text>
        </View>

        {/* Messages */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#075538" />
            <Text style={{ color: "#075538", marginTop: 10 }}>
              Loading messages...
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id || item.createdAt?.toString()}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9F9F9" },
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 1,
    backgroundColor: "#075538",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#CED46A",
    marginLeft: 12,
  },
  messagesContainer: { padding: 10, flexGrow: 1, justifyContent: "flex-end" },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 16,
    padding: 10,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#075538",
    borderTopRightRadius: 0,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#CED46A",
    borderTopLeftRadius: 0,
  },
  messageText: { fontSize: 16 },
  myMessageText: { color: "#fff" },
  theirMessageText: { color: "#075538" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderTopColor: "#E0E0E0",
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#075538",
    padding: 12,
    borderRadius: 25,
    marginLeft: 8,
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
