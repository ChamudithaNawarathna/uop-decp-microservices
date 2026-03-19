import type { ConversationResponse } from "../../types";
import { formatRelativeTime } from "../../utils/formatDate";

interface ConversationItemProps {
  conversation: ConversationResponse;
  currentUserId: number;
  selected?: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  currentUserId,
  selected,
  onClick,
}: ConversationItemProps) {
  const isGroup = conversation.group || conversation.participants.length > 2;

  // Only consider names that have a matching participant ID (guards against stale data
  // where participantNames.length > participants.length)
  const otherNames = conversation.participantNames.filter(
    (_, i) =>
      i < conversation.participants.length &&
      String(conversation.participants[i]) !== String(currentUserId),
  );

  const displayName = isGroup
    ? (conversation.groupName || "Group Chat")
    : (otherNames.length > 0 ? otherNames.join(", ") : "Conversation");

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${selected ? "bg-primary-500/15 dark:bg-primary-500/30" : "hover:bg-white/60 dark:hover:bg-white/10"
        }`}
    >
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${isGroup ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" : "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"}`}>
        {isGroup ? "#" : displayName.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {displayName}
          </p>
          {isGroup && (
            <span className="flex-shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              group
            </span>
          )}
        </div>
        <p className="truncate text-xs ink-muted">
          {conversation.lastMessage || "No messages yet"}
        </p>
      </div>
      {conversation.lastMessageAt && (
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-[10px] ink-muted">
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
          {conversation.unreadCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      )}
    </button>
  );
}
