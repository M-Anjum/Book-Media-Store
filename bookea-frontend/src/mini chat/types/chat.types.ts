export type MessageType = "CHAT" | "JOIN" | "LEAVE";

export interface AuthResponse {
  token: string;
  username: string;
  id: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RoomDTO {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface MessageDTO {
  id: number;
  content: string;
  senderUsername: string;
  roomId: number;
  sentAt: string;
  type: string;
}
