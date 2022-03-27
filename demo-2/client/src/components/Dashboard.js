import React from "react";
import { useConversations } from "../contexts/ConversationContext";
import OpenConversation from "./OpenConversation";
import Sidebar from "./Sidebar";

export default function Dashboard({ id }) {
  const { selectConversation } = useConversations();
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar id={id} />
      {selectConversation && <OpenConversation />}
    </div>
  );
}
