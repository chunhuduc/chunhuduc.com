import Ably from "ably";
import { getAblyApiKey } from "./config";
import { INBOX_CHANNEL, conversationChannel } from "./channels";
import type { LiveChatInboxPayload, LiveChatMessagePayload } from "./types";

let restClient: Ably.Rest | null = null;

function getRest(): Ably.Rest {
  if (!restClient) {
    restClient = new Ably.Rest({ key: getAblyApiKey() });
  }
  return restClient;
}

export async function createVisitorTokenRequest(
  conversationId: string,
): Promise<Ably.TokenRequest> {
  const rest = getRest();
  const channel = conversationChannel(conversationId);
  return rest.auth.createTokenRequest({
    capability: { [channel]: ["subscribe"] },
    ttl: 60 * 60 * 1000,
  });
}

export async function createAdminTokenRequest(): Promise<Ably.TokenRequest> {
  const rest = getRest();
  return rest.auth.createTokenRequest({
    capability: {
      "live-chat:conv:*": ["subscribe"],
      [INBOX_CHANNEL]: ["subscribe"],
    },
    ttl: 60 * 60 * 1000,
  });
}

export async function publishMessage(
  conversationId: string,
  payload: LiveChatMessagePayload,
): Promise<void> {
  const rest = getRest();
  await rest.channels.get(conversationChannel(conversationId)).publish("message", payload);
}

export async function publishInboxUpdate(payload: LiveChatInboxPayload): Promise<void> {
  const rest = getRest();
  await rest.channels.get(INBOX_CHANNEL).publish("conversation.updated", payload);
}
