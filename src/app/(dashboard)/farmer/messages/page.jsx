"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthProvider";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import {
  FiSend, FiSearch, FiCheck, FiCheckCircle,
  FiMessageCircle, FiInbox, FiUser, FiArrowLeft, FiTrash2
} from "react-icons/fi";
import Swal from "sweetalert2";

// ─── helpers ────────────────────────────────────────────────────────────────
function getToken() {
  return localStorage.getItem("authToken");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ─── MessageBubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, myEmail, conversationId, onDelete }) {
  const isMe = msg.senderEmail === myEmail;
  const [showActions, setShowActions] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete message?",
      text: "This will be removed for everyone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/messages/${conversationId}?messageId=${msg._id}`,
        { method: "DELETE", headers: authHeaders() }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onDelete(msg._id);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1 group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex items-end gap-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
        {/* Delete button — only for sender */}
        {isMe && (
          <div className={`transition-opacity ${showActions ? "opacity-100" : "opacity-0"}`}>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn btn-ghost btn-xs text-error p-1"
              title="Delete message"
            >
              {deleting
                ? <span className="loading loading-spinner loading-xs" />
                : <FiTrash2 className="w-3.5 h-3.5" />
              }
            </button>
          </div>
        )}

        <div
          className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm
            ${isMe
              ? "bg-primary text-primary-content rounded-br-none"
              : "bg-base-100 text-base-content rounded-bl-none border border-base-300"
            }`}
        >
          <p className="break-words leading-relaxed">{msg.text}</p>
          <div className={`flex items-center justify-end gap-1 mt-0.5 text-xs opacity-60`}>
            <span>
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit", minute: "2-digit",
              })}
            </span>
            {isMe && (
              msg.seen
                ? <FiCheckCircle className="w-3 h-3" />
                : <FiCheck className="w-3 h-3" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ConversationItem ────────────────────────────────────────────────────────
function ConversationItem({ convo, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left
        transition-colors border-b border-base-200
        ${active ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-base-200"}`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="avatar placeholder">
          <div className="w-12 rounded-full bg-neutral text-neutral-content">
            {convo.otherPhoto ? (
              <img src={convo.otherPhoto} alt={convo.otherName} className="rounded-full" />
            ) : (
              <span className="text-lg font-bold">
                {(convo.otherName || "?")[0].toUpperCase()}
              </span>
            )}
          </div>
        </div>
        {convo.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
            flex items-center justify-center text-xs font-bold
            rounded-full bg-primary text-primary-content">
            {convo.unreadCount > 9 ? "9+" : convo.unreadCount}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={`font-semibold text-sm truncate
            ${convo.unreadCount > 0 ? "text-primary" : "text-base-content"}`}>
            {convo.otherName || "Unknown"}
          </span>
          {convo.lastMessageAt && (
            <span className="text-xs text-base-content/40 shrink-0">
              {formatDistanceToNow(new Date(convo.lastMessageAt), { addSuffix: true })}
            </span>
          )}
        </div>
        <p className={`text-xs truncate
          ${convo.unreadCount > 0
            ? "font-semibold text-base-content"
            : "text-base-content/50"}`}>
          {convo.lastMessage || "No messages yet"}
        </p>
      </div>
    </button>
  );
}

