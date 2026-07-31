import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/apiClient", () => ({ requestJson: vi.fn() }));

import { requestJson } from "@/services/apiClient";
import {
  buildChatHistoryPath,
  fetchChatHistory,
} from "@/services/chatHistoryApi";

describe("chatHistoryApi", () => {
  beforeEach(() => vi.mocked(requestJson).mockReset());

  it.each([undefined, "", "   "])(
    "builds the current-user path for %s",
    (target) => {
      expect(buildChatHistoryPath(target)).toBe("/api/AIchat/history");
    },
  );

  it("trims and encodes a target user ID", () => {
    expect(buildChatHistoryPath(" user + 1 ")).toBe(
      "/api/AIchat/history?targetUserId=user%20%2B%201",
    );
  });

  it("returns history from the API", async () => {
    const history = [
      { userMessage: "Hi", response: "Hello", timestamp: "2026-01-01" },
    ];
    vi.mocked(requestJson).mockResolvedValue({ history });

    await expect(fetchChatHistory("student")).resolves.toEqual(history);
    expect(requestJson).toHaveBeenCalledWith(
      "/api/AIchat/history?targetUserId=student",
    );
  });

  it("returns an empty list for malformed or absent history", async () => {
    vi.mocked(requestJson).mockResolvedValue({ history: null } as never);
    await expect(fetchChatHistory()).resolves.toEqual([]);
  });
});
