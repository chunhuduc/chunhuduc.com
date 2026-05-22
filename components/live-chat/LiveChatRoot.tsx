import { isLiveChatEnabled } from "@/lib/live-chat/config";
import LiveChatWidget from "./LiveChatWidget";

export default function LiveChatRoot() {
  if (!isLiveChatEnabled()) return null;
  return <LiveChatWidget />;
}
