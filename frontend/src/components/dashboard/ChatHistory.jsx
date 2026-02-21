import React, { useState, useEffect } from "react";
import styles from "./ChatHistory.module.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});


const ChatHistory = () => {
  const [userRole, setUserRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(20);
  const [adminChatSummary, setAdminChatSummary] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    setUserRole(role);
    setCurrentUserId(userId);

    if (role === "admin") {
      fetchAllUsers();
      fetchAdminChatSummary(userId);
    } else {
      setSelectedUserId(userId);
      fetchChatHistory(userId);
    }
  }, []);

  const fetchAdminChatSummary = async (adminUserId) => {
    try {
      const response = await fetch(
  `${API_BASE}/api/AIchat/history/?userId=${adminUserId}`,
  { method: "GET", headers: getAuthHeaders() }
);
      const data = await response.json();
      
      if (data.total > 0) {
        setAdminChatSummary({
          userId: adminUserId,
          username: "Admin",
          messageCount: data.total,
          lastChatTime: data.messages && data.messages.length > 0 ? data.messages[0].createdAt : new Date().toISOString()
        });
      } else {
        setAdminChatSummary({
          userId: adminUserId,
          username: "Admin",
          messageCount: 0,
          lastChatTime: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error fetching admin chat summary:", error);
      setAdminChatSummary({
        userId: adminUserId,
        username: "Admin",
        messageCount: 0,
        lastChatTime: new Date().toISOString()
      });
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
  `${API_BASE}/api/AIchat/admin/users`,
  { method: "GET", headers: getAuthHeaders() }
);

      const data = await response.json();
      
      if (data.users && data.users.length > 0) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (userId, page = 1) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      
      if (searchKeyword) {
        params.append("keyword", searchKeyword);
      }
      
      const response = await fetch(
  `${API_BASE}/api/AIchat/history/?userId=${userId}&${params.toString()}`,
  { method: "GET", headers: getAuthHeaders() }
);

      const data = await response.json();
      
      if (data.messages && Array.isArray(data.messages)) {
        setChatHistory(data.messages);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(page);
      } else {
        setChatHistory([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setChatHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    setCurrentPage(1);
    fetchChatHistory(userId, 1);
  };

  const handleSearch = () => {
    if (selectedUserId) {
      setCurrentPage(1);
      fetchChatHistory(selectedUserId, 1);
    }
  };

  const handlePageChange = (newPage) => {
    if (selectedUserId && newPage >= 1 && newPage <= totalPages) {
      fetchChatHistory(selectedUserId, newPage);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("zh-CN");
  };

  const renderMessage = (message) => {
    const isUser = message.messageType === "user";
    return (
      <div key={message.id} className={`${styles.messageWrapper} ${isUser ? styles.userMessage : styles.aiMessage}`}>
        <div className={styles.messageContent}>
          <div className={styles.messageText}>
            {message.content}
          </div>
          <div className={styles.messageInfo}>
            <span className={styles.messageTime}>
              {formatDate(message.createdAt)}
            </span>
            {message.conversationId && (
              <span className={styles.conversationId}>
                ConvId: {message.conversationId}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getSelectedUserDisplayName = () => {
    if (selectedUserId == currentUserId) {
      return "Chat History";
    }
    const selectedUser = users.find(u => u.userId == selectedUserId);
    return selectedUser ? `${selectedUser.username} 's chat history` : "Chat History";
  };

  return (
    <div className={styles.chatHistoryContainer}>
      <div className={styles.header}>
        <h2>💬 Chat History</h2>
      </div>

      <div className={styles.content}>
        {userRole === "admin" && (
          <div className={styles.userList}>
            <h3>👥 User List</h3>
            {loading && !selectedUserId ? (
              <div className={styles.loading}>Loading...</div>
            ) : (
              <div className={styles.userItems}>
                {adminChatSummary && (
                  <div
                    className={`${styles.userItem} ${styles.adminItem} ${
                      selectedUserId == currentUserId ? styles.selected : ""
                    }`}
                    onClick={() => handleUserSelect(currentUserId)}
                  >
                    <div className={styles.userName}>
                      👤 Chat history
                    </div>
                    <div className={styles.userStats}>
                      <span>Message count: {adminChatSummary.messageCount}</span>
                      <span>Last chat: {formatDate(adminChatSummary.lastChatTime)}</span>
                    </div>
                  </div>
                )}
                
                {adminChatSummary && users.length > 0 && (
                  <div className={styles.separator}>
                    <span>All users</span>
                  </div>
                )}
                
                {users.length > 0 ? (
                  users.map((user) => (
                    <div
                      key={`${user.userId}-${user.username}`}
                      className={`${styles.userItem} ${
                        selectedUserId == user.userId ? styles.selected : ""
                      }`}
                      onClick={() => handleUserSelect(user.userId)}
                    >
                      <div className={styles.userName}>{user.username}</div>
                      <div className={styles.userStats}>
                        <span>Message count: {user.messageCount}</span>
                        <span>Last chat: {formatDate(user.lastChatTime)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noData}>No user data available</div>
                )}
              </div>
            )}
          </div>
        )}

        <div className={styles.historyPanel}>
          {selectedUserId && (
            <>
              <div className={styles.searchPanel}>
                <div className={styles.searchRow}>
                  <div className={styles.selectedUserTitle}>
                    {getSelectedUserDisplayName()}
                  </div>
                  <input
                    type="text"
                    placeholder="Search key words..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className={styles.searchInput}
                  />
                  <button onClick={handleSearch} className={styles.searchButton}>
                    🔍 Search
                  </button>
                </div>
              </div>

              <div className={styles.chatContainer}>
                {loading ? (
                  <div className={styles.loading}>Loading...</div>
                ) : (
                  <>
                    {chatHistory.length > 0 ? (
                      <div className={styles.messagesContainer}>
                        {chatHistory.map(renderMessage)}
                      </div>
                    ) : (
                      <div className={styles.noData}>No chat record</div>
                    )}
                  </>
                )}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={styles.pageButton}
                  >
                    Previous Page
                  </button>
                  <span className={styles.pageInfo}>
                     Current Page: {currentPage} ，Total Page: {totalPages} 
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={styles.pageButton}
                  >
                    Next Page
                  </button>
                </div>
              )}
            </>
          )}

          {!selectedUserId && userRole === "admin" && (
            <div className={styles.selectPrompt}>
              👈 Select a user to view chat history
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;