import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  conList: { [conId: string]: Conversation };
  state: "loading" | "succeeded" | "failed";
  currentConId: string;
}

export interface Conversation {
  conId: string;
  conTitle: string;
  messages: Message[];
}

export interface Message {
  msgId: string;
  role: "send" | "ai";  // 
  msgContent: string;
}

// Define action payload interfaces
export interface ConPayload {
  conversation: Conversation;
}

export interface ConIdPayload {
  conversationId: string;
}

export interface MsgPayload {
  conversationId: string;
  message: Message;
}

export interface ConListPayload {
  conversations: Conversation[];
}

const initialState: ChatState = {
  conList: {},
  state: "succeeded",
  currentConId: "",
};

const chatStateSlice = createSlice({
  name: "chatState",
  initialState,
  reducers: {
    changeCurrConId(state, action: PayloadAction<ConIdPayload>) {
      console.log("changeCurrConId reducer triggered", action.payload);
      state.currentConId = action.payload.conversationId;
    },

    // Fetch the list of conversation
    fetchConListReq(state) {
      console.log("fetchConListReq reducer triggered");
      state.state = "loading";
    },
    fetchConListSucceed(state, action: PayloadAction<ConListPayload>) {
      console.log("fetchConListSucceed reducer triggered", action.payload);
      action.payload.conversations.forEach((con) => {
        state.conList[con.conId] = con;
        console.log("conList", state.conList);
      });
      state.state = "succeeded";
    },
    fetchConListFailed(state) {
      console.log("fetchConListFailed reducer triggered");
      state.state = "failed";
    },

    //fetch the content of a conversations
    fetchConContentReq(state) {
      console.log("fetchConContentReq reducer triggered");
      state.state = "loading";
    },
    fetchConContentSucceed(state, action: PayloadAction<ConPayload>) {
      console.log("fetchConContentSucceed reducer triggered", action.payload);
      const con = state.conList[action.payload.conversation.conId];
      if (con) {
        state.conList[action.payload.conversation.conId] =
          action.payload.conversation;
      }
      state.state = "succeeded";
    },
    fetchConContentFailed(state) {
      console.log("fetchConContentFailed reducer triggered");
      state.state = "failed";
    },

    //create a new conversation
    createConReq(state) {
      console.log("createConReq reducer triggered");
      state.state = "loading";
    },
    createConSucceed(state, action: PayloadAction<ConPayload>) {
      console.log("createConSucceed reducer triggered", action.payload);
      if (action.payload.conversation.conId) {
        state.conList[action.payload.conversation.conId] =
          action.payload.conversation;
      }
      state.state = "succeeded";
    },
    createConFailed(state) {
      console.log("createConFailed reducer triggered");
      state.state = "failed";
    },

    //send a message
    sendMsgReq(state) {
      console.log("sendMsgReq reducer triggered");
      state.state = "loading";
    },
    sendMsgSucceed(state, action: PayloadAction<MsgPayload>) {
      console.log("sendMsgSucceed reducer triggered", action.payload);
      const con = state.conList[action.payload.conversationId];
      if (con) {
        con.messages.push(action.payload.message);
      }
      state.state = "succeeded";
    },
    sendMsgFailed(state) {
      console.log("sendMsgFailed reducer triggered");
      state.state = "failed";
    },

    //delete a conversation
    deleteConReq(state) {
      console.log("deleteConReq reducer triggered");
      state.state = "loading";
    },
    deleteConSucceed(state, action: PayloadAction<ConIdPayload>) {
      console.log("deleteConSucceed reducer triggered", action.payload);
      const conId = action.payload.conversationId;
      if (state.conList[conId]) {
        delete state.conList[conId];
      }
      state.state = "succeeded";
    },
    deleteConFailed(state) {
      console.log("deleteConFailed reducer triggered");
      state.state = "failed";
    },
  },
});

// Export actions and reducer
export const {
  changeCurrConId,
  fetchConListReq,
  fetchConListSucceed,
  fetchConListFailed,
  fetchConContentReq,
  fetchConContentSucceed,
  fetchConContentFailed,
  createConReq,
  createConSucceed,
  createConFailed,
  sendMsgReq,
  sendMsgSucceed,
  sendMsgFailed,
  deleteConReq,
  deleteConSucceed,
  deleteConFailed,
} = chatStateSlice.actions;

export default chatStateSlice.reducer;
