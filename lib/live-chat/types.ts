export type LiveChatSender = "visitor" | "owner";

export type LiveChatMessagePayload = {
  type: "message";
  id: string;
  sender: LiveChatSender;
  body: string;
  createdAt: string;
};

export type LiveChatInboxPayload = {
  type: "conversation.updated";
  conversationId: string;
  lastMessageAt: string;
  preview: string;
};

export type LiveChatMessageDto = {
  id: string;
  sender: LiveChatSender;
  body: string;
  createdAt: string;
};

export type LiveChatConversationDto = {
  id: string;
  visitorName: string | null;
  visitorEmail: string | null;
  pageUrl: string | null;
  status: string;
  lastMessageAt: string;
  ownerLastReadAt: string | null;
  lastPreview: string | null;
  unread: boolean;
};
