import { requestJson } from "./apiClient";

export interface ChatHistoryExchange {
  userMessage: string;
  response: string;
  timestamp: string;
}

interface ChatHistoryResponse {
  history?: ChatHistoryExchange[];
}

export const buildChatHistoryPath = (targetUserId?: string): string => {
  const normalizedTarget = targetUserId?.trim();
  if (!normalizedTarget) {
    return "/api/AIchat/history";
  }

  return `/api/AIchat/history?targetUserId=${encodeURIComponent(normalizedTarget)}`;
};

export const fetchChatHistory = async (
  targetUserId?: string,
): Promise<ChatHistoryExchange[]> => {
  const data = await requestJson<ChatHistoryResponse>(
    buildChatHistoryPath(targetUserId),
  );
  return Array.isArray(data.history) ? data.history : [];
};
