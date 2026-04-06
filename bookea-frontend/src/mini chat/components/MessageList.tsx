import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { MessageDTO } from "../types/chat.types";

interface MessageListProps {
  messages: MessageDTO[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <ul className="list-group list-group-flush flex-grow-1 overflow-auto small">
      {messages.map((m) => (
        <li
          key={`${m.id}-${m.sentAt}`}
          className="list-group-item py-2 px-3 border-0 border-bottom"
        >
          <div className="d-flex justify-content-between align-items-baseline gap-2">
            <span className="fw-semibold text-primary">{m.senderUsername}</span>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
              {format(new Date(m.sentAt), "HH:mm:ss", { locale: fr })}
            </span>
          </div>
          <div className="text-body mt-1">{m.content}</div>
          <div className="text-muted" style={{ fontSize: "0.7rem" }}>
            {m.type}
          </div>
        </li>
      ))}
    </ul>
  );
}
