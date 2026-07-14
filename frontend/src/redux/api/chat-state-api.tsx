import { requestJson } from "@/services/apiClient";
import type { AppDispatch, RootState } from "@src/redux/store/store";
import {
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
  type Conversation as FrontendConversation,
  type Message as FrontendMessage,
} from "../store/chat-state";
import type {
  ApiMessage,
  ConversationContentResponse,
  DeleteConversationResponse,
  ListConversationsResponse,
  NewConversationResponse,
  SendMessageResponse,
} from "../backend_models/data-structures";

const convertMessage = (message: ApiMessage): FrontendMessage => ({
  msgId: message.id || "",
  role: message.role === "user" ? "send" : "ai",
  msgContent: message.content,
});

export const fetchConversationList = () => {
  return async (dispatch: AppDispatch): Promise<FrontendConversation[]> => {
    dispatch(fetchConListReq());
    try {
      const data = await requestJson<ListConversationsResponse>(
        "/api/AIchat/conversations",
      );
      const conversations = (data.content?.data ?? []).map((conversation) => ({
        conId: conversation.id,
        conTitle: conversation.title,
        messages: [],
      }));

      dispatch(fetchConListSucceed({ conversations }));
      return conversations;
    } catch (error) {
      dispatch(fetchConListFailed());
      throw error;
    }
  };
};
export const fetchConversationContent = (conversationId: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(fetchConContentReq());
    try {
      const data = await requestJson<ConversationContentResponse>(
        `/api/AIchat/conversations/${encodeURIComponent(conversationId)}/messages`,
      );
      const messages = (data.content?.content ?? []).map(convertMessage);
      const currentConversation = getState().chat.conList[conversationId];
      const conversation: FrontendConversation = {
        conId: conversationId,
        conTitle: currentConversation?.conTitle ?? "Conversation",
        messages,
      };

      dispatch(fetchConContentSucceed({ conversation }));
      return conversation;
    } catch (error) {
      dispatch(fetchConContentFailed());
      throw error;
    }
  };
};

export const createConversation = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(createConReq());
    try {
      const data = await requestJson<NewConversationResponse>(
        "/api/AIchat/conversations",
        { method: "POST" },
      );
      const conversation: FrontendConversation = {
        conId: data.conversationId,
        conTitle: data.conversation?.title ?? "New Academic Chat",
        messages: [],
      };

      dispatch(createConSucceed({ conversation }));
      await dispatch(fetchConversationContent(data.conversationId));
      return data.conversationId;
    } catch (error) {
      dispatch(createConFailed());
      throw error;
    }
  };
};

export const sendMessage = (conversationId: string, content: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(sendMsgReq());

    const optimisticMessage: FrontendMessage = {
      msgId: `temp-${Date.now()}`,
      role: "send",
      msgContent: content,
    };
    dispatch(sendMsgSucceed({ conversationId, message: optimisticMessage }));

    try {
      const data = await requestJson<SendMessageResponse>(
        `/api/AIchat/conversations/${encodeURIComponent(conversationId)}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            message: {
              content,
              role: "user",
              conversationId,
            },
          }),
        },
      );

      dispatch(
        sendMsgSucceed({
          conversationId,
          message: convertMessage(data.response),
        }),
      );
      return data;
    } catch (error) {
      dispatch(sendMsgFailed());
      throw error;
    }
  };
};

export const deleteConversation = (conversationId: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(deleteConReq());
    try {
      const data = await requestJson<DeleteConversationResponse>(
        `/api/AIchat/conversations/${encodeURIComponent(conversationId)}`,
        { method: "DELETE" },
      );
      dispatch(deleteConSucceed({ conversationId: data.conversationId }));
      return data;
    } catch (error) {
      dispatch(deleteConFailed());
      throw error;
    }
  };
};
