import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchChatHistory } from "@/services/chatHistoryApi";
import styles from "./ChatHistory.module.css";

const ChatHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const userRole = localStorage.getItem("userRole") || "user";
  const isAdmin = userRole === "admin";

  const loadHistory = useCallback(
    async (adminTarget) => {
      setLoading(true);
      setError("");

      try {
        const exchanges = await fetchChatHistory(
          isAdmin && adminTarget ? adminTarget : undefined,
        );
        setHistory(exchanges);
      } catch (requestError) {
        setHistory([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load chat history.",
        );
      } finally {
        setLoading(false);
      }
    },
    [isAdmin],
  );

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const filteredHistory = useMemo(() => {
    const keyword = searchKeyword.trim().toLocaleLowerCase();
    if (!keyword) return history;

    return history.filter(
      (exchange) =>
        exchange.userMessage.toLocaleLowerCase().includes(keyword) ||
        exchange.response.toLocaleLowerCase().includes(keyword),
    );
  }, [history, searchKeyword]);

  const handleAdminLookup = (event) => {
    event.preventDefault();
    void loadHistory(targetUserId.trim());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
  };

  return (
    <div className={styles.chatHistoryContainer}>
      <div className={styles.header}>
        <h2>Chat History</h2>
      </div>

      <div className={styles.content}>
        <div className={styles.historyPanel}>
          <div className={styles.searchPanel}>
            {isAdmin && (
              <form className={styles.searchRow} onSubmit={handleAdminLookup}>
                <label className={styles.selectedUserTitle} htmlFor="target-user-id">
                  View a user&apos;s history
                </label>
                <input
                  id="target-user-id"
                  type="text"
                  placeholder="Cognito user ID (blank means your history)"
                  value={targetUserId}
                  onChange={(event) => setTargetUserId(event.target.value)}
                  className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                  Load history
                </button>
              </form>
            )}

            <div className={styles.searchRow}>
              <label className={styles.selectedUserTitle} htmlFor="history-search">
                Search loaded history
              </label>
              <input
                id="history-search"
                type="search"
                placeholder="Search questions and responses"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.chatContainer}>
            {loading ? (
              <div className={styles.loading}>Loading chat history...</div>
            ) : error ? (
              <div className={styles.noData} role="alert">
                {error}
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className={styles.noData}>No chat history found.</div>
            ) : (
              <div className={styles.messagesContainer}>
                {filteredHistory.map((exchange, index) => {
                  const key = `${exchange.timestamp}-${index}`;
                  return (
                    <React.Fragment key={key}>
                      <div className={`${styles.messageWrapper} ${styles.userMessage}`}>
                        <div className={styles.messageContent}>
                          <div className={styles.messageText}>{exchange.userMessage}</div>
                          <div className={styles.messageInfo}>
                            <span className={styles.messageTime}>
                              {formatDate(exchange.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`${styles.messageWrapper} ${styles.aiMessage}`}>
                        <div className={styles.messageContent}>
                          <div className={styles.messageText}>{exchange.response}</div>
                          <div className={styles.messageInfo}>
                            <span className={styles.messageTime}>
                              {formatDate(exchange.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
