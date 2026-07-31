import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/apiClient", () => ({ requestJson: vi.fn() }));

import { requestJson } from "@/services/apiClient";
import {
  createConversation,
  deleteConversation,
  fetchConversationContent,
  fetchConversationList,
  sendMessage,
} from "@/redux/api/chat-state-api";

const dispatch = vi.fn();
const error = new Error("network error");

describe("chat API thunks", () => {
  beforeEach(() => {
    dispatch.mockReset();
    vi.mocked(requestJson).mockReset();
  });

  it("fetches and maps the conversation list", async () => {
    vi.mocked(requestJson).mockResolvedValue({
      content: { data: [{ id: "c1", title: "First" }] },
    });
    const result = await fetchConversationList()(dispatch);
    expect(result).toEqual([{ conId: "c1", conTitle: "First", messages: [] }]);
    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
      "chatState/fetchConListReq",
      "chatState/fetchConListSucceed",
    ]);
  });

  it("handles absent list content and list failures", async () => {
    vi.mocked(requestJson).mockResolvedValueOnce({});
    await expect(fetchConversationList()(dispatch)).resolves.toEqual([]);
    vi.mocked(requestJson).mockRejectedValueOnce(error);
    await expect(fetchConversationList()(dispatch)).rejects.toThrow(error);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "chatState/fetchConListFailed",
    });
  });

  it("fetches content, maps roles, and keeps the known title", async () => {
    vi.mocked(requestJson).mockResolvedValue({
      content: {
        content: [
          { id: "m1", role: "user", content: "Question" },
          { id: undefined, role: "assistant", content: "Answer" },
        ],
      },
    });
    const getState = () => ({
      chat: {
        conList: { c1: { conId: "c1", conTitle: "First", messages: [] } },
        state: "succeeded" as const,
        currentConId: "c1",
      },
    });
    const result = await fetchConversationContent("c/1")(dispatch, getState);
    expect(result.conTitle).toBe("Conversation");
    expect(result.messages).toEqual([
      { msgId: "m1", role: "send", msgContent: "Question" },
      { msgId: "", role: "ai", msgContent: "Answer" },
    ]);
    expect(requestJson).toHaveBeenCalledWith(
      "/api/AIchat/conversations/c%2F1/messages",
    );
  });

  it("handles content failures", async () => {
    vi.mocked(requestJson).mockRejectedValue(error);
    await expect(
      fetchConversationContent("c1")(dispatch, () => ({ chat: { conList: {} } }) as never),
    ).rejects.toThrow(error);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "chatState/fetchConContentFailed",
    });
  });

  it("creates a conversation and dispatches its content fetch", async () => {
    vi.mocked(requestJson).mockResolvedValueOnce({
      conversationId: "c1",
      conversation: {},
    });
    dispatch.mockImplementation((action) => action);
    await expect(createConversation()(dispatch)).resolves.toBe("c1");
    expect(dispatch.mock.calls[1][0]).toMatchObject({
      type: "chatState/createConSucceed",
      payload: { conversation: { conTitle: "New Academic Chat" } },
    });
    expect(typeof dispatch.mock.calls[2][0]).toBe("function");
  });

  it("handles create failures", async () => {
    vi.mocked(requestJson).mockRejectedValue(error);
    await expect(createConversation()(dispatch)).rejects.toThrow(error);
    expect(dispatch).toHaveBeenLastCalledWith({ type: "chatState/createConFailed" });
  });

  it("optimistically sends a message and maps the response", async () => {
    vi.spyOn(Date, "now").mockReturnValue(42);
    vi.mocked(requestJson).mockResolvedValue({
      response: { id: "m2", role: "assistant", content: "Answer" },
    });
    await sendMessage("c/1", "Question")(dispatch);
    expect(dispatch.mock.calls[1][0].payload.message.msgId).toBe("temp-42");
    expect(dispatch.mock.calls[2][0].payload.message).toEqual({
      msgId: "m2",
      role: "ai",
      msgContent: "Answer",
    });
  });

  it("handles send failures", async () => {
    vi.mocked(requestJson).mockRejectedValue(error);
    await expect(sendMessage("c1", "Question")(dispatch)).rejects.toThrow(error);
    expect(dispatch).toHaveBeenLastCalledWith({ type: "chatState/sendMsgFailed" });
  });

  it("deletes encoded conversation IDs and handles failures", async () => {
    vi.mocked(requestJson).mockResolvedValueOnce({ conversationId: "c/1" });
    await deleteConversation("c/1")(dispatch);
    expect(requestJson).toHaveBeenCalledWith(
      "/api/AIchat/conversations/c%2F1",
      { method: "DELETE" },
    );
    expect(dispatch).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: "chatState/deleteConSucceed" }),
    );

    vi.mocked(requestJson).mockRejectedValueOnce(error);
    await expect(deleteConversation("c1")(dispatch)).rejects.toThrow(error);
    expect(dispatch).toHaveBeenLastCalledWith({ type: "chatState/deleteConFailed" });
  });
});
