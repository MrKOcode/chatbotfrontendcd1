import { ChevronFirst, ChevronLast, Coffee } from "lucide-react";
import { createContext, useContext, useState } from "react";
import React from "react";
// sidebar context
const SidebarContext = createContext();

export default function SidebarLogic({ children }) {
  // collapse sidebar
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className={`campus-sidebar ${expanded ? "is-expanded" : "is-collapsed"}`}>
      <nav className="campus-sidebar-nav">
        <div className="campus-sidebar-controls">
          {!expanded && <Coffee size={22} aria-label="Campus Café" />}
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="campus-collapse-button"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="campus-sidebar-content">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

// logic for the sidebar items themselves
export function SidebarItem({ icon, text, active, alert, onClick, className = "" }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      onClick={onClick}
      className={`campus-sidebar-item group ${active ? "is-active" : ""} ${className}`}
    >
      {icon}
      <span
        className={`campus-sidebar-text ${expanded ? "is-visible" : ""}`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-red-400 ${
            expanded ? "" : "top-2"
          }
                `}
        />
      )}

      {!expanded && (
        <div
          className={`
                absolute left-full rounded-md px-2 py-1 ml-6
                bg-[#37553b] text-[#fffdf7] text-sm
                invisible opacity-20 -translate-x-3 transition-all
                group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
