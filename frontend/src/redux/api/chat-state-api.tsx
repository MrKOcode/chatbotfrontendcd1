const API_BASE = import.meta.env.VITE_API_BASE_URL;


import { AppDispatch } from "@src/redux/store/store";
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
  Message as FrontendMessage,
} from "../store/chat-state";

import {
  ListConversationsResponse,
  ConversationContentResponse,
  NewConversationResponse,
  SendMessageResponse,
  DeleteConversationResponse,
  Message as BackendMessage,
} from "../backend_models/data-structures";

// Utility function to convert backend Message to frontend Message **Delete for self-assessment development
// const convertMessage = (message: BackendMessage): FrontendMessage => {
//   console.log("convertMessage - Input:", message);
//   const result = {
//     msgId: message.messageId || "",
//     role: message.role === "user" ? "send" : ("ai" as "send" | "ai"),
//     msgContent: message.content,
//   };
//   console.log("convertMessage - Output:", result);
//   return result;
// };

// ✅ Add this helper right after imports
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("idToken") || ""}`,
});

const convertMessage = (message: BackendMessage): FrontendMessage => {
  const roleMap: { [key: string]: FrontendMessage["role"] } = {
    user: "send",
    chatbot: "ai",
    system: "ai", // or define a third "system" if needed
  };

  return {
    msgId: message.messageId || "",
    role: roleMap[message.role],
    msgContent: message.content,
  };

};


// Fetch conversation list
export const fetchConversationList = () => {
  return async (dispatch: AppDispatch) => {
    console.log("fetchConversationList - Starting");
    dispatch(fetchConListReq());
    console.log("fetchConversationList - Dispatched fetchConListReq");
    try {
      console.log(
        "fetchConversationList - Sending request to ${API_BASE}/api/AIchat/conversations",
      );
      const userId = localStorage.getItem("userId");
      if (!userId) {
  console.warn("User not logged in yet. Skipping API call.");
  dispatch(fetchConListFailed()); // or a dedicated "not logged in" action
  return;
}

      const response = await fetch(`${API_BASE}/api/AIchat/conversations?userId=${userId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      console.log("fetchConversationList - Received response:", response);

      if (!response.ok) {
        console.error("fetchConversationList - Network response was not ok");
        throw new Error("Network response was not ok");
      }

      const data: ListConversationsResponse = await response.json();
      console.log("fetchConversationList - Parsed JSON data:", data);

      // Convert backend conversations to frontend format
      const rawData =data?.content?.data||[]
      const conversations = rawData.map((conversation) => ({
        conId: conversation.conversationId,
        conTitle: conversation.title,
        messages: [], // Empty messages array as we need to fetch content separately
      }));
      console.log(
        "fetchConversationList - Converted conversations:",
        conversations,
      );

      dispatch(fetchConListSucceed({ conversations }));
      console.log("fetchConversationList - Dispatched fetchConListSucceed");
    } catch (error) {
      console.error("fetchConversationList - Error occurred:", error);
      dispatch(fetchConListFailed());
      console.log("fetchConversationList - Dispatched fetchConListFailed");
      console.error(
        "Error fetching conversation list:",
        error instanceof Error ? error.message : String(error),
      );
    }
  };
};

