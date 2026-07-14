import SelfAssessment from "../self_assessment/SelfAssessment";
import ChatComponent from "@/components/chat/chat-component.tsx";
import Sidebar, { SidebarItem } from "../sidebar/SidebarLogic";
import styles from "./Dashboard.module.css";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeCurrConId } from "@/redux/store/chat-state";
import { fetchConversationList } from "@/redux/api/chat-state-api";
import React from "react";
// sidebar icons
import { BotMessageSquare, NotebookPen, LogOut, User } from "lucide-react";

//adding two missing imports to solve the userquestion and answers cannot appear in the chat UI, mainly because of the conversationID not properly set
import { createConversation } from "@/redux/api/chat-state-api";






function Dashboard({ userInfo, onLogout }) {
  const [activeComponent, setActiveComponent] = useState("Assessment"); // Default to Assessment view
  const [selectedConId, setSelectedConId] = useState(null);
  const dispatch = useDispatch();

  const currentConId = useSelector((state) => state.chat.currentConId);
  const conList = useSelector((state) => state.chat.conversations);

//Solved no conversation ID=no messages shown in chat window, chat-input has nowhere to send
  useEffect(() => {
    const initializeChat = async () => {
      await dispatch(fetchConversationList());
  
      // Only create a new conversation if none exist
      const conCount = Object.keys(conList || {}).length;
      if (conCount === 0) {
        const newConId = await dispatch(createConversation());
        dispatch(changeCurrConId({conversationId:newConId}));
        setSelectedConId(newConId); // Also set local state to highlight sidebar item
      }
    };
    initializeChat();
  }, []);
  



  // Enhanced logging for conList
  useEffect(() => {
    // Table format for better visualization
    if (conList === undefined) return;
    if (conList && Object.keys(conList).length > 0) {
      console.table(
        Object.values(conList).map((con) => ({
          id: con.conId,
          title: con.conTitle,
          messageCount: con.messages?.length || 0,
        })),
      );
    }
  }, [conList]);

  // Log when active component changes
  useEffect(() => {
    console.log("Active component changed:", activeComponent);
  }, [activeComponent]);

  // Log when selected conversation ID changes
  useEffect(() => {
    console.log("Selected conversation ID changed:", selectedConId);
    if (selectedConId) {
      dispatch(changeCurrConId({ conversationId: selectedConId }));
    }
  }, [selectedConId, dispatch]);

  // Log when current conversation ID from Redux changes
  useEffect(() => {
    console.log("Current conversation ID from Redux:", currentConId);
  }, [currentConId]);

  const mapConversations = useMemo(() => {
    console.log(
      "Rendering conversations list with:",
      Object.values(conList || {}),
    );
    return Object.values(conList || {}) // Ensure conList is not undefined or null
      .filter((con) => con !== null) // Filter out null values
      .map((con) => (
        <SidebarItem
          key={con.conId}
          text={con.conTitle}
          active={selectedConId === currentConId}
          onClick={() => {
            console.log("Conversation selected:", con.conId);
            setSelectedConId(con.conId);
          }}
        />
      ));
  }, [conList, selectedConId, currentConId]);

  return (
    <div className={styles.dashContainer}>
      <Sidebar>
        {/* User info section */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <User size={16} />
            <span className={styles.username}>
              {userInfo?.username || 'User'}
            </span>
          </div>
          <div className={styles.userRole}>
            {userInfo?.role || 'user'}
          </div>
        </div>

        {/* sidebar item is for the different pages we have for now 2 */}
        {/* each item can take an icon, text, active(user clicked on), and an alert */}
        <SidebarItem
          icon={<BotMessageSquare size={20} />}
          text="Chat"
          active={activeComponent === "Chat"}
          onClick={() => setActiveComponent("Chat")}
        />

        {mapConversations}

        <SidebarItem
          icon={<NotebookPen size={20} />}
          text="Assessment"
          active={activeComponent === "Assessment"}
          alert
          onClick={() => setActiveComponent("Assessment")}
        />

        {/* Logout button at the bottom */}
        <div className={styles.logoutSection}>
          <SidebarItem
            icon={<LogOut size={20} />}
            text="Logout"
            onClick={onLogout}
            className={styles.logoutButton}
          />
        </div>
      </Sidebar>
      {activeComponent === "Chat" ? <ChatComponent /> : <SelfAssessment />}
    </div>
  );
}

export default Dashboard;
