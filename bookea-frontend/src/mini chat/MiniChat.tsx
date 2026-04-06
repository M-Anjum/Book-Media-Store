import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import { createRoom, fetchMessages, fetchRooms } from "./api/roomsApi";
import { useAuth } from "./hooks/useAuth";
import { useStompChat } from "./hooks/useStompChat";
import type { MessageDTO, RoomDTO } from "./types/chat.types";

const shell: CSSProperties = {
  backgroundColor: "#ffffff",
  color: "#000000",
  minHeight: "100vh",
  boxSizing: "border-box",
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 10px",
  fontSize: "14px",
  color: "#000000",
  backgroundColor: "#ffffff",
  border: "1px solid #cccccc",
  borderRadius: "4px",
};

const btnPrimary: CSSProperties = {
  padding: "8px 14px",
  fontSize: "14px",
  color: "#ffffff",
  backgroundColor: "#333333",
  border: "1px solid #333333",
  borderRadius: "4px",
  cursor: "pointer",
};

const btnSecondary: CSSProperties = {
  padding: "8px 14px",
  fontSize: "14px",
  color: "#000000",
  backgroundColor: "#f0f0f0",
  border: "1px solid #cccccc",
  borderRadius: "4px",
  cursor: "pointer",
};

const btnLink: CSSProperties = {
  padding: 0,
  fontSize: "14px",
  color: "#0000cc",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  textDecoration: "underline",
};

/** Enveloppe /chat : assure le fond blanc et le rendu des routes enfants via Outlet. */
function ChatShell() {
  return (
    <div style={shell}>
      <Outlet />
    </div>
  );
}

function MessagesInline({ messages }: { messages: MessageDTO[] }) {
  return (
    <ul
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        flex: 1,
        overflow: "auto",
        fontSize: "14px",
      }}
    >
      {messages.map((m) => (
        <li
          key={`${m.id}-${m.sentAt}`}
          style={{
            padding: "10px 12px",
            borderBottom: "1px solid #e0e0e0",
            color: "#000000",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: "8px",
            }}
          >
            <span style={{ fontWeight: 600, color: "#000000" }}>
              {m.senderUsername}
            </span>
            <span style={{ fontSize: "12px", color: "#444444" }}>
              {format(new Date(m.sentAt), "HH:mm:ss", { locale: fr })}
            </span>
          </div>
          <div style={{ marginTop: "6px", color: "#000000" }}>{m.content}</div>
          <div style={{ fontSize: "11px", color: "#666666", marginTop: "4px" }}>
            {m.type}
          </div>
        </li>
      ))}
    </ul>
  );
}

