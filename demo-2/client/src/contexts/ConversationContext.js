import React, { useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContacts } from "./ContactContext";

const ConversationContext = React.createContext();

export function useConversations() {
  return useContext(ConversationContext);
}

export function ConversationProvider({ id, children }) {
  const [conversations, setConversations] = useLocalStorage(
    "conversations",
    []
  );

  const [selectConversationIndex, setSelectConversationIndex] = useState(0);

  const { contacts } = useContacts();

  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.recipients.map((recipient) => {
      const contact = contacts.find((contact) => recipient === contact.id);
      const name = (contact && contact.name) || recipient;

      return { id: recipient, name };
    });

    const messages = conversation.messages.map((message) => {
      const contact = contacts.find((contact) => contact.id === message.sender);
      const name = (contact && contact.name) || message.sender;
      const fromMe = id === message.sender;

      return {
        ...message,
        senderName: name,
        fromMe,
      };
    });

    const selected = selectConversationIndex === index;

    return { ...conversation, messages, recipients, selected };
  });

  function addMessageToConversation({ recipients, text, sender }) {
    setConversations((prevConversations) => {
      let madeChange = false;
      let newMessage = { sender, text };
      const newConversation = conversations.map((conversation) => {
        if (arrayEquality(conversation.recipients, recipients)) {
          madeChange = true;
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage],
          };
        }

        return conversation;
      });
      if (madeChange) {
        // 比较复杂的地方
        return newConversation;
      } else {
        return [...prevConversations, { recipients, messages: [newMessage] }];
      }
    });
  }

  function sendMessage(recipients, text) {
    addMessageToConversation({ recipients, text, sender: id });
  }

  function createConversation(recipients) {
    setConversations((prevConversations) => {
      return [...prevConversations, { recipients, messages: [] }];
    });
  }

  const value = {
    conversations: formattedConversations,
    selectConversationIndex: setSelectConversationIndex,
    selectConversation: formattedConversations[selectConversationIndex],
    createConversation,
    sendMessage,
  };

  console.log("ConversationContext", value);

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

function arrayEquality(a, b) {
  if (a.length !== b.length) return false;

  a.sort();
  b.sort();

  return a.every((ele, index) => ele === b[index]);
}