// ─── RequestItem (farmer only) ───────────────────────────────────────────────
function RequestItem({ req, onAction }) {
  const [loading, setLoading] = useState(null);

  const handle = async (action) => {
    setLoading(action);
    try {
      const res = await fetch(`/api/messages/requests/${req._id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onAction(req._id, action, data);
      toast.success(action === "approve" ? "Request approved!" : "Request declined.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-base-200">
      <div className="avatar placeholder shrink-0">
        <div className="w-11 rounded-full bg-neutral text-neutral-content">
          {req.buyerPhoto
            ? <img src={req.buyerPhoto} alt={req.buyerName} className="rounded-full" />
            : <span className="font-bold">{(req.buyerName || "B")[0].toUpperCase()}</span>
          }
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{req.buyerName}</p>
        <p className="text-xs text-base-content/50">wants to message you</p>
      </div>
      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => handle("approve")}
          disabled={!!loading}
          className="btn btn-success btn-xs"
        >
          {loading === "approve"
            ? <span className="loading loading-spinner loading-xs" />
            : "Accept"}
        </button>
        <button
          onClick={() => handle("decline")}
          disabled={!!loading}
          className="btn btn-error btn-outline btn-xs"
        >
          {loading === "decline"
            ? <span className="loading loading-spinner loading-xs" />
            : "Decline"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const { user } = useAuthContext();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState(searchParams.get("tab") || "chats");
  const [conversations, setConversations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  const isFarmer = user?.role === "farmer";

  // ── Fetch conversations ──────────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages/conversations", {
        headers: authHeaders(),
      });
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch {}
    finally { setLoadingConvos(false); }
  }, []);

  // ── Fetch requests (farmer only) ─────────────────────────────────────────
  const fetchRequests = useCallback(async () => {
    if (!isFarmer) return;
    try {
      const res = await fetch("/api/messages/requests", {
        headers: authHeaders(),
      });
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {}
  }, [isFarmer]);

  // ── Fetch messages for active conversation ───────────────────────────────
  const fetchMessages = useCallback(async () => {
    if (!activeId) return;
    try {
      const res = await fetch(`/api/messages/${activeId}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {}
  }, [activeId]);

  // ── Initial load ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchConversations();
    fetchRequests();
    const interval = setInterval(() => {
      fetchConversations();
      fetchRequests();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations, fetchRequests]);

  // ── Poll messages every 3s ───────────────────────────────────────────────
  useEffect(() => {
    if (!activeId) return;
    setLoadingMsgs(true);
    fetchMessages().finally(() => setLoadingMsgs(false));

    clearInterval(pollRef.current);
    pollRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(pollRef.current);
  }, [activeId, fetchMessages]);

  // ── Mark seen ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeId || messages.length === 0) return;
    fetch(`/api/messages/${activeId}/seen`, {
      method: "PATCH",
      headers: authHeaders(),
    }).catch(() => {});
  }, [activeId, messages.length]);

  // ── Scroll to bottom ─────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // ── Delete message ───────────────────────────────────────────────────────
  const handleDeleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((m) => m._id !== messageId));
    fetchConversations(); // refresh last message in sidebar
  };

  // ── Send message ─────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!text.trim() || sending || !activeId) return;

    const optimistic = {
      _id: `opt-${Date.now()}`,
      text: text.trim(),
      senderEmail: user?.email,
      seen: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setText("");
    setSending(true);

    try {
      await fetch(`/api/messages/${activeId}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ text: optimistic.text }),
      });
      fetchMessages();
      fetchConversations();
    } catch {
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      setText(optimistic.text);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // ── Select conversation ──────────────────────────────────────────────────
  const selectConvo = (convo) => {
    setActiveId(convo._id.toString());
    setMobileShowChat(true);
  };

  // ── Handle request action ────────────────────────────────────────────────
  const handleRequestAction = (reqId, action, data) => {
    // Remove request from pending list
    setRequests((prev) => prev.filter((r) => r._id !== reqId));
    if (action === "approve" && data?.conversationId) {
      fetchConversations();
      setTab("chats");
      toast.success("Request approved! Conversation started.");
    }
  };

  const activeConvo = conversations.find((c) => c._id?.toString() === activeId);
  const filteredConvos = conversations.filter((c) =>
    (c.otherName || "").toLowerCase().includes(search.toLowerCase())
  );
  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="h-[calc(100vh-64px)] flex bg-base-200 overflow-hidden">

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside className={`
        w-full md:w-80 lg:w-96 flex-shrink-0
        flex flex-col bg-base-100 border-r border-base-300
        ${mobileShowChat ? "hidden md:flex" : "flex"}
      `}>

        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-base-300">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-black">Messages</h1>
            {isFarmer && pendingRequests.length > 0 && (
              <div className="badge badge-warning gap-1">
                {pendingRequests.length} request{pendingRequests.length > 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Search */}
          <label className="input input-bordered input-sm flex items-center gap-2">
            <FiSearch className="w-4 h-4 opacity-50" />
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="grow"
            />
          </label>
        </div>

        {/* Tabs (farmer only) */}
        {isFarmer && (
          <div className="flex border-b border-base-300">
            <button
              onClick={() => setTab("chats")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors
                ${tab === "chats"
                  ? "border-b-2 border-primary text-primary"
                  : "text-base-content/50 hover:text-base-content"}`}
            >
              <FiMessageCircle className="w-4 h-4" />
              Chats
              {conversations.reduce((s, c) => s + (c.unreadCount || 0), 0) > 0 && (
                <span className="badge badge-primary badge-sm">
                  {conversations.reduce((s, c) => s + (c.unreadCount || 0), 0)}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab("requests")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors
                ${tab === "requests"
                  ? "border-b-2 border-warning text-warning"
                  : "text-base-content/50 hover:text-base-content"}`}
            >
              <FiInbox className="w-4 h-4" />
              Requests
              {pendingRequests.length > 0 && (
                <span className="badge badge-warning badge-sm">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {tab === "chats" ? (
            loadingConvos ? (
              <div className="flex flex-col gap-0">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-base-200">
                    <div className="skeleton w-12 h-12 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-3 w-28" />
                      <div className="skeleton h-2.5 w-40" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConvos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-base-content/30 gap-2">
                <FiMessageCircle className="w-10 h-10" />
                <p className="text-sm">No conversations yet</p>
                {!isFarmer && (
                  <a href="/farmers" className="btn btn-primary btn-sm mt-2">
                    Browse Farmers
                  </a>
                )}
              </div>
            ) : (
              filteredConvos.map((convo) => (
                <ConversationItem
                  key={convo._id}
                  convo={convo}
                  active={activeId === convo._id?.toString()}
                  onClick={() => selectConvo(convo)}
                />
              ))
            )
          ) : (
            // Requests tab (farmer only)
            pendingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-base-content/30 gap-2">
                <FiInbox className="w-10 h-10" />
                <p className="text-sm">No pending requests</p>
              </div>
            ) : (
              pendingRequests.map((req) => (
                <RequestItem
                  key={req._id}
                  req={req}
                  onAction={handleRequestAction}
                />
              ))
            )
          )}
        </div>

        {/* Buyer CTA */}
        {!isFarmer && (
          <div className="p-3 border-t border-base-300">
            <a href="/farmers" className="btn btn-primary btn-sm w-full gap-2">
              <FiMessageCircle className="w-4 h-4" />
              Browse Farmers
            </a>
          </div>
        )}
      </aside>

      {/* ── Chat panel ────────────────────────────────────────────────── */}
      <main className={`
        flex-1 flex flex-col min-w-0
        ${!mobileShowChat ? "hidden md:flex" : "flex"}
      `}>
        {!activeId ? (
          // Empty state
          <div className="flex-1 flex flex-col items-center justify-center text-base-content/30 gap-3">
            <FiMessageCircle className="w-16 h-16" />
            <p className="text-lg font-semibold">Select a conversation</p>
            <p className="text-sm">Choose from the list to start chatting</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-base-100 border-b border-base-300 shrink-0">
              {/* Mobile back button */}
              <button
                onClick={() => setMobileShowChat(false)}
                className="btn btn-ghost btn-circle btn-sm md:hidden"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>

              <div className="avatar placeholder">
                <div className="w-10 rounded-full bg-neutral text-neutral-content">
                  {activeConvo?.otherPhoto ? (
                    <img src={activeConvo.otherPhoto} alt={activeConvo.otherName} className="rounded-full" />
                  ) : (
                    <span className="font-bold">
                      {(activeConvo?.otherName || "?")[0].toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm">{activeConvo?.otherName}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                  Active
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-base-200">
              {loadingMsgs ? (
                <div className="flex justify-center items-center h-full">
                  <span className="loading loading-spinner loading-md text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-base-content/30 gap-2">
                  <p className="text-sm">No messages yet — say hello! 👋</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg._id}
                      msg={msg}
                      myEmail={user?.email}
                      conversationId={activeId}
                      onDelete={handleDeleteMessage}
                    />
                  ))}
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-base-100 border-t border-base-300 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Type a message…"
                  className="input input-bordered flex-1 rounded-full text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim() || sending}
                  className="btn btn-primary btn-circle shrink-0"
                >
                  {sending
                    ? <span className="loading loading-spinner loading-xs" />
                    : <FiSend className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}