import { useMechanic } from "@/context/MechanicContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { io } from "socket.io-client";

export default function ConversationsScreen() {
  const router = useRouter();
  const { mechanic } = useMechanic();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [comingMessage, setComingMessage] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  const socket = useRef();

  const userId = mechanic?._id;
  const token = mechanic?.token;

  // 🧩 Initialize socket
  useEffect(() => {
    socket.current = io("https://roadmateassist.onrender.com"); // change if your socket URL differs
    socket.current.on("getMessage", (data) => {
      setComingMessage({
        senderId: data.senderId,
        messageText: data.text,
        createdAt: Date.now(),
      });
    });

    return () => socket.current.disconnect();
  }, []);

  //  Add user to socket list
  useEffect(() => {
    if (userId) {
      socket.current.emit("addUser", userId);
    }
  }, [userId]);

  // 📨 Append new messages in real-time
  useEffect(() => {
    if (
      comingMessage &&
      selectedConversation?.members?.includes(comingMessage.senderId)
    ) {
      setMessages((prev) => [...prev, comingMessage]);
    }
  }, [comingMessage, selectedConversation]);

  //  Fetch all user conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `https://roadmateassist.onrender.com/conversation/find/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setConversations(res.data);
      } catch (error) {
        console.error(
          " Error fetching conversations:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    if (userId && token) fetchConversations();
  }, [userId]);

  // Fetch messages for selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation?._id) return;
      try {
        const res = await axios.get(
          `https://roadmateassist.onrender.com/message/${selectedConversation._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data);
      } catch (error) {
        console.error(" Error fetching messages:", error.message);
      }
    };
    fetchMessages();
  }, [selectedConversation]);

  // 🧠 Handle navigation to chat screen
  const openChat = (conversation) => {
    setSelectedConversation(conversation);
    router.push({
      pathname: "/chat",
      params: {
        conversationId: conversation._id,
        members: JSON.stringify(conversation.members),
        token: token,
      },
    });
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() => openChat(item)}
    >
      <View style={styles.conversationHeader}>
        <Ionicons name="person-circle-outline" size={42} color="#075538" />
        <View style={styles.textContainer}>
          <Text style={styles.conversationName}>
            {item.title || "Driver Chat"}
          </Text>
          <Text style={styles.conversationLastMessage}>
            {item.lastMessage || "Tap to open chat"}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#CED46A" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#075538" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)")}>
          <Ionicons name="arrow-back" size={28} color="#CED46A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conversations</Text>
      </View>

      {/* Body */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#075538" />
          <Text style={{ color: "#075538", marginTop: 10 }}>
            Loading conversations...
          </Text>
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={70} color="#CED46A" />
          <Text style={styles.emptyText}>No conversations yet</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#075538",
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 3,
  },
  headerTitle: {
    color: "#CED46A",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  conversationCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#CED46A",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  conversationHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 10,
    maxWidth: "80%",
  },
  conversationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#075538",
  },
  conversationLastMessage: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#075538",
    fontSize: 16,
    marginTop: 10,
  },
});
