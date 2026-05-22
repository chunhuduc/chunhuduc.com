import { useCallback, useLayoutEffect, useRef } from "react";

const BOTTOM_THRESHOLD_PX = 48;

type ScrollableMessage = { sender?: string };

export function useChatMessageListScroll(
  messages: ScrollableMessage[],
  enabled: boolean,
  /** Always scroll to bottom when this party sends (visitor widget vs admin inbox). */
  ownSender: "visitor" | "owner" = "visitor",
) {
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  const isNearBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_THRESHOLD_PX;
  }, []);

  const onScroll = useCallback(() => {
    stickToBottomRef.current = isNearBottom();
  }, [isNearBottom]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const forceScrollToBottom = useCallback(() => {
    stickToBottomRef.current = true;
    scrollToBottom("auto");
  }, [scrollToBottom]);

  useLayoutEffect(() => {
    if (!enabled || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last?.sender === ownSender) {
      stickToBottomRef.current = true;
      scrollToBottom("auto");
      return;
    }
    if (stickToBottomRef.current) {
      scrollToBottom("auto");
    }
  }, [messages, enabled, ownSender, scrollToBottom]);

  useLayoutEffect(() => {
    if (!enabled) return;
    stickToBottomRef.current = true;
    scrollToBottom("auto");
  }, [enabled, scrollToBottom]);

  return { listRef, onScroll, forceScrollToBottom };
}