// Fetch conversation content
export const fetchConversationContent = (conversationId: string) => {
  return async (dispatch: AppDispatch) => {
    console.log(
      `fetchConversationContent - Starting for conversationId: ${conversationId}`,
    );
    dispatch(fetchConContentReq());
    console.log("fetchConversationContent - Dispatched fetchConContentReq");

    try {
      const userId = localStorage.getItem("userId");
      console.log(
        `fetchConversationContent - Sending request to /api/AIchat/conversations/${conversationId}/messages?userId=${userId}`,
      );

      // ✅ Updated endpoint (matches your future /messages route)
      const response = await fetch(
        `${API_BASE}/api/AIchat/conversations/${conversationId}/messages?userId=${userId}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      console.log("fetchConversationContent - Received response:", response);

      if (!response.ok) {
        console.error("fetchConversationContent - Network response was not ok");
        throw new Error("Network response was not ok");
      }

      // ✅ Keep your existing backend type
      const data: ConversationContentResponse = await response.json();
      console.log("fetchConversationContent - Parsed JSON data:", data);

      // ✅ Add explicit typing for array element (fixes implicit any)
      const messages = data.content.content.map((message: any) =>
        convertMessage(message),
      );
      console.log("fetchConversationContent - Converted messages:", messages);

      const conversation = {
        conId: conversationId,
        conTitle: "", // title not provided in response
        messages,
      };
      console.log(
        "fetchConversationContent - Constructed conversation:",
        conversation,
      );

      dispatch(fetchConContentSucceed({ conversation }));
      console.log(
        "fetchConversationContent - Dispatched fetchConContentSucceed",
      );
    } catch (error) {
      console.error("fetchConversationContent - Error occurred:", error);
      dispatch(fetchConContentFailed());
      console.log(
        "fetchConversationContent - Dispatched fetchConContentFailed",
      );
      console.error(
        "Error fetching conversation content:",
        error instanceof Error ? error.message : String(error),
      );
    }
  };
};


// Create a new conversation
export const createConversation = () => {
  return async (dispatch: AppDispatch) => {
    console.log("createConversation - Starting");
    dispatch(createConReq());
    console.log("createConversation - Dispatched createConReq");
    try {
      const requestBody = {
        userId: localStorage.getItem("userId"),
      };
      console.log("createConversation - Request body:", requestBody);

      console.log("createConversation - Sending request to /api/AIchat/conversations");

      const response = await fetch(`${API_BASE}/api/AIchat/conversations`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });
      console.log("createConversation - Received response:", response);

      if (!response.ok) {
        console.error("createConversation - Network response was not ok");
        throw new Error("Network response was not ok");
      }

      const data: NewConversationResponse = await response.json();
      console.log("createConversation - Parsed JSON data:", data);

      // Create conversation in frontend format
      const conversation = {
        conId: data.conversationId,
        conTitle: data.conversation.title,
        messages: [],
      };
      console.log("createConversation - Constructed conversation:", conversation);

      dispatch(createConSucceed({ conversation }));
      console.log("createConversation - Dispatched createConSucceed");

      // ** Add this to immediately load messages into Redux**
await dispatch(fetchConversationContent(data.conversationId));
      return data.conversationId;
    } catch (error) {
      console.error("createConversation - Error occurred:", error);
      dispatch(createConFailed());
      console.log("createConversation - Dispatched createConFailed");
      console.error(
        "Error creating conversation:",
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  };
};

// Send a message to a conversation
export const sendMessage = (conversationId: string, content: string) => {
  return async (dispatch: AppDispatch) => {
    console.log(
      `sendMessage - Starting for conversationId: ${conversationId}, content: ${content}`,
    );
    dispatch(sendMsgReq());
    console.log("sendMessage - Dispatched sendMsgReq");
    try {
      // Create temporary frontend message to show immediately
      const sendMsgFront: FrontendMessage = {
        msgId: "temp-" + Date.now(),
        role: "send",
        msgContent: content,
      };
      console.log(
        "sendMessage - Created temporary frontend message:",
        sendMsgFront,
      );

      // Dispatch success for user message immediately for UI feedback
      dispatch(
        sendMsgSucceed({
          conversationId,
          message: sendMsgFront,
        }),
      );
      console.log("sendMessage - Dispatched sendMsgSucceed for user message");

      // Create message in backend format
     const message = {
  content,
  role: "user", //  still a string here because we use it in the backend
  createdAt: new Date().toISOString(),
  conversationId: conversationId, //ensure conversation Id is a number
};
      console.log("sendMessage - Created backend message:", message);

      const requestBody = {
        userId: localStorage.getItem("userId"),
        conversationId,
        message, // Use the correct field name expected by the API
      };
      console.log("sendMessage - Request body:", requestBody);

      console.log(
        "sendMessage - Sending request to api/AIchat" +
          conversationId +
          "/content",
      );
      const response = await fetch(
        `${API_BASE}/api/AIchat/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(requestBody),
        },
      );
      console.log("sendMessage - Received response:", response);

      if (!response.ok) {
        console.error("sendMessage - Network response was not ok");
        throw new Error("Network response was not ok");
      }

      const data: SendMessageResponse = await response.json();
      console.log("sendMessage - Parsed JSON data:", data);

      // Convert the AI response to frontend format
      const resMsgFront = convertMessage(data.response);
      console.log("sendMessage - Converted AI response:", resMsgFront);

      // Dispatch success for AI response
      dispatch(
        sendMsgSucceed({
          conversationId,
          message: resMsgFront,
        }),
      );
      console.log("sendMessage - Dispatched sendMsgSucceed for AI response");

      return data;
    } catch (error) {
      console.error("sendMessage - Error occurred:", error);
      dispatch(sendMsgFailed());
      console.log("sendMessage - Dispatched sendMsgFailed");
      console.error(
        "Error sending message:",
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  };
};

// Delete a conversation
export const deleteConversation = (conversationId: string) => {
  return async (dispatch: AppDispatch) => {
    console.log(
      `deleteConversation - Starting for conversationId: ${conversationId}`,
    );
    dispatch(deleteConReq());
    console.log("deleteConversation - Dispatched deleteConReq");
    try {
      const requestBody = {
        userId: localStorage.getItem("userId"),
        conversationId,
      };
      console.log("deleteConversation - Request body:", requestBody);

      console.log(
        "deleteConversation - Sending request to ${API_BASE}/api/AIchat/conversations/" +
          conversationId,
      );
      const response = await fetch(
        `${API_BASE}/api/AIchat/conversations/${conversationId}`,
        {
          method: "DELETE",
          headers: 
            getAuthHeaders(),
          body: JSON.stringify(requestBody),
        },
      );
      console.log("deleteConversation - Received response:", response);

      if (!response.ok) {
        console.error("deleteConversation - Network response was not ok");
        throw new Error("Network response was not ok");
      }

      const data: DeleteConversationResponse = await response.json();
      console.log("deleteConversation - Parsed JSON data:", data);
      dispatch(deleteConSucceed({ conversationId: data.conversationId }));
      console.log("deleteConversation - Dispatched deleteConSucceed");

      return data;
    } catch (error) {
      console.error("deleteConversation - Error occurred:", error);
      dispatch(deleteConFailed());
      console.log("deleteConversation - Dispatched deleteConFailed");
      console.error(
        "Error deleting conversation:",
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  };
};
