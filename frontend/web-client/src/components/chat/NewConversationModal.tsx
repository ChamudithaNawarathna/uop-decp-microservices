import { useState, useEffect, useRef } from "react";
import { userService } from "../../services/user";
import type { User } from "../../types";

interface NewConversationModalProps {
  open: boolean;
  onClose: () => void;
  onStart: (participants: User[], groupName?: string) => Promise<void>;
  loading?: boolean;
}

export default function NewConversationModal({
  open,
  onClose,
  onStart,
  loading = false,
}: NewConversationModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [selected, setSelected] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGroup = selected.length > 1;

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setSelected([]);
      setGroupName("");
      setError("");
    }
  }, [open]);

  useEffect(() => {
    if (!open || !query.trim()) {
      setResults([]);
      setError("");
      return;
    }
    setSearching(true);
    setError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await userService.searchByUsername(query.trim());
        const users = Array.isArray(res.data) ? res.data : [res.data];
        setResults(users);
        if (users.length === 0) setError("No users found");
      } catch {
        setResults([]);
        setError("No users found");
      }
      setSearching(false);
    }, 300);
  }, [open, query]);

  const toggleUser = (user: User) => {
    setSelected((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user],
    );
  };

  const handleStart = async () => {
    if (selected.length === 0) return;
    await onStart(selected, isGroup ? groupName.trim() || undefined : undefined);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            New Conversation
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selected.map((u) => (
              <span
                key={u.id}
                className="flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
              >
                {u.fullName}
                <button
                  onClick={() => toggleUser(u)}
                  className="ml-1 text-primary-500 hover:text-primary-700"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Group name input (only when 2+ selected) */}
        {isGroup && (
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name (optional)"
            className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        )}

        {/* Search */}
        <div className="mt-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username..."
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            autoFocus
          />
        </div>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        {searching && <p className="mt-2 text-sm text-gray-500">Searching...</p>}

        {results.length > 0 && (
          <div className="mt-3 max-h-52 overflow-y-auto space-y-2">
            {results.map((u) => {
              const isSelected = !!selected.find((s) => s.id === u.id);
              return (
                <div
                  key={u.id}
                  onClick={() => toggleUser(u)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    isSelected
                      ? "border-primary-400 bg-primary-50 dark:border-primary-600 dark:bg-primary-900/30"
                      : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                    {u.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{u.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">@{u.username} · {u.role}</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-primary-500 bg-primary-500" : "border-gray-300"
                  }`}>
                    {isSelected && <span className="text-white text-[10px]">✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={selected.length === 0 || loading}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-primary-600 to-emerald-600 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-50 hover:brightness-110 transition"
        >
          {loading
            ? "Starting..."
            : isGroup
              ? `Create Group (${selected.length + 1} members)`
              : "Start Chat"}
        </button>
      </div>
    </div>
  );
}
