import { io } from "socket.io-client";

const urls = {
  dev: "http://localhost:5000",
  prod: "https://roadmateassist.onrender.com",
};

const socket = io(urls.dev);

export const initSocket = async () => {
  socket.on("connect", () => {
    console.log(`connection established `, socket.id);
  });
};

export const isOnlineEv = async (user) => {
  socket.emit("online", { user });
};

export const isOfflineEv = async (user) => {
  socket.emit("offline", { user });
};
