import { useCallback, useEffect, useRef, useState } from "react";
import type { MessageDTO } from "../types/chat.types";
import { createChatStompClient } from "../websocket/createChatStompClient";

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
    if (roomId == null || !token || !username) {
      setConnected(false);
      return;
    }

    const client = createChatStompClient(token);
    clientRef.current = client;

    client.onConnect = () => {
      setConnected(true);
      client.subscribe(`/topic/room/${roomId}`, (message) => {
        try {
          const parsed = JSON.parse(message.body) as MessageDTO;
          setMessages((prev) => [...prev, parsed]);
        } catch {
          /* ignore */
        }
      });
    };

    client.onDisconnect = () => setConnected(false);

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
      client.publish({
        destination: `/app/chat.send/${roomId}`,
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
