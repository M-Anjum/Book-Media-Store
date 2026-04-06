import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { createRoom, fetchMessages, fetchRooms } from "./api/roomsApi";
import { username } from "./hooks/useAuth";
import { useStompChat } from "./hooks/useStompChat";
import type { MessageDTO, RoomDTO } from "./types/chat.types";

const C = {
  primary: "#E8622A",
  bg: "#1a1a1a",
  chatBg: "#f5f5f5",
  white: "#ffffff",
  textDark: "#1a1a1a",
  grey: "#888888",
  greyMuted: "#999999",
  cardBorder: "#333333",
  errorBg: "#3d2020",
  errorText: "#ffaaaa",
} as const;

const pageScroll: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  WebkitOverflowScrolling: "touch",
};

function ChatShell() {
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        maxHeight: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: C.bg,
        boxSizing: "border-box",
      }}
    >
      <Outlet />
    </div>
  );
}

function MessengerHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <header
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "14px 16px",
        background: C.bg,
        color: C.white,
        borderBottom: `1px solid ${C.cardBorder}`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em" }}>
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              fontSize: "12px",
              color: C.greyMuted,
              marginTop: "2px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
      {children}
    </header>
  );
}

function RoomSwitcher({
  rooms,
  roomId,
  onChange,
}: {
  rooms: RoomDTO[];
  roomId: number;
  onChange: (id: number) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        color: C.white,
        cursor: "pointer",
      }}
    >
      <span style={{ whiteSpace: "nowrap" }}>Salons</span>
      <select
        value={roomId}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          maxWidth: "min(200px, 45vw)",
          padding: "8px 28px 8px 10px",
          fontSize: "13px",
          color: C.textDark,
          background: C.white,
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          appearance: "none",
          backgroundImage: `linear-gradient(45deg, transparent 50%, ${C.primary} 50%), linear-gradient(135deg, ${C.primary} 50%, transparent 50%)`,
          backgroundPosition: "calc(100% - 14px) calc(1em + 1px), calc(100% - 9px) calc(1em + 1px)",
          backgroundSize: "5px 5px, 5px 5px",
          backgroundRepeat: "no-repeat",
        }}
      >
        {rooms.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function MessageBubbleRow({ m }: { m: MessageDTO }) {
  const t = (m.type || "CHAT").toUpperCase();
  const isSystem = t === "JOIN" || t === "LEAVE";
  const isMine = !isSystem && m.senderUsername === username;

  const timeStr = format(new Date(m.sentAt), "HH:mm", { locale: fr });

  if (isSystem) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "14px",
          padding: "0 8px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontStyle: "italic",
            color: C.grey,
            textAlign: "center",
            maxWidth: "90%",
          }}
        >
          {m.content}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: isMine ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        gap: "8px",
        marginBottom: "14px",
        padding: "0 4px",
      }}
    >
      {!isMine ? (
        <span
          style={{ fontSize: "18px", lineHeight: 1, flexShrink: 0, opacity: 0.85 }}
          aria-hidden
        >
          👤
        </span>
      ) : null}
      <div
        style={{
          maxWidth: "70%",
          display: "flex",
          flexDirection: "column",
          alignItems: isMine ? "flex-end" : "flex-start",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            color: C.grey,
            marginBottom: "4px",
            paddingLeft: isMine ? 0 : "4px",
            paddingRight: isMine ? "4px" : 0,
          }}
        >
          {m.senderUsername}
        </span>
        <div
          style={{
            borderRadius: "18px",
            padding: "10px 14px",
            background: isMine ? C.primary : C.white,
            color: isMine ? C.white : C.textDark,
            boxShadow: isMine
              ? "0 1px 2px rgba(0,0,0,0.12)"
              : "0 1px 2px rgba(0,0,0,0.08)",
            wordBreak: "break-word",
          }}
        >
          {m.content}
        </div>
        <span
          style={{
            fontSize: "10px",
            color: C.grey,
            marginTop: "4px",
            paddingLeft: isMine ? 0 : "6px",
            paddingRight: isMine ? "6px" : 0,
          }}
        >
          {timeStr}
        </span>
      </div>
      {isMine ? (
        <span
          style={{ fontSize: "18px", lineHeight: 1, flexShrink: 0, opacity: 0.85 }}
          aria-hidden
        >
          👤
        </span>
      ) : null}
    </div>
  );
}

