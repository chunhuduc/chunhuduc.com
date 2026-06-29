"use client";

import type { CSSProperties, ReactNode } from "react";
import { LIVE_CHAT_OPEN_EVENT } from "@/components/live-chat/constants";

/**
 * Opens the live chat panel (LiveChatWidget) by dispatching a window event the
 * widget listens for. Used as the mobile variant of the hero CTA.
 */
export default function WorkWithMeButton({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  function handleClick() {
    window.dispatchEvent(new CustomEvent(LIVE_CHAT_OPEN_EVENT));
  }

  return (
    <button type="button" onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  );
}
