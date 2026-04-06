import type { MessageDTO, RoomDTO } from "../types/chat.types";
import { httpClient } from "./httpClient";

export async function fetchRooms(): Promise<RoomDTO[]> {
  const { data } = await httpClient.get<RoomDTO[]>("/api/rooms");
  return data;
}

export async function createRoom(room: {
  name: string;
  description?: string | null;
}): Promise<RoomDTO> {
  const { data } = await httpClient.post<RoomDTO>("/api/rooms", room);
  return data;
}

export async function fetchMessages(roomId: number): Promise<MessageDTO[]> {
  const { data } = await httpClient.get<MessageDTO[]>(
    `/api/rooms/${roomId}/messages`,
  );
  return data;
}
