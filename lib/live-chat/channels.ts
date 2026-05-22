export function conversationChannel(conversationId: string): string {
  return `live-chat:conv:${conversationId}`;
}

export const INBOX_CHANNEL = "live-chat:inbox";
