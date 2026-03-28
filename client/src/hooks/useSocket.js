import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.jsx";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export function useSocket() {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user?.id || !token) {
      setSocket(null);
      setConnected(false);
      return;
    }
    const s = io(SOCKET_URL, {
      auth: { userId: user.id },
      transports: ["websocket", "polling"],
    });
    setSocket(s);
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [user?.id, token]);

  return { socket, connected };
}