function MessengerMessages({ messages }: { messages: MessageDTO[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        ...pageScroll,
        minHeight: 0,
        background: C.chatBg,
        padding: "16px 12px 20px",
      }}
    >
      {messages.map((m) => (
        <MessageBubbleRow key={`${m.id}-${m.sentAt}`} m={m} />
      ))}
      <div ref={endRef} style={{ height: 1 }} />
    </div>
  );
}

function RoomChatPanel({
  roomId,
  rooms,
  onSelectRoom,
}: {
  roomId: number;
  rooms: RoomDTO[];
  onSelectRoom: (id: number) => void;
}) {
  const {
    messages,
    connected,
    sendChat,
    replaceMessages,
  } = useStompChat(roomId, null, username);
  const [draft, setDraft] = useState("");

  const currentRoom = rooms.find((r) => r.id === roomId);
  const label = currentRoom?.name ?? `Salon #${roomId}`;

  useEffect(() => {
    void (async () => {
      const history = await fetchMessages(roomId);
      replaceMessages(history);
    })();
  }, [roomId, replaceMessages]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    sendChat(draft);
    setDraft("");
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
        background: C.bg,
      }}
    >
      <MessengerHeader
        title="🔶 Bookie Chat"
        subtitle={connected ? label : "Connexion…"}
      >
        {rooms.length > 0 ? (
          <RoomSwitcher
            rooms={rooms}
            roomId={roomId}
            onChange={onSelectRoom}
          />
        ) : null}
      </MessengerHeader>

      <MessengerMessages messages={messages} />

      <form
        onSubmit={handleSend}
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 14px",
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
          background: C.bg,
          borderTop: `1px solid ${C.cardBorder}`,
          boxSizing: "border-box",
        }}
      >
        <input
          type="text"
          placeholder="Écrire un message…"
          value={draft}
          maxLength={500}
          onChange={(e) => setDraft(e.target.value)}
          disabled={!connected}
          style={{
            flex: 1,
            minWidth: 0,
            padding: "12px 16px",
            fontSize: "15px",
            color: C.textDark,
            background: C.white,
            border: "none",
            borderRadius: "24px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          disabled={!connected || !draft.trim()}
          aria-label="Envoyer"
          style={{
            flexShrink: 0,
            width: "48px",
            height: "48px",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            lineHeight: 1,
            color: C.white,
            background: C.primary,
            border: "none",
            borderRadius: "50%",
            cursor: connected && draft.trim() ? "pointer" : "not-allowed",
            opacity: connected && draft.trim() ? 1 : 0.45,
            boxShadow: "0 2px 8px rgba(232, 98, 42, 0.45)",
          }}
        >
          ➤
        </button>
      </form>
    </div>
  );
}

function RoomRoute({
  rooms,
  onSelectRoom,
}: {
  rooms: RoomDTO[];
  onSelectRoom: (id: number) => void;
}) {
  const navigate = useNavigate();
  const { roomId: roomIdParam } = useParams<{ roomId: string }>();
  const parsed = roomIdParam ? Number.parseInt(roomIdParam, 10) : NaN;
  const roomId = Number.isFinite(parsed) ? parsed : NaN;

  if (Number.isNaN(roomId)) {
    return <Navigate to="/chat/rooms" replace />;
  }

  const goRoom = (id: number) => {
    onSelectRoom(id);
    navigate(`/chat/room/${id}`);
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <RoomChatPanel roomId={roomId} rooms={rooms} onSelectRoom={goRoom} />
    </div>
  );
}