function RoomChatPanel({
  roomId,
  token,
  username,
}: {
  roomId: number;
  token: string;
  username: string;
}) {
  const {
    messages,
    connected,
    sendChat,
    sendJoin,
    replaceMessages,
  } = useStompChat(roomId, token, username);
  const [draft, setDraft] = useState("");

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
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 12px",
          borderBottom: "1px solid #dddddd",
          backgroundColor: "#f9f9f9",
          color: "#000000",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 600 }}>
          Salon #{roomId}
        </span>
        <span
          style={{
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "4px",
            color: "#ffffff",
            backgroundColor: connected ? "#228822" : "#888888",
          }}
        >
          {connected ? "WS connecté" : "WS…"}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: 320,
          backgroundColor: "#ffffff",
          color: "#000000",
        }}
      >
        <MessagesInline messages={messages} />
        <div
          style={{
            borderTop: "1px solid #dddddd",
            padding: "10px",
            backgroundColor: "#ffffff",
          }}
        >
          <button
            type="button"
            style={{ ...btnSecondary, marginBottom: "8px", fontSize: "13px" }}
            onClick={() => sendJoin()}
          >
            Envoyer « JOIN » (présence)
          </button>
          <form
            style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}
            onSubmit={handleSend}
          >
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Message…"
              value={draft}
              maxLength={500}
              onChange={(e) => setDraft(e.target.value)}
            />
            <span
              style={{
                fontSize: "12px",
                color: "#444444",
                whiteSpace: "nowrap",
              }}
            >
              {draft.length}/500
            </span>
            <button
              type="submit"
              style={{
                ...btnPrimary,
                opacity: connected ? 1 : 0.5,
                cursor: connected ? "pointer" : "not-allowed",
              }}
              disabled={!connected}
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function RoomRoute({
  token,
  username,
  rooms,
  selectedRoomId,
  onSelectRoom,
  newRoomName,
  setNewRoomName,
  newRoomDesc,
  setNewRoomDesc,
  onCreateRoom,
  error,
  onLogout,
  logoutLabel,
}: {
  token: string;
  username: string;
  rooms: RoomDTO[];
  selectedRoomId: number | null;
  onSelectRoom: (id: number) => void;
  newRoomName: string;
  setNewRoomName: (v: string) => void;
  newRoomDesc: string;
  setNewRoomDesc: (v: string) => void;
  onCreateRoom: (e: FormEvent) => void;
  error: string | null;
  onLogout: () => void;
  logoutLabel: string;
}) {
  const { roomId: roomIdParam } = useParams<{ roomId: string }>();
  const parsed = roomIdParam ? Number.parseInt(roomIdParam, 10) : NaN;
  const roomId = Number.isFinite(parsed) ? parsed : NaN;

  if (Number.isNaN(roomId)) {
    return <Navigate to="/chat/rooms" replace />;
  }

  return (
    <div style={{ ...shell, padding: "16px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>
          Mini-chat
        </h2>
        <button type="button" style={btnSecondary} onClick={onLogout}>
          Déconnexion ({logoutLabel})
        </button>
      </div>
      {error && (
        <div
          style={{
            padding: "10px 12px",
            marginBottom: "12px",
            backgroundColor: "#ffeeee",
            color: "#880000",
            border: "1px solid #cc6666",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            flex: "1 1 260px",
            minWidth: "220px",
            border: "1px solid #dddddd",
            borderRadius: "6px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              fontSize: "14px",
              fontWeight: 600,
              borderBottom: "1px solid #dddddd",
              backgroundColor: "#f5f5f5",
              color: "#000000",
            }}
          >
            Salons
          </div>
          <div>
            {rooms.map((r) => (
              <button
                key={r.id}
                type="button"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  fontSize: "14px",
                  color: "#000000",
                  backgroundColor:
                    selectedRoomId === r.id ? "#e8e8e8" : "#ffffff",
                  border: "none",
                  borderBottom: "1px solid #eeeeee",
                  cursor: "pointer",
                }}
                onClick={() => onSelectRoom(r.id)}
              >
                {r.name}
              </button>
            ))}
          </div>
          <form
            style={{
              padding: "10px",
              borderTop: "1px solid #dddddd",
              backgroundColor: "#fafafa",
            }}
            onSubmit={onCreateRoom}
          >
            <input
              style={{ ...inputStyle, marginBottom: "8px" }}
              placeholder="Nouveau salon"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <input
              style={{ ...inputStyle, marginBottom: "8px" }}
              placeholder="Description (optionnel)"
              value={newRoomDesc}
              onChange={(e) => setNewRoomDesc(e.target.value)}
            />
            <button type="submit" style={{ ...btnPrimary, width: "100%" }}>
              Créer
            </button>
          </form>
        </div>
        <div
          style={{
            flex: "2 1 320px",
            minWidth: "280px",
            border: "1px solid #dddddd",
            borderRadius: "6px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <RoomChatPanel
            roomId={roomId}
            token={token}
            username={username}
          />
        </div>
      </div>
    </div>
  );
}

function RoomsRoute({
  rooms,
  selectedRoomId,
  onSelectRoom,
  newRoomName,
  setNewRoomName,
  newRoomDesc,
  setNewRoomDesc,
  onCreateRoom,
  error,
  onLogout,
  logoutLabel,
}: {
  rooms: RoomDTO[];
  selectedRoomId: number | null;
  onSelectRoom: (id: number) => void;
  newRoomName: string;
  setNewRoomName: (v: string) => void;
  newRoomDesc: string;
  setNewRoomDesc: (v: string) => void;
  onCreateRoom: (e: FormEvent) => void;
  error: string | null;
  onLogout: () => void;
  logoutLabel: string;
}) {
  return (
    <div style={{ ...shell, padding: "16px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>
          Mini-chat
        </h2>
        <button type="button" style={btnSecondary} onClick={onLogout}>
          Déconnexion ({logoutLabel})
        </button>
      </div>
      {error && (
        <div
          style={{
            padding: "10px 12px",
            marginBottom: "12px",
            backgroundColor: "#ffeeee",
            color: "#880000",
            border: "1px solid #cc6666",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            flex: "1 1 260px",
            minWidth: "220px",
            border: "1px solid #dddddd",
            borderRadius: "6px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              fontSize: "14px",
              fontWeight: 600,
              borderBottom: "1px solid #dddddd",
              backgroundColor: "#f5f5f5",
              color: "#000000",
            }}
          >
            Salons
          </div>
          <div>
            {rooms.map((r) => (
              <button
                key={r.id}
                type="button"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  fontSize: "14px",
                  color: "#000000",
                  backgroundColor:
                    selectedRoomId === r.id ? "#e8e8e8" : "#ffffff",
                  border: "none",
                  borderBottom: "1px solid #eeeeee",
                  cursor: "pointer",
                }}
                onClick={() => onSelectRoom(r.id)}
              >
                {r.name}
              </button>
            ))}
          </div>
          <form
            style={{
              padding: "10px",
              borderTop: "1px solid #dddddd",
              backgroundColor: "#fafafa",
            }}
            onSubmit={onCreateRoom}
          >
            <input
              style={{ ...inputStyle, marginBottom: "8px" }}
              placeholder="Nouveau salon"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <input
              style={{ ...inputStyle, marginBottom: "8px" }}
              placeholder="Description (optionnel)"
              value={newRoomDesc}
              onChange={(e) => setNewRoomDesc(e.target.value)}
            />
            <button type="submit" style={{ ...btnPrimary, width: "100%" }}>
              Créer
            </button>
          </form>
        </div>
        <div
          style={{
            flex: "2 1 320px",
            minWidth: "280px",
            border: "1px solid #dddddd",
            borderRadius: "6px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              fontSize: "14px",
              fontWeight: 600,
              borderBottom: "1px solid #dddddd",
              backgroundColor: "#f5f5f5",
              color: "#000000",
            }}
          >
            Conversation
          </div>
          <div style={{ padding: "16px", color: "#000000", fontSize: "14px" }}>
            <p style={{ margin: 0, color: "#333333", lineHeight: 1.5 }}>
              Sélectionne un salon à gauche ou crée-en un. Les URLs sont{" "}
              <code style={{ backgroundColor: "#f0f0f0", padding: "2px 6px" }}>
                /chat/rooms
              </code>{" "}
              et{" "}
              <code style={{ backgroundColor: "#f0f0f0", padding: "2px 6px" }}>
                /chat/room/:id
              </code>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Panneau mini-chat (auth REST + STOMP/SockJS).
 * Routes : /chat/login, /chat/register, /chat/rooms, /chat/room/:roomId
 */
export function MiniChat() {
  console.log("MiniChat rendered");

  const {
    isAuthenticated,
    token,
    username,
    login,
    register,
    logout,
  } = useAuth();

  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const loadRooms = useCallback(async () => {
    if (!token) return;
    const list = await fetchRooms();
    setRooms(list);
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) void loadRooms();
  }, [isAuthenticated, loadRooms]);

  const handleLogout = () => {
    logout();
    setRooms([]);
    navigate("/chat/login", { replace: true });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(loginForm);
      navigate("/chat/rooms", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible");
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(registerForm);
      navigate("/chat/rooms", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription impossible");
    }
  };

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

  const roomMatch = useMatch("/chat/room/:roomId");
  const selectedFromPath = roomMatch?.params.roomId
    ? Number.parseInt(roomMatch.params.roomId, 10)
    : NaN;
  const selectedRoomId = Number.isFinite(selectedFromPath)
    ? selectedFromPath
    : null;

  const goToRoom = (id: number) => {
    navigate(`/chat/room/${id}`);
  };

  const sharedChatProps =
    token && username
      ? {
          rooms,
          selectedRoomId,
          onSelectRoom: goToRoom,
          newRoomName,
          setNewRoomName,
          newRoomDesc,
          setNewRoomDesc,
          onCreateRoom: handleCreateRoom,
          error,
          onLogout: handleLogout,
          logoutLabel: username,
        }
      : null;

  return (
    <Routes>
      <Route path="/chat" element={<ChatShell />}>
        <Route
          index
          element={
            <Navigate
              to={isAuthenticated ? "/chat/rooms" : "/chat/login"}
              replace
            />
          }
        />
        <Route
          path="login"
          element={
            isAuthenticated ? (
              <Navigate to="/chat/rooms" replace />
            ) : (
              <div
                style={{
                  maxWidth: 480,
                  margin: "0 auto",
                  padding: "24px 20px",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                }}
              >
                <h2 style={{ fontSize: "22px", margin: "0 0 16px", fontWeight: 600 }}>
                  Mini-chat — connexion
                </h2>
                {error && (
                  <div
                    style={{
                      padding: "10px 12px",
                      marginBottom: "12px",
                      backgroundColor: "#ffeeee",
                      color: "#880000",
                      border: "1px solid #cc6666",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    {error}
                  </div>
                )}
                <form
                  onSubmit={handleLogin}
                  style={{ marginBottom: "24px" }}
                >
                  <h3 style={{ fontSize: "16px", margin: "0 0 12px" }}>Login</h3>
                  <div style={{ marginBottom: "10px" }}>
                    <input
                      style={inputStyle}
                      placeholder="username"
                      value={loginForm.username}
                      onChange={(e) =>
                        setLoginForm((f) => ({
                          ...f,
                          username: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <input
                      type="password"
                      style={inputStyle}
                      placeholder="password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((f) => ({
                          ...f,
                          password: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <button type="submit" style={btnPrimary}>
                    Se connecter
                  </button>
                </form>
                <p style={{ fontSize: "14px", color: "#333333", margin: 0 }}>
                  Pas de compte ?{" "}
                  <button
                    type="button"
                    style={btnLink}
                    onClick={() => navigate("/chat/register")}
                  >
                    S&apos;inscrire
                  </button>
                </p>
              </div>
            )
          }
        />
        <Route
          path="register"
          element={
            isAuthenticated ? (
              <Navigate to="/chat/rooms" replace />
            ) : (
              <div
                style={{
                  maxWidth: 480,
                  margin: "0 auto",
                  padding: "24px 20px",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                }}
              >
                <h2 style={{ fontSize: "22px", margin: "0 0 16px", fontWeight: 600 }}>
                  Mini-chat — inscription
                </h2>
                {error && (
                  <div
                    style={{
                      padding: "10px 12px",
                      marginBottom: "12px",
                      backgroundColor: "#ffeeee",
                      color: "#880000",
                      border: "1px solid #cc6666",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    {error}
                  </div>
                )}
                <form onSubmit={handleRegister}>
                  <h3 style={{ fontSize: "16px", margin: "0 0 12px" }}>
                    Inscription
                  </h3>
                  <div style={{ marginBottom: "10px" }}>
                    <input
                      style={inputStyle}
                      placeholder="username"
                      value={registerForm.username}
                      onChange={(e) =>
                        setRegisterForm((f) => ({
                          ...f,
                          username: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <input
                      type="email"
                      style={inputStyle}
                      placeholder="email"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm((f) => ({
                          ...f,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <input
                      type="password"
                      style={inputStyle}
                      placeholder="password (min 6)"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm((f) => ({
                          ...f,
                          password: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <button type="submit" style={{ ...btnPrimary, marginRight: "12px" }}>
                    S&apos;inscrire
                  </button>
                  <button
                    type="button"
                    style={btnLink}
                    onClick={() => navigate("/chat/login")}
                  >
                    Déjà un compte ?
                  </button>
                </form>
              </div>
            )
          }
        />
        <Route
          path="rooms"
          element={
            !isAuthenticated || !sharedChatProps || !token || !username ? (
              <Navigate to="/chat/login" replace />
            ) : (
              <RoomsRoute {...sharedChatProps} />
            )
          }
        />
        <Route
          path="room/:roomId"
          element={
            !isAuthenticated || !sharedChatProps || !token || !username ? (
              <Navigate to="/chat/login" replace />
            ) : (
              <RoomRoute
                {...sharedChatProps}
                token={token}
                username={username}
              />
            )
          }
        />
      </Route>
      <Route path="/" element={<Navigate to="/chat/login" replace />} />
      <Route path="*" element={<Navigate to="/chat/login" replace />} />
    </Routes>
  );
}

export default MiniChat;
