import reducer, {
  changeCurrConId,
  createConFailed,
  createConReq,
  createConSucceed,
  deleteConFailed,
  deleteConReq,
  deleteConSucceed,
  fetchConContentFailed,
  fetchConContentReq,
  fetchConContentSucceed,
  fetchConListFailed,
  fetchConListReq,
  fetchConListSucceed,
  sendMsgFailed,
  sendMsgReq,
  sendMsgSucceed,
  type Conversation,
} from "@/redux/store/chat-state";

const conversation: Conversation = {
  conId: "c1",
  conTitle: "First",
  messages: [],
};

describe("chat state reducer", () => {
  it("handles selection, list loading, success, and failure", () => {
    let state = reducer(undefined, changeCurrConId({ conversationId: "c1" }));
    expect(state.currentConId).toBe("c1");
    state = reducer(state, fetchConListReq());
    expect(state.state).toBe("loading");
    state = reducer(state, fetchConListSucceed({ conversations: [conversation] }));
    expect(state.conList.c1).toEqual(conversation);
    expect(reducer(state, fetchConListFailed()).state).toBe("failed");
  });

  it("updates content only for a known conversation", () => {
    let state = reducer(undefined, fetchConContentReq());
    state = reducer(
      state,
      fetchConContentSucceed({
        conversation: { ...conversation, messages: [{ msgId: "m1", role: "ai", msgContent: "Hi" }] },
      }),
    );
    expect(state.conList).toEqual({});
    state = reducer(state, fetchConListSucceed({ conversations: [conversation] }));
    state = reducer(
      state,
      fetchConContentSucceed({
        conversation: { ...conversation, conTitle: "Updated" },
      }),
    );
    expect(state.conList.c1.conTitle).toBe("Updated");
    expect(reducer(state, fetchConContentFailed()).state).toBe("failed");
  });

  it("handles create request, success, invalid success, and failure", () => {
    let state = reducer(undefined, createConReq());
    state = reducer(state, createConSucceed({ conversation }));
    expect(state.conList.c1).toEqual(conversation);
    state = reducer(
      state,
      createConSucceed({ conversation: { ...conversation, conId: "" } }),
    );
    expect(Object.keys(state.conList)).toEqual(["c1"]);
    expect(reducer(state, createConFailed()).state).toBe("failed");
  });

  it("adds messages only to known conversations and handles failures", () => {
    let state = reducer(undefined, fetchConListSucceed({ conversations: [conversation] }));
    state = reducer(state, sendMsgReq());
    state = reducer(
      state,
      sendMsgSucceed({
        conversationId: "c1",
        message: { msgId: "m1", role: "send", msgContent: "Hello" },
      }),
    );
    expect(state.conList.c1.messages).toHaveLength(1);
    state = reducer(
      state,
      sendMsgSucceed({
        conversationId: "missing",
        message: { msgId: "m2", role: "ai", msgContent: "No-op" },
      }),
    );
    expect(reducer(state, sendMsgFailed()).state).toBe("failed");
  });

  it("deletes known conversations and handles delete states", () => {
    let state = reducer(undefined, fetchConListSucceed({ conversations: [conversation] }));
    state = reducer(state, deleteConReq());
    state = reducer(state, deleteConSucceed({ conversationId: "missing" }));
    expect(state.conList.c1).toBeDefined();
    state = reducer(state, deleteConSucceed({ conversationId: "c1" }));
    expect(state.conList.c1).toBeUndefined();
    expect(reducer(state, deleteConFailed()).state).toBe("failed");
  });
});
