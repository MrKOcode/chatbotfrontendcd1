// Basic Datastructures for conversation database
export interface Message {
  content: string;
  role: "send" | "ai";
  createdAt: string;
  id: string;
}

export interface ApiMessage {
  id: string;
  conversationId: string;
  userId: string;
  role: "user" | "chatbot" | "system";
  content: string;
  createdAt: string;
}

export interface AssessmentData {
  conversationId: string;
  definitions: string;
  strategy: string;
  problemSolving: string;
  rationale: string;
}

export interface Pagination {
  total: number;
  hasMore: boolean;
  offset: number;
}

export interface Conversation {
  userId: string;
  id: string;
  title: string;
  mode: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationList {
  userId: string;
  conversationId: string;
  data: Conversation[];
}

export interface ConversationContent {
  userId: string;
  conversationId: string;
  content: ApiMessage[];
  pagination: Pagination;
}

// Request and Response Datastructures

// Assessment Request will be responded with a MessageResponse
export interface AssessmentRequest {
  userId: string;
  conversationId: string;
  assessment: AssessmentData;
}

// MessageRequest will be responded with a MessageResponse
export interface SendMessageRequest {
  userId: string;
  conversationId: string;
  message: Message;
}

export interface SendMessageResponse {
  userId: string;
  conversationId: string;
  message: ApiMessage;
  response: ApiMessage;
  conversation: Conversation;
}

// NewConversationRequest will be responded with a NewConversationResponse
export interface NewConversationRequest {
  userId: string;
}

export interface NewConversationResponse {
  userId: string;
  conversationId: string;
  conversation: Conversation;
}

// DeleteConversationRequest will be responded with a DeleteConversationResponse
export interface DeleteConversationRequest {
  userId: string;
  conversationId: string;
}

export interface DeleteConversationResponse {
  userId: string;
  conversationId: string;
}

// ListConversationsRequest will be responded with a ListConversationsResponse
export interface ListConversationsRequest {
  userId: string;
}

export interface ListConversationsResponse {
  userId: string;
  content: ConversationList;
}

// ConversationContentRequest will be responded with a ConversationContentResponse
export interface ConversationContentRequest {
  userId: string;
  conversationId: string;
  pagination: Pagination;
}

export interface ConversationContentResponse {
  userId: string;
  conversationId: string;
  content: ConversationContent;
}

// SubmitAssessmentRequest will be responded with a SubmitAssessmentResponse
export interface SubmitAssessmentRequest {
  userId: string;
  conversationId: string;
  assessment: AssessmentData;
}

export interface SubmitAssessmentResponse {
  userId: string;
  conversationId: string;
  conversation: Conversation;
  response: Message;
}

// AssessmentRequest will be responded with an AssessmentResponse
export interface AssessmentRequest {
  userId: string;
  conversationId: string;
}

export interface AssessmentResponse {
  userId: string;
  conversationId: string;
  assessment: AssessmentData;
}