function RoomsRoute({
  onSelectRoom,
  newRoomName,
  setNewRoomName,
  newRoomDesc,
  setNewRoomDesc,
  onCreateRoom,
  error,
}: {
  onSelectRoom: (id: number) => void;
  newRoomName: string;
  setNewRoomName: (v: string) => void;
  newRoomDesc: string;
  setNewRoomDesc: (v: string) => void;
  onCreateRoom: (e: FormEvent) => void;
  error: string | null;
}) {
  const [rooms, setRooms] = useState<RoomDTO[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchRooms();
        setRooms(Array.isArray(data) ? data : []);
      } catch {
        setRooms([]);
      }
    })();
  }, []);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <MessengerHeader title="🔶 Bookie Chat" subtitle="Choisis un salon" />

      <div style={{ ...pageScroll, padding: "16px" }}>
        {error ? (
          <div
            style={{
              padding: "12px 14px",
              marginBottom: "16px",
              borderRadius: "12px",
              background: C.errorBg,
              color: C.errorText,
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        ) : null}

        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: C.greyMuted,
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Salons disponibles
        </div>

        {rooms.length === 0 ? (
          <div
            style={{
              padding: "24px 16px",
              textAlign: "center",
              color: C.grey,
              fontSize: "15px",
            }}
          >
            Aucun salon disponible
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {rooms.map((r) => (
              <div
                key={r.id}
                style={{
                  borderRadius: "14px",
                  padding: "16px",
                  background: "#252525",
                  borderLeft: `4px solid ${C.primary}`,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
                }}
              >
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: C.white,
                    marginBottom: "6px",
                  }}
                >
                  {r.name}
                </div>
                {r.description ? (
                  <div
                    style={{
                      fontSize: "13px",
                      color: C.greyMuted,
                      marginBottom: "12px",
                      lineHeight: 1.45,
                    }}
                  >
                    {r.description}
                  </div>
                ) : (
                  <div style={{ marginBottom: "12px" }} />
                )}
                <button
                  type="button"
                  onClick={() => onSelectRoom(r.id)}
                  style={{
                    width: "100%",
                    padding: "11px 16px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: C.white,
                    background: C.primary,
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(232, 98, 42, 0.35)",
                  }}
                >
                  Rejoindre
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: `1px solid ${C.cardBorder}`,
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: C.greyMuted,
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Nouveau salon
          </div>
          <form
            onSubmit={onCreateRoom}
            style={{
              borderRadius: "14px",
              padding: "18px",
              background: "#252525",
              border: `1px solid ${C.cardBorder}`,
            }}
          >
            <input
              placeholder="Nom du salon"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                marginBottom: "10px",
                padding: "12px 14px",
                fontSize: "15px",
                borderRadius: "10px",
                border: `1px solid ${C.cardBorder}`,
                background: C.bg,
                color: C.white,
                outline: "none",
              }}
            />
            <input
              placeholder="Description (optionnel)"
              value={newRoomDesc}
              onChange={(e) => setNewRoomDesc(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                marginBottom: "14px",
                padding: "12px 14px",
                fontSize: "15px",
                borderRadius: "10px",
                border: `1px solid ${C.cardBorder}`,
                background: C.bg,
                color: C.white,
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "15px",
                fontWeight: 600,
                color: C.white,
                background: C.primary,
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Créer le salon
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function MiniChat() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadRooms = useCallback(async () => {
    try {
      const data = await fetchRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch {
      setRooms([]);
    }
  }, []);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  const handleCreateRoom = async (e: FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    setError(null);
    try {
      const room = await createRoom({
        name: newRoomName.trim(),
        description: newRoomDesc.trim() || null,
      });
      setNewRoomName("");
      setNewRoomDesc("");
      await loadRooms();
      navigate(`/chat/room/${room.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Création room impossible");
    }
  };

  const goToRoom = (id: number) => {
    navigate(`/chat/room/${id}`);
  };

  const sharedChatProps = {
    rooms,
    onSelectRoom: goToRoom,
    newRoomName,
    setNewRoomName,
    newRoomDesc,
    setNewRoomDesc,
    onCreateRoom: handleCreateRoom,
    error,
  };

  return (
    <Routes basename="/chat">
      <Route element={<ChatShell />}>
        <Route index element={<Navigate to="rooms" replace />} />
        <Route
          path="rooms"
          element={
            <RoomsRoute
              onSelectRoom={sharedChatProps.onSelectRoom}
              newRoomName={sharedChatProps.newRoomName}
              setNewRoomName={sharedChatProps.setNewRoomName}
              newRoomDesc={sharedChatProps.newRoomDesc}
              setNewRoomDesc={sharedChatProps.setNewRoomDesc}
              onCreateRoom={sharedChatProps.onCreateRoom}
              error={sharedChatProps.error}
            />
          }
        />
        <Route
          path="room/:roomId"
          element={
            <RoomRoute
              rooms={sharedChatProps.rooms}
              onSelectRoom={sharedChatProps.onSelectRoom}
            />
          }
        />
        <Route path="*" element={<Navigate to="/chat/rooms" replace />} />
      </Route>
    </Routes>
  );
}

export default MiniChat;
