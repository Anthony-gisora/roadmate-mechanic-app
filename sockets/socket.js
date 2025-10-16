import { io } from "socket.io-client";

const urls = {
  dev: "http://localhost:5000",
  prod: "https://roadmateassist.onrender.com",
};

export const initSocket = async (mechanic) => {
  const socket = io(urls.prod);
  socket.on("connect", () => {
    socket.emit("registerMechanic", mechanic.personalNumber);
    console.log(mechanic.personalNumber);
    console.log(`connection established `, socket.id);
  });
};

export const discon = async (mechanic) => {
  const socket = io(urls.prod);
  socket.disconnect();
};

export const conn = async (mechanic) => {
  const socket = io(urls.prod);
  socket.emit("registerMechanic", mechanic.personalNumber);
  socket.connect();
};

export const isOnlineEv = async (mechanic) => {
  const socket = io(urls.prod);
  socket.emit("online", { mechanic });
};

export const isOfflineEv = async (mechanic) => {
  const socket = io(urls.prod);
  socket.emit("offline", { mechanic });
};
