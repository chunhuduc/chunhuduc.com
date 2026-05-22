"use client";

import * as Ably from "ably";
import { useEffect, useRef } from "react";
import { conversationChannel } from "@/lib/live-chat/channels";
import type { LiveChatMessagePayload } from "@/lib/live-chat/types";

type Options = {
  conversationId: string | null;
  visitorToken: string | null;
  enabled: boolean;
  onMessage: (payload: LiveChatMessagePayload) => void;
  mode: "visitor" | "admin";
};

export function useLiveChatAbly({
  conversationId,
  visitorToken,
  enabled,
  onMessage,
  mode,
}: Options) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!enabled || !conversationId) return undefined;

    const ably = new Ably.Realtime({
      authCallback: async (_tokenParams, callback) => {
        try {
          const url =
            mode === "admin"
              ? "/api/live-chat/admin/ably/token"
              : "/api/live-chat/ably/token";
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: mode === "admin" ? "include" : "same-origin",
            body:
              mode === "visitor"
                ? JSON.stringify({ conversationId, visitorToken })
                : "{}",
          });
          if (!res.ok) {
            callback("Ably auth failed", null);
            return;
          }
          const tokenRequest = (await res.json()) as Ably.TokenRequest;
          callback(null, tokenRequest);
        } catch (e) {
          callback(e instanceof Error ? e.message : "Ably auth failed", null);
        }
      },
    });

    const channelName = conversationChannel(conversationId);
    const channel = ably.channels.get(channelName);

    const handler = (msg: Ably.Message) => {
      const data = msg.data as LiveChatMessagePayload;
      if (data?.type === "message" && data.id) {
        onMessageRef.current(data);
      }
    };

    channel.subscribe("message", handler);

    return () => {
      channel.unsubscribe("message", handler);
      ably.close();
    };
  }, [conversationId, visitorToken, enabled, mode]);
}

type InboxOptions = {
  enabled: boolean;
  onInbox: (payload: { conversationId: string }) => void;
};

export function useLiveChatInboxAbly({ enabled, onInbox }: InboxOptions) {
  const onInboxRef = useRef(onInbox);
  onInboxRef.current = onInbox;

  useEffect(() => {
    if (!enabled) return undefined;

    const ably = new Ably.Realtime({
      authCallback: async (_tokenParams, callback) => {
        try {
          const res = await fetch("/api/live-chat/admin/ably/token", {
            method: "POST",
            credentials: "include",
          });
          if (!res.ok) {
            callback("Ably auth failed", null);
            return;
          }
          const tokenRequest = (await res.json()) as Ably.TokenRequest;
          callback(null, tokenRequest);
        } catch (e) {
          callback(e instanceof Error ? e.message : "Ably auth failed", null);
        }
      },
    });

    const channel = ably.channels.get("live-chat:inbox");
    const handler = (msg: Ably.Message) => {
      const data = msg.data as { type?: string; conversationId?: string };
      if (data?.type === "conversation.updated" && data.conversationId) {
        onInboxRef.current({ conversationId: data.conversationId });
      }
    };

    channel.subscribe("conversation.updated", handler);

    return () => {
      channel.unsubscribe("conversation.updated", handler);
      ably.close();
    };
  }, [enabled]);
}
