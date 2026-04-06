import { useCallback, useEffect, useRef, useState } from "react";
import type { MessageDTO } from "../types/chat.types";
import { createChatStompClient } from "../websocket/createChatStompClient";

/** SockJS utilise une URL HTTP(S) pour le handshake, pas ws:// — doit être http://localhost:8080/ws */
const SOCKJS_HTTP_URL = "http://localhost:8080/ws";

export function useStompChat(
  roomId: number | null,
  token: string | null,
  username: string | null,
) {
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<ReturnType<typeof createChatStompClient> | null>(
    null,
  );

  const replaceMessages = useCallback((msgs: MessageDTO[]) => {
    setMessages(msgs);
  }, []);

  useEffect(() => {
    setMessages([]);
    if (roomId == null || !username) {
      setConnected(false);
      return;
    }

    const client = createChatStompClient(token, SOCKJS_HTTP_URL);
    clientRef.current = client;

    client.onStompError = (frame) => {
      console.error("STOMP connection error:", frame);
    };

    client.onWebSocketError = (event) => {
      console.error("STOMP connection error:", event);
    };

    client.onConnect = () => {
      console.log("STOMP connected successfully!");
      setConnected(true);
      const topicPath = `/topic/room/${roomId}`;
      client.subscribe(topicPath, (message) => {
        try {
          const parsed = JSON.parse(message.body) as MessageDTO;
          setMessages((prev) => [...prev, parsed]);
        } catch {
          /* ignore */
        }
      });
      console.log("Subscribed to:", "/topic/room/" + roomId);
    };

    client.onDisconnect = () => setConnected(false);

    console.log("Connecting STOMP to roomId:", roomId);
    client.activate();

    return () => {
      void client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [roomId, token, username]);

  const sendChat = useCallback(
    (content: string) => {
      const client = clientRef.current;
      if (!client?.connected || roomId == null || !username || !content.trim()) return;
      const payload = {
        content,
        senderUsername: username,
        roomId,
        type: "CHAT",
      };
      const destination = `/app/chat.send/${roomId}`;
      client.publish({
        destination,
        body: JSON.stringify(payload),
      });
    },
    [roomId, username],
  );

  const sendJoin = useCallback(() => {
    const client = clientRef.current;
    if (!client?.connected || roomId == null || !username) return;
    const payload = {
      content: "",
      senderUsername: username,
      roomId,
      type: "JOIN",
    };
    client.publish({
      destination: `/app/chat.join/${roomId}`,
      body: JSON.stringify(payload),
    });
  }, [roomId, username]);

  const resetMessages = useCallback(() => setMessages([]), []);

  return {
    messages,
    connected,
    sendChat,
    sendJoin,
    resetMessages,
    replaceMessages,
  };
}
